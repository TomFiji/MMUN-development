import { ComponentsModule } from 'src/app/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmEmailPageRoutingModule } from './confirm-email-routing.module';

import { ConfirmEmailPage } from './confirm-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmEmailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ConfirmEmailPage]
})
export class ConfirmEmailPageModule {}
