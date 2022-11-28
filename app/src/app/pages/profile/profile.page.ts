import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectCardModel } from 'src/app/interfaces/project-card.model';
import { UserModel } from 'src/app/interfaces/user.model';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { SubSink } from 'subsink';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hmn-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnDestroy {
  userData: UserModel;
  userProjects: ProjectCardModel[];
  private subscriptions = new SubSink();
  public isAdmin = false;
  public isTeacher = false;
  public profilePictureURL: string = 'assets/img/default-profile-light.svg';
  constructor(
    public userDAOService: UserDAOService,
    public projectDAOService: ProjectDAOService,
    private router: Router
  ) {
    this.subscriptions.add(
      this.userDAOService.getUser().subscribe((userData) => {
        this.userData = userData;
        this.isAdmin = this.userDAOService.isAdmin;
        this.isTeacher = this.userDAOService.isTeacher;
        if (this.userData.profilePicture) {
          this.profilePictureURL = this.userData.profilePicture;
        }
      }),
      this.userDAOService.getUserActivity().subscribe((userActivities) => {
        this.userProjects = userActivities.projects;
      })
    );
  }

  ionViewWillEnter() {
    this.userDAOService.loadUserActivity();
  }

  onLogout() {
    this.userDAOService.logout();
  }

  onEditProject(projectId: string) {
    this.router.navigateByUrl('/project/' + projectId + '/edit');
  }

  onDeleteProject(projectId: string, title: string) {
    this.projectDAOService.confirmAndDeleteProject(projectId, title, () =>
      this.userDAOService.loadUserActivity().then().catch()
    );
  }

  async uploadImage(event) {
    const files = event.target.files;
    const formData = new FormData();
    formData.append('image', files[0]);
    try {
      const newImg = await this.userDAOService.uploadProfilePicture(
        this.userData.profilePicture,
        formData
      );
      if (newImg) {
        this.profilePictureURL = newImg;
      }
    } catch (error) {
      // handled by dao
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
