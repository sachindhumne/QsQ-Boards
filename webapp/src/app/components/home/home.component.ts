import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { Router } from "@angular/router";
import { AuthenticationService } from "../../auth/authentication.service";
import * as constantRoutes from '../../shared/constants';
import { Actions, ofType } from '@ngrx/effects';

//Actions
import * as UserActions from '../../store/actions/user.action';
import * as ProjectActions from '../../store/actions/project.action';

//State
import ProjectState from '../../store/states/project.state';

//Models
import Project from '../../store/models/project';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchTerm: string;
  currentUserName: string;
  project$: Observable<ProjectState>;
  ProjectSubscription: Subscription;
  projectList: Project[] = [];
  projectsError: Error = null;

  constructor(private projectDialog: MatDialog, private router: Router,
    private authService: AuthenticationService,
    private store: Store<{ projects: ProjectState }>
  ) {
    this.project$ = store.pipe(select('projects'));

  }

  ngOnInit(): void {
    if (sessionStorage.getItem('User')) {
      const user = JSON.parse(sessionStorage.getItem('User'));
      this.currentUserName = user.userName;
      this.authService.userProfileSubject$.next(user);
      this.ProjectSubscription = this.project$
        .pipe(
          map(res => {
            this.projectList = res.projects;
            this.projectsError = res.projectsError;
          })
        )
        .subscribe();
      this.store.dispatch(ProjectActions.BeginGetProjectsAction());
      this.store.dispatch(UserActions.BeginGetActiveUsers());
    } else {
      this.router.navigateByUrl(constantRoutes.emptyRoute);
    }
  }

  /**
   * Returns truncated project title if longer than 15 chars
   * @param projectTitle 
   */
  getProjectTitle(projectTitle) {
    if (projectTitle.length > 15) {
      return projectTitle.substring(0, 15).concat(" ...");
    }
    return projectTitle;
  }

  /**
   * Handles Confirmation dialog to delete project
   * @param id 
   * @param name 
   */
  confirmDelete(id: string, name: string) {
    if (confirm("Are you sure you want to delete this project: " + name)) {
      this.deleteProject(id);
    }
  }

  deleteProject(projectId) {
    this.store.dispatch(ProjectActions.BeginDeleteProject({ payload: projectId }));
  }

  /**
   * Opens new project creation dialog
   */
  openProjectDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.projectDialog.open(ProjectDialogComponent, dialogConfig);
  }

  /**
   * Opens project creation dialog with project details filled in
   * @param project 
   */
  openUpdateDialog(project: Project) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: project._id,
      title: project.title,
      description: project.description,
      members: [...project.members],
      status: project.status
    };

    this.projectDialog.open(ProjectDialogComponent, dialogConfig);
  }

  /**
   * Returns a random color for prject card
   * @param index 
   */
  getRandomColor(index) {
    const totalProjects = this.projectList.length
    const minIndex = index / totalProjects;
    const color = Math.ceil(0x101111 * minIndex).toString(16);
    return '#' + ('d9a16b' + color).slice(-6);
  }

  /**
   * Returns the text required for project avatar
   * @param project 
   */
  getProjectTitleAvatar(project) {
    const projAvatarArr = project.title.split(" ")
    if (projAvatarArr.length > 1) {
      return projAvatarArr[0].charAt(0).concat(projAvatarArr[1].charAt(0)).toUpperCase();
    } else {
      return projAvatarArr[0].charAt(0).toUpperCase();
    }
  }

  ngOnDestroy() {
    if (this.ProjectSubscription) {
      this.ProjectSubscription.unsubscribe();
    }
  }

  navigateToHome():void{
    this.router.navigateByUrl(constantRoutes.homeRoute);
  }

}