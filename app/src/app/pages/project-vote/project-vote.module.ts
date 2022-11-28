import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectVotePageRoutingModule } from './project-vote-routing.module';

import { ProjectVotePage } from './project-vote.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectVotePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProjectVotePage]
})
export class ProjectVotePageModule {}
