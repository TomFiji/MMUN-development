import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailPageRoutingModule } from './project-detail-routing.module';

import { ProjectDetailPage } from './project-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProjectDetailPage]
})
export class ProjectDetailPageModule {}
