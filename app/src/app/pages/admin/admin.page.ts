import { UserModel } from 'src/app/interfaces/user.model';
import { AdminSection } from './../../enums/admin-section';
import { AdminService } from './../../services/admin.service';
import { DetailedCardModel } from './../../components/detailed-card/detailed-card.component';
import { Component, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { ReportModel } from 'src/app/interfaces/report-model';
import { UserStatus } from 'src/app/enums/user-status';

@Component({
  selector: 'hmn-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnDestroy {
  private subscriptions = new SubSink();
  sections = AdminSection;

  projects: DetailedCardModel[] = [];
  reports: DetailedCardModel[] = [];
  users: DetailedCardModel[] = [];

  constructor(private adminService: AdminService) {
    this.subscriptions.add(
      this.adminService
        .getProjects()
        .subscribe(
          (projects) => (this.projects = this.convertProjects(projects))
        ),
      this.adminService
        .getReport()
        .subscribe((reports) => (this.reports = this.convertReports(reports))),
      this.adminService
        .getUsers()
        .subscribe((users) => (this.users = this.convertUsers(users)))
    );
  }

  convertProjects(projects: ProjectCardModel[]): DetailedCardModel[] {
    return projects.map((project) => ({
      title: project.title,
      id: project._id,
      href: '/project/' + project._id,
      imgUrl: project.images[0],
      details: [
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
            this.adminService.editElement(AdminSection.PROJECTS, projectId),
        },
        {
          icon: 'trash-outline',
          label: 'core.delete',
          action: (projectId) =>
            this.adminService.deleteElement(AdminSection.PROJECTS, projectId),
        },
      ],
    }));
  }

  convertReports(reports: ReportModel[]): DetailedCardModel[] {
    return reports.map((report) => ({
      title: report.message,
      id: report._id,
      href: '/project/' + report.projectId,
      details: [
        {
          label: 'pages.admin.status.submissionDate',
          value: report.submissionDate.toLocaleString(),
        },
        {
          label: 'pages.admin.status.reporter',
          value: report.reporter,
        },
      ],
      options: [
        {
          icon: 'trash-outline',
          label: 'core.delete',
          action: (reportId) =>
            this.adminService.deleteElement(AdminSection.REPORTS, reportId),
        },
      ],
    }));
  }

  convertUsers(users: UserModel[]): DetailedCardModel[] {
    return users.map((user) => ({
      title: user.firstName + ' ' + user.lastName,
      id: user._id,
      href: '/admin/user/' + user._id + '/edit',
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
            this.adminService.editElement(AdminSection.USERS, userId),
        },
        {
          icon: 'trash-outline',
          label: 'core.delete',
          action: (userId) =>
            this.adminService.deleteElement(AdminSection.USERS, userId),
        },
        ...(user.status === UserStatus.ACTIVE
          ? [
              {
                icon: 'ban-outline',
                label: 'pages.admin.status.ban',
                action: (userId) => this.adminService.banUser(userId),
              },
            ]
          : user.status === UserStatus.BANNED
          ? [
              {
                icon: 'ban-outline',
                label: 'pages.admin.status.unBan',
                action: (userId) => this.adminService.unBanUser(userId),
              },
            ]
          : []),
      ],
    }));
  }

  loadData({ event, name }) {
    this.adminService
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
