import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectVotePage } from './project-vote.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectVotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectVotePageRoutingModule {}
