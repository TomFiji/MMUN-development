import { SdgComponent } from './sdg/sdg.component';
import { LocalizationButtonComponent } from './localization-button/localization-button.component';
import { AutoCompleteFieldComponent } from './auto-complete-field/auto-complete-field.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { DetailedCardComponent } from './detailed-card/detailed-card.component';
import { InfiniteListComponent } from './infinite-list/infinite-list.component';
import { NumberFormatPipe } from './../pipes/number-format.pipe';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LocalizePipe } from './../pipes/localize.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LargeCardComponent } from './large-card/large-card.component';
import { SmallCardComponent } from './small-card/small-card.component';
import { EmptyListComponent } from './empty-list/empty-list.component';


@NgModule({
  declarations: [
    LargeCardComponent,
    SmallCardComponent,
    LocalizePipe,
    NumberFormatPipe,
    InfiniteListComponent,
    EmptyListComponent,
    DetailedCardComponent,
    SearchBarComponent,
    AutoCompleteFieldComponent,
    LocalizationButtonComponent,
    SdgComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports: [
    LargeCardComponent,
    SmallCardComponent,
    LocalizePipe,
    NumberFormatPipe,
    InfiniteListComponent,
    EmptyListComponent,
    DetailedCardComponent,
    SearchBarComponent,
    AutoCompleteFieldComponent,
    LocalizationButtonComponent,
    SdgComponent,
  ]
})
export class ComponentsModule { }
