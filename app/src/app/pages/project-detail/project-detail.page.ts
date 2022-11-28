import { ToastStyle } from 'src/app/services/toast.service';
import { ToastService } from './../../services/toast.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectModel } from 'src/app/interfaces/project.model';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { SubSink } from 'subsink';
import { Location } from '@angular/common';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { SDGLogos } from 'src/app/enums/sdg';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hmn-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit, OnDestroy {
  @ViewChild('mainImage') mainImage;

  /**This variable should use the user dao service to find if the current project is favorited */
  favorited = false;

  /**Used for UI purposes */
  heartType = 'heart-outline';
  readMore = false;
  moreOptions = false;
  hideImage = 0;
  sdgLogos = SDGLogos;
  project: ProjectModel;
  isProjectOpen = false;
  private subscriptions = new SubSink();

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectDAOService: ProjectDAOService,
    private userDAOService: UserDAOService,
    private toastService: ToastService,
    private location: Location,
  ) { }

  /**Replaces the main image based on user selection */
  onImgClick(event, index) {
    const src = event.srcElement.currentSrc;
    const prev = document.getElementById('preview') as HTMLImageElement;
    prev.src = src;
    this.hideImage = index;
  }

  /**Changes the favorite button based on user click. Needs the user dao for changing the values of favorite */
  onFavorited() {
    if (this.favorited) {
      this.heartType = 'heart-outline';
      this.favorited = false;
      this.userDAOService.removeProjectToUserFavorites(this.project._id);
    } else {
      this.heartType = 'heart';
      this.favorited = true;
      this.userDAOService.addProjectToUserFavorites(this.project);
    }
  }

  /**Responsible for displaying menu popover for more options */
  onMoreOptions(value: boolean) {
    this.moreOptions = value;
  }

  /**Functionality for user click on the report button */
  onReport(event: Event) {
    this.projectDAOService.reportProject(this.project._id);
    this.onMoreOptions(false);
  }

  /**Functionality for user click on the share button */
  onShare(event: Event) {
    navigator && navigator.clipboard.writeText(location.href);
    this.toastService.showToast({
      message: 'pages.projectDetail.share.copied',
      style: ToastStyle.SUCCESS,
    });
    this.onMoreOptions(false);
  }

  onBack() {
    this.location.back();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params.projectId) {
          this.projectDAOService
            .getProjectById(params.projectId)
            .subscribe((project) => {
              if (project) {
                this.project = project;
                this.isProjectOpen = new Date(project.closeDate).getTime() > Date.now()
                this.favorited = this.userDAOService.isProjectFavorited(
                  project._id
                );
                this.heartType = this.favorited ? 'heart' : 'heart-outline';
              }
            });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
