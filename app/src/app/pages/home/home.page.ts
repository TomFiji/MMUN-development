import { Component } from '@angular/core';
import { SDGArray, SDG } from 'src/app/enums/sdg';

@Component({
  selector: 'hmn-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{
  sdgArray = SDGArray;
  sdgEnum = SDG;

  constructor() { }

}
