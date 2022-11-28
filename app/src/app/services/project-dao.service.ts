import { SearchQuery } from './../interfaces/search-query';
import { Router } from '@angular/router';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { Vote } from './../enums/vote';
import { ProjectCardModel } from './../interfaces/project-card.model';
import { ProjectModel, NewProjectModel } from './../interfaces/project.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SDG } from '../enums/sdg';
import { HttpApiService } from './http-api.service';
import { ERROR_CODES } from '../enums/error-codes';
import { ToastService, ToastStyle, ToastDuration } from './toast.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectDAOService {
  readonly REFRESH_PERIOD = 180000;
  readonly routes = {
    CREATE_PROJECT: 'project',
    GET_PROJECT: (projectId) => `project/${projectId}`,
    UPDATE_PROJECT: (projectId) => `project/${projectId}`,
    DELETE_PROJECT: (projectId) => `project/${projectId}`,
    PROJECTS: (page) => `project?page=${page}`,
    TOP_SDG: (showAll = 0) => `project/sdg/top?showAll=${showAll}`,
    LOAD_SDG: (sdg, page, showAll = 0) =>
      `project/sdg/${sdg}?page=${page}&showAll=${showAll}`,
    LOAD_TRENDING: (page, showAll = 0) =>
      `project/trending?page=${page}&showAll=${showAll}`,
    LOAD_LOCAL: (page, showAll = 0) =>
      `project/local?page=${page}&showAll=${showAll}`,
    SEARCH: (page) => `project/search?page=${page}`,
    VOTE: 'project/vote',
    REPORT: 'report',
    REPORTS: (page) => `report?page=${page}`,
    DELETE_REPORT: (reportId) => `report/${reportId}`,
    GET_PROJECTS: 'project',
    IMAGE_UPLOAD: 'project/image',
    IMAGE_REMOVE: 'project/image/',
  };

  private searchResult!: ProjectCardModel[];
  private searchResult$ = new BehaviorSubject<ProjectCardModel[]>(
    this.searchResult
  );
  private searchPage = 0;
  public searchQuery: SearchQuery = {};

  private projects: { [key in SDG]: ProjectCardModel[] } = {
    [SDG.POVERTY]: [],
    [SDG.HUNGER]: [],
    [SDG.HEALTH]: [],
    [SDG.EDUCATION]: [],
    [SDG.GENDER]: [],
    [SDG.WATER]: [],
    [SDG.ENERGY]: [],
    [SDG.ECONOMIC]: [],
    [SDG.INDUSTRY]: [],
    [SDG.INEQUALITIES]: [],
    [SDG.COMMUNITIES]: [],
    [SDG.CONSUMPTION]: [],
    [SDG.CLIMATE]: [],
    [SDG.SEA_LIFE]: [],
    [SDG.LAND_LIFE]: [],
    [SDG.PEACE]: [],
    [SDG.PARTNERSHIPS]: [],
    [SDG._TRENDING]: [],
    [SDG._LOCAL]: [],
  };
  private projects$ = new BehaviorSubject<{ [key in SDG]: ProjectCardModel[] }>(
    this.projects
  );
  private lastSDGRefresh!: number;

  private projectPage: Map<SDG, number> = new Map<SDG, number>([
    [SDG.POVERTY, 0],
    [SDG.HUNGER, 0],
    [SDG.HEALTH, 0],
    [SDG.EDUCATION, 0],
    [SDG.GENDER, 0],
    [SDG.WATER, 0],
    [SDG.ENERGY, 0],
    [SDG.ECONOMIC, 0],
    [SDG.INDUSTRY, 0],
    [SDG.INEQUALITIES, 0],
    [SDG.COMMUNITIES, 0],
    [SDG.CONSUMPTION, 0],
    [SDG.CLIMATE, 0],
    [SDG.SEA_LIFE, 0],
    [SDG.LAND_LIFE, 0],
    [SDG.PEACE, 0],
    [SDG.PARTNERSHIPS, 0],
    [SDG._TRENDING, 0],
    [SDG._LOCAL, 0],
  ]);

  constructor(
    private httpApiService: HttpApiService,
    private toastService: ToastService,
    private userDAOService: UserDAOService,
    private router: Router
  ) {}

  getProjects(): Observable<{ [key in SDG]: ProjectCardModel[] }> {
    return this.projects$.asObservable();
  }

  getSearchResult(): Observable<ProjectCardModel[]> {
    return this.searchResult$.asObservable();
  }

  loadTopSDGs() {
    // to be optimized
    return new Promise(async (resolve, reject) =>
      this.httpApiService
        .get(environment.serverGateway + this.routes.TOP_SDG())
        .subscribe((result: any) => {
          if (result?.error) {
            return reject(this.errorHandler(result));
          }
          this.lastSDGRefresh = Date.now();
          // adding all available SDGs
          for (const key in result.sdg) {
            const sdg = Number(key) as SDG;
            if (result.sdg.hasOwnProperty(key) && result.sdg[key].length > 0) {
              this.projects[sdg] = result.sdg[key];
              // resetting pages to 1 in case of refresh
              this.projectPage.set(sdg, 1);
            }
          }
          this.projects$.next(this.projects);
          resolve(true);
        }, this.errorHandler.bind(this))
    );
  }

  loadProjects(page: number = 1) {
    return this.httpApiService
      .get(environment.serverGateway + this.routes.PROJECTS(page))
      .pipe(
        map((result: any) => {
          if (result?.error) {
            this.errorHandler(result);
            return null;
          }
          return result.projects;
        }, this.errorHandler.bind(this))
      );
  }

  loadSDGs(sdg: SDG, page: number = 1): Promise<[]> {
    const url: string =
      sdg < 18
        ? this.routes.LOAD_SDG(sdg, page)
        : sdg === 18
        ? this.routes.LOAD_TRENDING(page)
        : this.routes.LOAD_LOCAL(page);
    return new Promise(async (resolve, reject) =>
      this.httpApiService
        .get(environment.serverGateway + url)
        .subscribe((result: any) => {
          if (result?.error) {
            return reject(this.errorHandler(result));
          }
          this.projects[sdg].push(...result.projects);
          this.projects$.next(this.projects);
          resolve(result.projects);
        }, this.errorHandler.bind(this))
    );
  }

  loadMoreFor(category: SDG): Promise<boolean> {
    const page = this.projectPage.get(category) + 1;
    this.projectPage.set(category, page);
    return new Promise(async (resolve, reject) => {
      try {
        const projects = await this.loadSDGs(category, page);
        return resolve(projects.length === 0);
      } catch (error) {
        reject(error);
      }
    });
  }

  refreshLoadSDGData(): Promise<any> {
    if (
      this.lastSDGRefresh &&
      Date.now() - this.lastSDGRefresh > this.REFRESH_PERIOD
    ) {
      // reset and reload
      this.projectPage.set(SDG._LOCAL, 1);
      this.projectPage.set(SDG._TRENDING, 1);
      this.projects[SDG._LOCAL] = [];
      this.projects[SDG._TRENDING] = [];
      // fetching data
      return Promise.all([
        this.loadTopSDGs(),
        this.loadSDGs(SDG._LOCAL, 1),
        this.loadSDGs(SDG._TRENDING, 1),
      ]);
    }
    // Using cached data
    return Promise.resolve(true);
  }

  searchFor(query: SearchQuery, page = 1): Promise<[]> {
    this.searchPage = page;
    this.searchQuery = query;
    return new Promise(async (resolve, reject) =>
      this.httpApiService
        .post(
          environment.serverGateway + this.routes.SEARCH(this.searchPage),
          query
        )
        .subscribe((result: any) => {
          if (result?.error) {
            return reject(this.errorHandler(result));
          }
          if (result.projects) {
            if (page > 1) {
              this.searchResult.push(...result.projects);
            } else {
              this.searchResult = result.projects;
            }
            this.searchResult$.next(this.searchResult);
            resolve(result.projects);
          } else {
            resolve([]);
          }
        }, this.errorHandler.bind(this))
    );
  }

  searchMore(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const projects = await this.searchFor(
          this.searchQuery,
          ++this.searchPage
        );
        return resolve(projects.length === 0);
      } catch (error) {
        reject(error);
      }
    });
  }

  loadReports(page: number = 1) {
    return this.httpApiService
      .get(environment.serverGateway + this.routes.REPORTS(page))
      .pipe(
        map((result: any) => {
          if (result?.error) {
            this.errorHandler(result);
            return null;
          }
          return result.reports;
        }, this.errorHandler.bind(this))
      );
  }

  getProjectById(projectId: string): Observable<ProjectModel> {
    return this.httpApiService
      .get(environment.serverGateway + this.routes.GET_PROJECT(projectId))
      .pipe(
        tap((result) => {
          if (result?.error) {
            this.errorHandler(result);
            return of(null);
          }
          return of(result);
        }, this.errorHandler.bind(this))
      );
  }

  createProject(project: NewProjectModel) {
    this.httpApiService
      .post(environment.serverGateway + this.routes.CREATE_PROJECT, project)
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        // clearing cache timer
        this.lastSDGRefresh = 1;
        this.toastService.showToast({
          message: 'pages.project.created',
          style: ToastStyle.SUCCESS,
        });
        this.router.navigateByUrl('/profile');
      }, this.errorHandler.bind(this));
  }

  updateProject(project: ProjectModel) {
    this.httpApiService
      .put(
        environment.serverGateway + this.routes.UPDATE_PROJECT(project._id),
        project
      )
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        // clearing cache timer
        this.lastSDGRefresh = 1;
        this.toastService.showToast({
          message: 'pages.project.updated',
          style: ToastStyle.SUCCESS,
        });
        this.router.navigateByUrl('/profile');
      }, this.errorHandler.bind(this));
  }

  uploadImage(formData: FormData): Promise<string> {
    return new Promise((resolve, reject) =>
      this.httpApiService
        .post(environment.serverGateway + this.routes.IMAGE_UPLOAD, formData)
        .subscribe((result) => {
          if (result?.error) {
            return reject(this.errorHandler(result));
          }
          if (result.imageUrl) {
            this.toastService.showToast({
              message: 'pages.images.uploaded',
              style: ToastStyle.SUCCESS,
            });
            return resolve(result.imageUrl);
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

  removeImage(url: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this.httpApiService
        .delete(
          environment.serverGateway +
            this.routes.IMAGE_REMOVE +
            encodeURIComponent(url)
        )
        .subscribe((result) => {
          if (result?.error) {
            return reject(this.errorHandler(result));
          }
          this.toastService.showToast({
            message: 'pages.images.removed',
            style: ToastStyle.SUCCESS,
          });
          return resolve();
        }, this.errorHandler.bind(this))
    );
  }

  deleteProject(projectId: string, callback?: Function) {
    this.httpApiService
      .delete(environment.serverGateway + this.routes.DELETE_PROJECT(projectId))
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        // clearing cache timer
        this.lastSDGRefresh = 1;
        this.toastService.showToast({
          message: 'pages.project.deleted',
          style: ToastStyle.SUCCESS,
        });
        callback && callback();
      }, this.errorHandler.bind(this));
  }

  confirmAndDeleteProject(
    projectId: string,
    title: string,
    callback?: Function
  ) {
    this.toastService.showToast({
      message: 'core.delete.project',
      messageLocaleTokens: [{ key: 'title', value: title }],
      style: ToastStyle.WARNING,
      duration: ToastDuration.LONG,
      icon: 'trash-outline',
      buttons: [
        {
          text: 'core.confirm',
          handler: () => this.deleteProject(projectId, callback),
        },
        {
          text: 'core.cancel',
          role: 'cancel',
        },
      ],
    });
  }

  voteForProject(projectId: string, vote: Vote) {
    const voteReq = {
      projectId,
      voteType: vote,
    };
    this.httpApiService
      .post(environment.serverGateway + this.routes.VOTE, voteReq)
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.projectDetail.voted',
          style: ToastStyle.SUCCESS,
        });
      }, this.errorHandler.bind(this));
  }

  reportProject(projectId: string) {
    const report = {
      projectId,
      message: 'reports.message.guidelines',
    };
    this.httpApiService
      .post(environment.serverGateway + this.routes.REPORT, report)
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.projectDetail.reported',
          style: ToastStyle.SUCCESS,
        });
      }, this.errorHandler.bind(this));
  }

  deleteProjectReport(reportId: string) {
    this.httpApiService
      .delete(environment.serverGateway + this.routes.DELETE_REPORT(reportId))
      .subscribe((result) => {
        if (result?.error) {
          return this.errorHandler(result);
        }
        this.toastService.showToast({
          message: 'pages.admin.delete.report',
          style: ToastStyle.SUCCESS,
        });
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
        this.userDAOService.logout(false);
        break;
      case ERROR_CODES.PROJECT_NOT_FOUND:
        this.toastService.showToast({
          message: 'errors.http.' + ERROR_CODES.PROJECT_NOT_FOUND,
          style: ToastStyle.ERROR,
          duration: ToastDuration.MEDIUM,
        });
        this.router.navigateByUrl('/profile');
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
