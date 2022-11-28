import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { UserActivitiesModel } from './../interfaces/user.activities';
import { ToastDuration, ToastService, ToastStyle } from './toast.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie';
import { HttpApiService } from './http-api.service';
import { UserModel } from './../interfaces/user.model';
import { environment } from '../../environments/environment';
import { ERROR_CODES } from '../enums/error-codes';
import { AuthorType } from '../enums/author-type';
import { map, tap } from 'rxjs/operators';
import { UserStatus } from '../enums/user-status';
import { ProjectModel } from '../interfaces/project.model';

@Injectable({
  providedIn: 'root',
})
export class UserDAOService {
  readonly routes = {
    LOGIN: 'user/login',
    LOGOUT: 'user/logout',
    SIGNUP: 'user',
    USER: (id) => `user/${id}`,
    USERS: (page) => `user?page=${page}`,
    BAN_USER: 'user/ban',
    UN_BAN_USER: 'user/unban',
    FORGOT_PASSWORD: 'user/forgotPassword',
    RESET_PASSWORD: 'user/resetPassword',
    CHANGE_PASSWORD: 'user/changePassword',
    CONFIRM_EMAIL: 'user/confirmEmail',
    RESEND_TOKEN: 'user/resendToken',
    UPDATE_EMAIL: 'user/updateEmail',
    DELETE_USER: (userId) => `user/${userId}`,
    UPDATE_USER: (userId) => `user/${userId}`,
    ACTIVITY_USER: (userId) => `user/activities/${userId}`,
    SEARCH_GROUPS: (query) => `user/group/${query}`,
    ADD_TO_FAVORITE: 'user/favorite',
    REMOVE_FROM_FAVORITE: (projectId) => `user/favorite/${projectId}`,
    IMAGE_UPLOAD: 'project/image',
    IMAGE_REMOVE: 'project/image/',
  };

  private user!: UserModel;
  private user$ = new BehaviorSubject<UserModel>(this.user);
  public isLoggedIn = false;
  public isPending = false;
  public userEmailForPasswordReset!: string;
  public userEmailForUpdateEmail!: string;

  private userActivity: UserActivitiesModel = {
    projects: [],
    favoriteProjects: [],
    votes: {
      for: [],
      against: [],
      abstain: [],
    },
  };
  private userActivity$ = new BehaviorSubject<UserActivitiesModel>(
    this.userActivity
  );

  constructor(
    private httpApiService: HttpApiService,
    private router: Router,
    private cookieService: CookieService,
    private toastService: ToastService
  ) {
    try {
      const sessionCookie = cookieService.get('session');
      const encryptedUser = decodeURIComponent(sessionCookie);
      const user = JSON.parse(
        CryptoJS.AES.decrypt(encryptedUser, environment.sessionKey).toString(
          CryptoJS.enc.Utf8
        )
      );
      this.setUser(user);
    } catch (error) {
      // Not Authenticated
      this.clearUser();
    }
  }

  get isAdmin(): boolean {
    return this.user.authorType === AuthorType.ADMIN;
  }

  get isTeacher(): boolean {
    return this.user.authorType === AuthorType.TEACHER;
  }

  get teacherGroup(): string{
    return this.user?.group;
  }

  getUserActivity(): Observable<UserActivitiesModel> {
    return this.userActivity$.asObservable();
  }

  setUserActivity(projects: UserActivitiesModel) {
    this.userActivity = projects;
    this.userActivity$.next(this.userActivity);
  }

  loadUserActivity(userId?: string): Promise<any> {
    const targetID = userId ? userId : this.user._id;
    return new Promise((resolve, reject) => {
      this.httpApiService
        .get(environment.serverGateway + this.routes.ACTIVITY_USER(targetID))
        .subscribe((result) => {
          if (result?.error) {
            return reject(this.errorHandler(result));
          }
          const userActivities = {
            favoriteProjects: result.favoriteProjects,
            votes: result.votes,
            projects: result.projects,
          };
          if (!userId) {
            this.setUserActivity(userActivities);
          }
          return resolve(userActivities);
        }, this.errorHandler.bind(this));
    });
  }

