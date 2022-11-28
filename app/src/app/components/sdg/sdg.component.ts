import { SDGColors } from './../../enums/sdg';
import { SDG, SDGLogos } from 'src/app/enums/sdg';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'hmn-sdg',
  templateUrl: './sdg.component.html',
  styleUrls: ['./sdg.component.scss'],
})
export class SdgComponent {
  sdgColors = SDGColors
  sdgLogos = SDGLogos
  @Input() sdgNumber: SDG;
  @Input() small: boolean = false;

  constructor() { }

}
