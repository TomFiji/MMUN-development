import { LocalizationService } from 'src/app/localization/localization.service';
import { Router } from '@angular/router';
import { SearchQuery } from './../../interfaces/search-query';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { SubSink } from 'subsink';
import { ProjectDAOService } from './../../services/project-dao.service';
import { Component, OnDestroy } from '@angular/core';
import { SDG } from 'src/app/enums/sdg';
import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'hmn-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnDestroy {
  private subscriptions = new SubSink();
  projects: { [key in SDG]: ProjectCardModel[] };
  userProjects: ProjectCardModel[];
  SDGs: SDG[] = [];

  constructor(
    private projectDAOService: ProjectDAOService,
    private userDAOService: UserDAOService,
    private loadingCtrl: LoadingController,
    private localizationService: LocalizationService,
    private router: Router
  ) {
    this.subscriptions.add(
      this.projectDAOService.getProjects().subscribe((projects) => {
        this.projects = projects;
        this.SDGs = Object.keys(this.projects)
          .map((key) => Number(key))
          .sort((a, b) => b - a);
      }),
      this.userDAOService.getUserActivity().subscribe((userActivities) => {
        this.userProjects = userActivities.projects;
      })
    );
    this.loadTopData();
  }

  ionViewWillEnter() {
    this.loadTopData(true);
  }

  async loadTopData(refresh = false) {
    const loading = await this.loadingCtrl.create({
      message: this.localizationService.translate('pages.discover.loading'),
      duration: 10000, // max load of 10 sec
      mode: 'ios',
    });
    loading.present();
    let promise: Promise<any>;
    if (refresh) {
      promise = this.projectDAOService.refreshLoadSDGData();
    } else {
      promise = Promise.all([
        this.projectDAOService.loadTopSDGs(),
        this.projectDAOService.loadMoreFor(SDG._LOCAL),
        this.projectDAOService.loadMoreFor(SDG._TRENDING),
      ]);
    }
    promise.then(() => loading.dismiss()).catch(() => loading.dismiss());
  }

  loadData(res) {
    const event = res.event;
    const name = res.name as SDG;
    this.projectDAOService
      .loadMoreFor(name)
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

  onSearch(query: SearchQuery) {
    this.projectDAOService
      .searchFor(query)
      .then(() => {
        this.router.navigateByUrl('/search');
      })
      .catch();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
