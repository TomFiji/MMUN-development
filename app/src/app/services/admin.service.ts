import { ToastDuration, ToastService, ToastStyle } from './toast.service';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { Router } from '@angular/router';
import { ReportModel } from './../interfaces/report-model';
import { UserModel } from 'src/app/interfaces/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectCardModel } from '../interfaces/project-card.model';
import { AdminSection } from '../enums/admin-section';
import { UserStatus } from '../enums/user-status';

@Injectable()
export class AdminService {
  private users: UserModel[] = [];
  private users$ = new BehaviorSubject<UserModel[]>(this.users);

  private reports: ReportModel[] = [];
  private reports$ = new BehaviorSubject<ReportModel[]>(this.reports);

  private projects: ProjectCardModel[] = [];
  private projects$ = new BehaviorSubject<ProjectCardModel[]>(this.projects);

  pages!: { [key in AdminSection]: number };

  constructor(
    private router: Router,
    private userDAOService: UserDAOService,
    private projectDAOService: ProjectDAOService,
    private toastService: ToastService
  ) {
    this.pages = {
      users: 0,
      reports: 0,
      projects: 0,
    };
    this.loadMore(AdminSection.PROJECTS);
    this.loadMore(AdminSection.REPORTS);
    this.loadMore(AdminSection.USERS);
  }

  getUsers(): Observable<UserModel[]> {
    return this.users$.asObservable();
  }

  getReport(): Observable<ReportModel[]> {
    return this.reports$.asObservable();
  }

  getProjects(): Observable<ProjectCardModel[]> {
    return this.projects$.asObservable();
  }

  banUser(id: string) {
    this.userDAOService.banUser(id).subscribe(() => {
      this.users.find((user) => user._id === id).status = UserStatus.BANNED;
      this.users$.next(this.users);
    });
  }

  unBanUser(id: string) {
    this.userDAOService.unBanUser(id).subscribe(() => {
      this.users.find((user) => user._id === id).status = UserStatus.ACTIVE;
      this.users$.next(this.users);
    });
  }

  editElement(section: AdminSection, id: string) {
    switch (section) {
      case AdminSection.PROJECTS:
        this.router.navigateByUrl(`/project/${id}/edit`);
        break;
      case AdminSection.USERS:
        this.router.navigateByUrl(`/admin/user/${id}/edit`);
        break;
    }
  }

  deleteElement(section: AdminSection, id: string) {
    this.toastService.showToast({
      message: 'core.delete.item',
      style: ToastStyle.WARNING,
      duration: ToastDuration.LONG,
      icon: 'trash-outline',
      buttons: [
        {
          text: 'core.delete',
          handler: () => {
            switch (section) {
              case AdminSection.PROJECTS:
                this.projectDAOService.deleteProject(id);
                break;
              case AdminSection.USERS:
                this.userDAOService.deleteUserByID(id);
                break;
              case AdminSection.REPORTS:
                this.projectDAOService.deleteProjectReport(id);
                break;
            }
          },
        },
        {
          text: 'core.cancel',
          role: 'cancel',
        },
      ],
    });
  }

  loadMore(section: AdminSection): Promise<boolean> {
    const nextPage = ++this.pages[section];
    return new Promise((resolve, reject) => {
      switch (section) {
        case AdminSection.PROJECTS:
          this.projectDAOService
            .loadProjects(nextPage)
            .subscribe((projects) => {
              if (!projects || !projects.length) {
                return resolve(true);
              }
              this.projects.push(...projects);
              this.projects$.next(this.projects);
              return resolve(false);
            });
          break;
        case AdminSection.USERS:
          this.userDAOService.getUsers(nextPage).subscribe((users) => {
            if (!users || !users.length) {
              return resolve(true);
            }
            this.users.push(...users);
            this.users$.next(this.users);
            return resolve(false);
          });
          break;
        case AdminSection.REPORTS:
          this.projectDAOService.loadReports(nextPage).subscribe((reports) => {
            if (!reports || !reports.length) {
              return resolve(true);
            }
            this.reports.push(...reports);
            this.reports$.next(this.reports);
            return resolve(false);
          });
          break;
      }
    });
  }
}
