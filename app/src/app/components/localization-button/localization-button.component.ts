import { LocalizationService } from 'src/app/localization/localization.service';
import { Component } from '@angular/core';

@Component({
  selector: 'hmn-localization-button',
  templateUrl: './localization-button.component.html',
  styleUrls: ['./localization-button.component.scss'],
})
export class LocalizationButtonComponent {
  currentLanguage: string = 'en'

  constructor(public localizationService: LocalizationService) {
    this.currentLanguage = localizationService.getLanguage()
  }

  onChange(event) {
    const newLang =event.detail.value
    this.localizationService.setLanguage(newLang)
  }

}
