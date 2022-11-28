import {
  ToastDuration,
  ToastService,
  ToastStyle,
} from './../../services/toast.service';
import { SDG } from 'src/app/enums/sdg';
import { SDGArray } from './../../enums/sdg';
import {
  NewProjectModel,
  ProjectModel,
} from './../../interfaces/project.model';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { SubSink } from 'subsink';
import { ProjectPageMode } from './../../enums/project-page-mode';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'hmn-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit, OnDestroy {
  pageMode!: ProjectPageMode;
  isNew!: boolean;
  sdgArray = SDGArray;
  sdgEnum = SDG;
  today = new Date().toISOString();
  private subscriptions = new SubSink();

  currentProject: NewProjectModel | ProjectModel = {
    title: '',
    subtitle: '',
    images: [],
    description: '',
    impactStatement: '',
    abstract: '',
    sdg: [],
    country: '',
    openDate: '',
    closeDate: '',
    isSponsored: false,
  };
  form = {
    touched: {
      title: false,
      subtitle: false,
      images: false,
      description: false,
      impactStatement: false,
      abstract: false,
      sdg: false,
      country: false,
      openDate: false,
      closeDate: false,
      isSponsored: false,
    },
    errors: {
      title: '',
      subtitle: '',
      images: '',
      description: '',
      impactStatement: '',
      abstract: '',
      sdg: '',
      country: '',
      openDate: '',
      closeDate: '',
      isSponsored: '',
    },
    maxLength: {
      title: 100,
      subtitle: 150,
      description: 3000,
      impactStatement: 200,
      abstract: 300,
      country: 60,
    },
    isValid: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectDAOService: ProjectDAOService,
    private toastService: ToastService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.data.subscribe((data) => {
        if (data.mode) {
          this.pageMode = data.mode;
          this.isNew = this.pageMode === ProjectPageMode.NEW;
        }
      }),
      this.activatedRoute.params.subscribe((params) => {
        if (params.projectId) {
          this.resetProject();
          this.projectDAOService
            .getProjectById(params.projectId)
            .subscribe((project) => {
              if (project) {
                this.currentProject = project;
              }
            });
        }
      })
    );
  }

  getNextDay(today) {
    return new Date(new Date(today).getTime() + 86400000).toISOString();
  }

  onBack() {
    this.location.back();
  }

  validateForm() {
    let isValid = true;
    const fields = Object.keys(this.form.errors);
    fields.forEach((field) => {
      this.form.errors[field] = '';
      if (
        typeof this.currentProject[field] === 'string' &&
        this.currentProject[field].trim().length === 0
      ) {
        this.form.errors[field] = 'errors.field.required';
        isValid = false;
      } else {
        if (field === 'sdg' && this.currentProject[field].length > 3) {
          this.form.errors[field] = 'errors.field.sdg.max';
          isValid = false;
        } else if (
          field === 'images' &&
          this.currentProject[field].length === 0
        ) {
          this.form.errors[field] = 'errors.field.requiredImage';
          //isValid = false;
        }
      }
    });

    this.form.isValid = isValid;
    return isValid;
  }

  uploadImage(event) {
    if (!event.target.files || !event.target.files.length) {
      return;
    }
    const files = event.target.files;
    const formData = new FormData();
    formData.append('image', files[0]);
    this.projectDAOService
      .uploadImage(formData)
      .then((imageUrl) => {
        this.currentProject.images.push(imageUrl);
        this.validateForm();
      })
      .catch(); // handled by DAO
  }

  removeImage(url: string) {
    this.projectDAOService
      .removeImage(url)
      .then(() => {
        this.currentProject.images = this.currentProject.images.filter(
          (img) => img !== url
        );
        this.validateForm();
      })
      .catch(); // handled by DAO
  }

  onSubmit() {
    if (this.validateForm()) {
      if (this.isNew) {
        const project: NewProjectModel = {
          ...(this.currentProject as NewProjectModel),
          openDate: new Date(this.currentProject.openDate),
          closeDate: new Date(this.currentProject.closeDate),
        };
        this.projectDAOService.createProject(project);
      } else {
        const project: ProjectModel = {
          ...(this.currentProject as ProjectModel),
          openDate: new Date(this.currentProject.openDate),
          closeDate: new Date(this.currentProject.closeDate),
        };
        this.projectDAOService.updateProject(project as ProjectModel);
      }
    } else {
      Object.keys(this.form.touched).forEach(
        (key) => (this.form.touched[key] = true)
      );
      this.toastService.showToast({
        message: 'errors.field.fixIt',
        style: ToastStyle.ERROR,
        duration: ToastDuration.MEDIUM,
      });
    }
  }

  resetProject() {
    this.currentProject = {
      title: '',
      subtitle: '',
      images: [],
      description: '',
      impactStatement: '',
      abstract: '',
      sdg: [],
      country: '',
      openDate: '',
      closeDate: '',
      isSponsored: false,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
