import { IsAdminGuard } from './guards/is-admin.guard';
import { ProjectPageMode } from './enums/project-page-mode';
import { IsAuthGuard } from './guards/is-auth.guard';
import { IsNotAuthGuard } from './guards/is-not-auth.guard';
import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/landing/landing.module').then((m) => m.LandingPageModule),
    canActivate: [],
  },
  {
    path: 'home',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'discover',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/discover/discover.module').then(
        (m) => m.DiscoverPageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'profile',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'profileEdit',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/profile-edit/profile-edit.module').then(
        (m) => m.ProfileEditPageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'favorite',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/favorite/favorite.module').then(
        (m) => m.FavoritePageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'project',
    pathMatch: 'full',
    data: { mode: ProjectPageMode.NEW },
    loadChildren: () =>
      import('./pages/project/project.module').then((m) => m.ProjectPageModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'project/:projectId',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/project-detail/project-detail.module').then(
        (m) => m.ProjectDetailPageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'project/:projectId/vote',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/project-vote/project-vote.module').then(
        (m) => m.ProjectVotePageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'project/:projectId/edit',
    pathMatch: 'full',
    data: { mode: ProjectPageMode.EDIT },
    loadChildren: () =>
      import('./pages/project/project.module').then((m) => m.ProjectPageModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/sign-up/sign-up.module').then((m) => m.SignUpPageModule),
    canActivate: [IsNotAuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/sign-in/sign-in.module').then((m) => m.SignInPageModule),
    canActivate: [IsNotAuthGuard],
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/search/search.module').then((m) => m.SearchPageModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./pages/teacher/teacher.module').then((m) => m.TeacherPageModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'confirmEmail',
    loadChildren: () =>
      import('./pages/confirm-email/confirm-email.module').then(
        (m) => m.ConfirmEmailPageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'updateEmail',
    loadChildren: () =>
      import('./pages/update-email/update-email.module').then(
        (m) => m.UpdateEmailPageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'forgotPassword',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
    canActivate: [IsNotAuthGuard],
  },
  {
    path: 'resetPassword',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
    canActivate: [IsNotAuthGuard],
  },
  {
    path: 'changePassword',
    loadChildren: () =>
      import('./pages/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: 'admin/user/:userId/edit',
    pathMatch: 'full',
    loadChildren: () => import('./pages/admin/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'teacher/user/:userId/edit',
    pathMatch: 'full',
    loadChildren: () => import('./pages/teacher/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'admin',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminPageModule),
    canActivate: [IsAdminGuard],
  },
  {
    path: '404',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundPageModule
      ),
  },
  { path: '**', redirectTo: '/404' },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