  login(email: string, password: string) {
    this.isLoggedIn = true;
    this.httpApiService
      .post(environment.serverGateway + this.routes.LOGIN, { email, password })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        if (result.user) {
          const user = result.user;
          this.setUser(user as UserModel);

          this.toastService.showToast({
            message: 'pages.login.success',
            style: ToastStyle.SUCCESS,
          });
          if (this.isAdmin) {
            this.router.navigateByUrl('/admin');
          } else if (this.isTeacher){
            this.router.navigateByUrl('/teacher');
          }
          else {
            this.router.navigateByUrl('/home');
          }
        }
      }, this.errorHandler.bind(this));
  }

  logout(showToast: boolean = true) {
    showToast &&
      this.toastService.showToast({
        message: 'pages.login.toast.logout',
      });
    this.clearUser(true);
    this.httpApiService
      .post(environment.serverGateway + this.routes.LOGOUT, {})
      .subscribe(() => null, this.errorHandler.bind(this));
  }

  createAccount(user: object) {
    this.httpApiService
      .post(environment.serverGateway + this.routes.SIGNUP, user)
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.signup.success',
          style: ToastStyle.SUCCESS,
          duration: ToastDuration.LONG,
        });
        const user = result.user;
        this.setUser(user as UserModel);
      }, this.errorHandler.bind(this));
  }

  getUser(): Observable<UserModel> {
    return this.user$.asObservable();
  }

  getUsers(page: number = 1) {
    if (this.isAdmin || this.isTeacher) {
      return this.httpApiService
        .get(environment.serverGateway + this.routes.USERS(page))
        .pipe(
          map((result: any) => {
            if (result?.error) {
              this.errorHandler(result);
              return null;
            }
            return result.users;
          }, this.errorHandler.bind(this))
        );
    }
    return of([]);
  }

  getUsersByGroup(page: number = 1) {
    if (this.isTeacher) {
      return this.httpApiService
        .get(environment.serverGateway + this.routes.USERS(page))
        .pipe(
          map((result: any) => {
            if (result?.error) {
              this.errorHandler(result);
              return null;
            }
            return result.users;
          }, this.errorHandler.bind(this))
        );
    }
    return of([]);
  }

  getUserById(userId: string) {
    if (this.isAdmin || this.isTeacher) {
      return this.httpApiService
        .get(environment.serverGateway + this.routes.USER(userId))
        .pipe(
          tap((result: any) => {
            if (result?.error) {
              this.errorHandler(result);
              return of(null);
            }
            return of(result);
          }, this.errorHandler.bind(this))
        );
    }
    return of(null);
  }

  updateUserProfile(modifiedUser: UserModel, userId?: string) {
    const targetID = userId ? userId : this.user._id;
    this.httpApiService
      .put(
        environment.serverGateway + this.routes.UPDATE_USER(targetID),
        modifiedUser
      )
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.profile.update.profile',
          style: ToastStyle.SUCCESS,
          duration: ToastDuration.LONG,
        });
        if (this.user.authorType === AuthorType.ADMIN && userId) {
          this.router.navigateByUrl('/admin');
        } else {
          this.setUser(result.user, false);
          this.router.navigateByUrl('/profile');
        }
      }, this.errorHandler.bind(this));
  }

  addProjectToUserFavorites(project: ProjectModel) {
    this.httpApiService
      .post(environment.serverGateway + this.routes.ADD_TO_FAVORITE, {
        projectId: project._id,
      })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.favorite.added',
          style: ToastStyle.SUCCESS,
          duration: ToastDuration.LONG,
        });
        this.userActivity.favoriteProjects.push(project as ProjectCardModel);
        this.userActivity$.next(this.userActivity);
      }, this.errorHandler.bind(this));
  }

  removeProjectToUserFavorites(projectId: string) {
    this.httpApiService
      .delete(
        environment.serverGateway + this.routes.REMOVE_FROM_FAVORITE(projectId)
      )
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.favorite.removed',
          style: ToastStyle.SUCCESS,
          duration: ToastDuration.LONG,
        });
        this.userActivity.favoriteProjects =
          this.userActivity.favoriteProjects.filter(
            (project) => project._id !== projectId
          );
        this.userActivity$.next(this.userActivity);
      }, this.errorHandler.bind(this));
  }

  isProjectFavorited(projectId: string) {
    return !!this.userActivity?.favoriteProjects.find(
      (project) => project._id === projectId
    );
  }

  searchGroups(groupQuery): Observable<{ name: string }[]> {
    return this.httpApiService
      .get(environment.serverGateway + this.routes.SEARCH_GROUPS(groupQuery))
      .pipe(
        map((result: any) => {
          if (result?.error) {
            this.errorHandler(result);
            return [];
          }
          return result?.groups || [];
        }, this.errorHandler.bind(this))
      );
  }

  banUser(userId): Observable<any> {
    if (this.isAdmin) {
      return this.httpApiService
        .post(environment.serverGateway + this.routes.BAN_USER, { userId })
        .pipe(
          tap((result: any) => {
            if (result?.error) {
              this.errorHandler(result);
              return of(null);
            }
            this.toastService.showToast({
              message: 'pages.admin.user.banned',
              style: ToastStyle.SUCCESS,
            });
            return of(result);
          }, this.errorHandler.bind(this))
        );
    }
    return of(null);
  }

  unBanUser(userId: string): Observable<any> {
    if (this.isAdmin) {
      return this.httpApiService
        .post(environment.serverGateway + this.routes.UN_BAN_USER, { userId })
        .pipe(
          tap((result: any) => {
            if (result?.error) {
              this.errorHandler(result);
              return of(null);
            }
            this.toastService.showToast({
              message: 'pages.admin.user.unbanned',
              style: ToastStyle.SUCCESS,
            });
            return of(result);
          }, this.errorHandler.bind(this))
        );
    }
    return of(null);
  }

  requestEmailUpdate(newEmail: string) {
    this.httpApiService
      .post(environment.serverGateway + this.routes.UPDATE_EMAIL, { newEmail })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.userEmailForUpdateEmail = newEmail;
        this.toastService.showToast({
          message: 'pages.updateEmail.success',
          style: ToastStyle.SUCCESS,
        });
        this.router.navigateByUrl('/confirmEmail');
      }, this.errorHandler.bind(this));
  }

  confirmEmailUpdate(emailToken: string) {
    if (!this.isPending && !this.userEmailForUpdateEmail) {
      return this.router.navigateByUrl('/updateEmail');
    }
    const email = this.isPending
      ? this.user.email
      : this.userEmailForUpdateEmail;
    this.httpApiService
      .post(environment.serverGateway + this.routes.CONFIRM_EMAIL, {
        email,
        emailToken,
      })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.userEmailForUpdateEmail = '';
        this.toastService.showToast({
          message: 'pages.confirmEmail.confirmed',
          style: ToastStyle.SUCCESS,
        });
        const path = this.isPending ? '/home' : '/profile';
        if (result?.user) {
          this.setUser(result.user);
        }
        this.router.navigateByUrl(path);
      }, this.errorHandler.bind(this));
  }

  resendEmailConfirmToken() {
    if (!this.isPending && !this.userEmailForUpdateEmail) {
      return;
    }
    const email = this.isPending
      ? this.user.email
      : this.userEmailForUpdateEmail;
    this.httpApiService
      .post(environment.serverGateway + this.routes.RESEND_TOKEN, { email })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.confirmEmail.resend',
          style: ToastStyle.SUCCESS,
        });
      }, this.errorHandler.bind(this));
  }

  requestPasswordForget(email: string) {
    this.httpApiService
      .post(environment.serverGateway + this.routes.FORGOT_PASSWORD, { email })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.userEmailForPasswordReset = email;
        this.toastService.showToast({
          message: 'pages.forgotPassword.success',
          style: ToastStyle.SUCCESS,
        });
        this.router.navigateByUrl('/resetPassword');
      }, this.errorHandler.bind(this));
  }

  resetUserPassword(emailToken: string, password: string) {
    if (!this.userEmailForPasswordReset) {
      return this.router.navigateByUrl('/forgotPassword');
    }
    this.httpApiService
      .post(environment.serverGateway + this.routes.RESET_PASSWORD, {
        email: this.userEmailForPasswordReset,
        emailToken,
        password,
      })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.userEmailForPasswordReset = undefined;
        this.toastService.showToast({
          message: 'pages.resetPassword.success',
          style: ToastStyle.SUCCESS,
        });
        this.router.navigateByUrl('/login');
      }, this.errorHandler.bind(this));
  }

  changeUserPassword(password: string, newPassword: string) {
    this.httpApiService
      .post(environment.serverGateway + this.routes.CHANGE_PASSWORD, {
        password,
        newPassword,
      })
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.resetPassword.success',
          style: ToastStyle.SUCCESS,
        });
        this.router.navigateByUrl('/profile');
      }, this.errorHandler.bind(this));
  }

  uploadProfilePicture(
    currentImg: string,
    formData: FormData
  ): Promise<string> {
    if (currentImg) {
      this.httpApiService
        .delete(
          environment.serverGateway +
            this.routes.IMAGE_REMOVE +
            encodeURIComponent(currentImg)
        )
        .subscribe((result: any) => {
          if (result?.error) {
            return this.errorHandler(result);
          }
        });
    }
    return new Promise((resolve, reject) =>
      this.httpApiService
        .post(environment.serverGateway + this.routes.IMAGE_UPLOAD, formData)
        .subscribe((imgResult) => {
          if (imgResult.error) {
            return reject(this.errorHandler(imgResult));
          }
          if (imgResult.imageUrl) {
            return this.httpApiService
              .put(
                environment.serverGateway +
                  this.routes.UPDATE_USER(this.user._id),
                {
                  ...this.user,
                  profilePicture: imgResult.imageUrl,
                }
              )
              .subscribe((result) => {
                if (result?.error) {
                  return this.errorHandler(result);
                }
                this.toastService.showToast({
                  message: 'pages.images.uploaded',
                  style: ToastStyle.SUCCESS,
                });
                this.setUser(result.user, false);
                return resolve(imgResult.imageUrl);
              }, this.errorHandler.bind(this));
          } else {
            this.toastService.showToast({
              message: `errors.http.${ERROR_CODES.IMAGE_UPLOAD}`,
              style: ToastStyle.SUCCESS,
              duration: ToastDuration.MEDIUM,
            });
            return reject();
          }
        }, this.errorHandler.bind(this))
    );
  }

  clearUser(navigateToLogin: boolean = false) {
    this.user = null;
    this.user$.next(null);
    this.isLoggedIn = false;
    this.isPending = false;
    this.cookieService.remove('session');
    if (navigateToLogin) {
      this.router.navigateByUrl('/login');
      // hacky solution
      // regarding the issue:
      // https://github.com/NativeScript/nativescript-angular/issues/2243
      setTimeout(() => {
        location.reload();
      });
    }
  }

  async setUser(user: UserModel, loadUserActivities = true) {
    this.user = user;
    this.user$.next(this.user);
    this.isLoggedIn = true;
    this.isPending = user.status === UserStatus.PENDING;
    const encryptedUser = encodeURIComponent(
      String(CryptoJS.AES.encrypt(JSON.stringify(user), environment.sessionKey))
    );
    this.cookieService.put('session', encryptedUser);
    if (user.status === UserStatus.PENDING) {
      this.router.navigateByUrl('/confirmEmail');
    }
    loadUserActivities && (await this.loadUserActivity());
  }

  deleteUserByID(userId) {
    if (this.isAdmin || this.isTeacher) {
      this.httpApiService
        .delete(environment.serverGateway + this.routes.DELETE_USER(userId))
        .subscribe((result) => {
          if (result?.error) {
            return this.errorHandler(result);
          }
          this.toastService.showToast({
            message: 'pages.admin.user.deleted',
            style: ToastStyle.SUCCESS,
            duration: ToastDuration.LONG,
          });
        }, this.errorHandler.bind(this));
    }
  }

  deleteAccount() {
    this.httpApiService
      .delete(
        environment.serverGateway + this.routes.DELETE_USER(this.user._id)
      )
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.admin.user.deleted',
          style: ToastStyle.SUCCESS,
          duration: ToastDuration.LONG,
        });
        this.router.navigateByUrl('/login');
      }, this.errorHandler.bind(this));
  }

  private errorHandler(httpError) {
    let error = httpError.error;
    if (httpError?.error?.error) {
      error = httpError.error.error;
    }
    switch (error.code) {
      case ERROR_CODES.NOT_AUTHENTICATED:
        this.toastService.showToast({
          message: 'errors.http.' + ERROR_CODES.NOT_AUTHENTICATED,
          style: ToastStyle.ERROR,
          duration: ToastDuration.MEDIUM,
        });
        this.clearUser(true);
        break;
      default:
        this.toastService.showToast({
          message: 'errors.http.' + (error.code ? error.code : 'unknown'),
          style: ToastStyle.ERROR,
          duration: ToastDuration.MEDIUM,
        });
        break;
    }
  }
}
