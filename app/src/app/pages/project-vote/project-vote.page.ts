import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Vote } from 'src/app/enums/vote';
import { ProjectModel } from 'src/app/interfaces/project.model';
import { UserActivitiesModel } from 'src/app/interfaces/user.activities';
import { ProjectDAOService } from 'src/app/services/project-dao.service';
import { SubSink } from 'subsink';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hmn-project-vote',
  templateUrl: './project-vote.page.html',
  styleUrls: ['./project-vote.page.scss'],
})
export class ProjectVotePage implements OnInit, OnDestroy{
  //For UI purposes
  @ViewChild('ionSlides') slider: IonSlides;
  sliderOpts = {
    autoplay: true,
    speed: 1000,
    zoom: {
      maxRatio: 5,
    },
  };

  showVoteOptions = false;
  readMore = false;
  slideOpts = {
    speed: 10000,
  };

  //Models
  vote = Vote;
  closeDate: string;
  currentProject: ProjectModel;
  currentUser: UserActivitiesModel;
  private subscriptions = new SubSink();

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectDAOService: ProjectDAOService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params.projectId) {
          this.projectDAOService
            .getProjectById(params.projectId)
            .subscribe((project) => {
              if (project) {
                if (new Date(project.closeDate).getTime() < Date.now()) {
                  return this.router.navigateByUrl('/project/'+project._id)
                }
                this.currentProject = project;
                this.closeDate = new Date(
                  this.currentProject.closeDate
                ).toLocaleDateString();
              }
            });
        }
      })
    );
  }

  onShowVoteOptions(event: Event) {
    event.stopPropagation();
    this.showVoteOptions = !this.showVoteOptions;
  }

  onVote(event: Event, vote: Vote) {
    event.stopPropagation();
    this.projectDAOService.voteForProject(this.currentProject._id, vote);
    this.showVoteOptions = false;
  }

  onOverlay() {
    this.showVoteOptions = false;
  }

  onBack(){
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
