import { ToastDuration, ToastService, ToastStyle } from '../../services/toast.service';
import { UserModel } from 'src/app/interfaces/user.model';
import { TeacherSection } from '../../enums/teacher-section';
import { TeacherService } from '../../services/teacher.service';
import { DetailedCardModel } from '../../components/detailed-card/detailed-card.component';
import { Component, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { ReportModel } from 'src/app/interfaces/report-model';
import { UserStatus } from 'src/app/enums/user-status';
import { toastController } from '@ionic/core';
import { waitForAsync } from '@angular/core/testing';
import { interval } from 'rxjs';

@Component({
  selector: 'hmn-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnDestroy {
  private subscriptions = new SubSink();
  sections = TeacherSection;

  projects: DetailedCardModel[] = [];
  users: DetailedCardModel[] = [];
  interval: any;

  constructor(private toastService: ToastService, 
    private teacherService: TeacherService) {
      this.interval = setInterval(() => { 
          this.refreshData(); 
          clearInterval(this.interval);
      }, 1);
  }

  refreshData(){
    this.subscriptions.add(
      this.teacherService
        .getUsers()
        .subscribe((users) => (this.users = this.convertUsers(users))),
    );
    this.subscriptions.add(
      this.teacherService
        .getProjects()
        .subscribe(
          (projects) => (this.projects = this.convertProjects(projects)))
    );
  }

  convertProjects(projects: ProjectCardModel[]): DetailedCardModel[] {
    const temp = projects.map((project) => ({
      title: project.title,
      id: project._id,
      href: '/project/' + project._id,
      imgUrl: project.images[0],
      details: [
        {
          label: 'pages.project.userid',
          value: project.createdBy,
        },
        {
          label: 'pages.project.subtitle',
          value: project.subtitle,
        },
        {
          label: 'core.country',
          value: project.country,
        },
        {
          label: 'pages.project.openDate',
          value: project.openDate.toLocaleString(),
        },
        {
          label: 'pages.project.closeDate',
          value: project.closeDate.toLocaleString(),
        },
        {
          label: 'pages.project.isSponsored',
          value: project.isSponsored ? 'core.yes' : 'core.no',
        },
        {
          label: 'core.votes',
          value: project.votes?.for?.toString() || '0',
        },
      ],
      options: [
        {
          icon: 'create-outline',
          label: 'core.edit',
          action: (projectId) =>
            this.teacherService.editElement(TeacherSection.PROJECTS, projectId),
        },
        {
          icon: 'trash-outline',
          label: 'core.delete',
          action: (projectId) =>
            this.teacherService.deleteElement(TeacherSection.PROJECTS, projectId),
        },
      ],
    }));
    
    const arr = Array.from(temp).filter((value, key) => {
      let inMap = false;
      for(let i = 0; i < this.users.length; i++){
        if (value.details[0].value === this.users[i].id) {
          inMap = true;
        }
      }
      return inMap;
    });
    return arr;
  }

  convertUsers(users: UserModel[]): DetailedCardModel[] {
    const test = users.map((user) => ({
      title: user.firstName + ' ' + user.lastName,
      id: user._id,
      href: '/teacher/user/' + user._id + '/edit',
      imgUrl: user.profilePicture,
      details: [
        {
          label: 'core.email',
          value: user.email,
        },
        {
          label: 'core.country',
          value: user.country,
        },
        {
          label: 'core.group',
          value: user.group,
        },
        {
          label: 'core.birthDate',
          value:  new Date(user.birthDate).getFullYear().toString(),
        },
        {
          label: 'core.userStatus',
          value: user.status || '',
        },
      ],
      options: [
        {
          icon: 'create-outline',
          label: 'core.edit',
          action: (userId) =>
            this.teacherService.editElement(TeacherSection.USERS, userId),
        },
        {
          icon: 'trash-outline',
          label: 'core.delete',
          action: (userId) =>
            this.teacherService.deleteElement(TeacherSection.USERS, userId),
        },
      ],
    }));

    const arr = Array.from(test).filter((value, key) => {
      if (value.details[2].value === this.teacherService.teacherGroup()) {
        return true;
      }
      return false;
    });
    return arr;
  }

  loadData({ event, name }) {
    this.teacherService
      .loadMore(name)
      .then((done) => {
        if (done) {
          event.target.disabled = true;
        }
        event.target.complete();
      })
      .catch(() => {
        event.target.complete();
        event.target.disabled = true;
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}


