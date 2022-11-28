import { SearchQuery } from './../../interfaces/search-query';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'hmn-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
  subscriptions = new SubSink();
  searchResult: ProjectCardModel[];
  infiniteList: any;

  constructor(
    public projectDAOService: ProjectDAOService,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.projectDAOService.getSearchResult().subscribe((searchResult) => {
        if (searchResult) {
          this.searchResult = searchResult;
        }
      })
    );
  }

  onSearch(query: SearchQuery) {
    if (this.infiniteList) {
      this.infiniteList.disabled = false;
    }
    this.projectDAOService.searchFor(query).then().catch();
  }

  onSearchMore({ event }) {
    this.infiniteList = event.target;
    this.projectDAOService
      .searchMore()
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
