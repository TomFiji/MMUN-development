import { ToastDuration, ToastService, ToastStyle } from './toast.service';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { Router } from '@angular/router';
import { ReportModel } from './../interfaces/report-model';
import { UserModel } from 'src/app/interfaces/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectCardModel } from '../interfaces/project-card.model';
import { TeacherSection } from '../enums/teacher-section';
import { UserStatus } from '../enums/user-status';

@Injectable()
export class TeacherService {
  private users: UserModel[] = [];
  private users$ = new BehaviorSubject<UserModel[]>(this.users);

  private projects: ProjectCardModel[] = [];
  private projects$ = new BehaviorSubject<ProjectCardModel[]>(this.projects);

  pages!: { [key in TeacherSection]: number };

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
    this.loadMore(TeacherSection.PROJECTS);
    this.loadMore(TeacherSection.USERS);
  }

  getUsers(): Observable<UserModel[]> {
    return this.users$.asObservable();
  }

 teacherGroup(): string{
    return this.userDAOService?.teacherGroup;
  }


  getProjects(): Observable<ProjectCardModel[]> {
    return this.projects$.asObservable();
  }

  editElement(section: TeacherSection, id: string) {
    switch (section) {
      case TeacherSection.PROJECTS:
        this.router.navigateByUrl(`/project/${id}/edit`);
        break;
      case TeacherSection.USERS:
        this.router.navigateByUrl(`/teacher/user/${id}/edit`);
        break;
    }
  }

  deleteElement(section: TeacherSection, id: string) {
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
              case TeacherSection.PROJECTS:
                this.projectDAOService.deleteProject(id);
                break;
              case TeacherSection.USERS:
                this.userDAOService.deleteUserByID(id);
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

  loadMore(section: TeacherSection): Promise<boolean> {
    const nextPage = ++this.pages[section];
    return new Promise((resolve, reject) => {
      switch (section) {
        case TeacherSection.PROJECTS:
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
        case TeacherSection.USERS:
          this.userDAOService.getUsersByGroup(nextPage).subscribe((users) => {
            if (!users || !users.length) {
              return resolve(true);
            }
            this.users.push(...users);
            this.users$.next(this.users);
            return resolve(false);
          });
          break;
      }
    });
  }
}
