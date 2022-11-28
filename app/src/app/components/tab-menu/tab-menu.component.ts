import { Component, OnInit, ViewChild, } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hmn-tabmenu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent implements OnInit {

  @ViewChild('tabs', {static: false}) tabs: IonTabs;
  selectedTab = '';
  constructor() {}

  ngOnInit() {}

  setCurrentTab(e){
    this.selectedTab = e.tab;
  }
}
