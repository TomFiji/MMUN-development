import { LocalizationService } from './../../localization/localization.service';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { SearchQuery } from 'src/app/interfaces/search-query';
import { SDGArray, SDG } from 'src/app/enums/sdg';

@Component({
  selector: 'hmn-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  sdgArray = SDGArray;
  sdgEnum = SDG;
  private _query: SearchQuery = {};
  @ViewChild(IonModal) modal: IonModal;
  @Output() onSearch = new EventEmitter<SearchQuery>();
  @Input() expanded: boolean = false;
  @Input() set query(query: SearchQuery) {
    this._query = query;
    const builder = [];
    if (query.text) {
      builder.push(
        this.localizationService.translate('pages.search.text') +
          ': ' +
          query.text
      );
    }
    if (query.country) {
      builder.push(
        this.localizationService.translate('pages.search.country') +
          ': ' +
          query.country
      );
    }
    if (query.sdg) {
      builder.push(
        this.localizationService.translate('pages.search.sdg') +
        ': ' +
        this.localizationService.translate('sdg.' + query.sdg)
      );
    }
    if (builder.length === 0) {
      builder.push(this.localizationService.translate('pages.search.search'));
    }
    this.stringQuery = builder.join(' & ');
  }
  get query(): SearchQuery {
    return this._query;
  }
  stringQuery: string = '';
  isModalOpen = false;
  form = {
    values: {
      text: '',
      country: '',
      sdg: 0,
    },
    touched: {
      text: false,
      country: false,
    },
    errors: {
      text: '',
      country: '',
    },
    isValid: false,
  };

  constructor(private localizationService: LocalizationService) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
  }

  validateForm() {
    let isValid = true;
    Object.keys(this.form.values).forEach((field) => {
      this.form.errors[field] = '';
      if (
        field === 'text' &&
        this.form.values.text &&
        this.form.values.text.trim().length < 3
      ) {
        this.form.errors[field] = 'pages.search.text.error';
        isValid = false;
      } else if (
        field === 'country' &&
        this.form.values.country &&
        this.form.values.country.length < 2
      ) {
        this.form.errors[field] = 'pages.search.country.error';
        isValid = false;
      }
    });
    this.form.isValid = isValid;
    return isValid;
  }

  clearSearch() {
    this.form.values = {
      text: '',
      country: '',
      sdg: 0,
    };
  }

  onSearchHandler() {
    if (this.validateForm()) {
      this.query = {
        text: this.form.values.text,
        country: this.form.values.country,
        sdg: this.form.values.sdg,
      };
      this.closeModal();
      this.onSearch.emit(this.query);
    }
  }
}
