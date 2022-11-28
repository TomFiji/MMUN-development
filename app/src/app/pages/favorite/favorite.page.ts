/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { Router } from '@angular/router';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { SubSink } from 'subsink';
import { UserModel } from 'src/app/interfaces/user.model';
import { OnDestroy } from '@angular/core';
import { UserActivitiesModel } from 'src/app/interfaces/user.activities';
@Component({
  selector: 'hmn-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnDestroy {
  tabs = {
    FAVORITE: 'favorite',
    FOR: 'for',
    AGAINST: 'against',
    ABSTAIN: 'abstain',
  };
  tab: string = this.tabs.FAVORITE;
  currentList: ProjectCardModel[];
  userActivities: UserActivitiesModel;
  private subscriptions = new SubSink();
  constructor(public userDAOService: UserDAOService) {
    this.subscriptions.add(
      this.userDAOService.getUserActivity().subscribe((userActivities) => {
        this.userActivities = userActivities;
        this.onTabChanged(this.tab);
      })
    );
  }

  ionViewWillEnter() {
    this.userDAOService.loadUserActivity();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onTabChanged(tab: string) {
    this.tab = tab;
    switch (tab) {
      case this.tabs.FOR:
        this.currentList = this.userActivities.votes?.for || [];
        break;
      case this.tabs.AGAINST:
        this.currentList = this.userActivities.votes?.against || [];
        break;
      case this.tabs.ABSTAIN:
        this.currentList = this.userActivities.votes?.abstain || [];
        break;
      default:
        this.currentList = this.userActivities.favoriteProjects || [];
        break;
    }
  }
}
