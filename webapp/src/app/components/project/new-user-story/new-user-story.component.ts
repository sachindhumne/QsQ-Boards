import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import UserStory from '../../../store/models/userStory';
import {select, Store} from '@ngrx/store';
import * as BoardActions from '../../../store/actions/board.action';
import BoardState from '../../../store/states/board.state';
import {map} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import ProjectDetailsState from '../../../store/states/project-details.state';

@Component({
  selector: 'app-new-user-story',
  templateUrl: './new-user-story.component.html',
  styleUrls: ['./new-user-story.component.scss']
})
export class NewUserStoryComponent implements OnInit {
  createStoryForm: FormGroup;
  userProject: any;
  priorities = [
    {value: 'Low', viewValue: 'Low'},
    {value: 'Medium', viewValue: 'Medium'},
    {value: 'High', viewValue: 'High'}];
  selectedProject: any;
  projectDetails$: Observable<ProjectDetailsState>;
  ProjectDetailsSubscription: Subscription;
  projectsDetailsError: Error = null;
  constructor(
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<NewUserStoryComponent>,
    private store: Store<{ projects: BoardState }>,
    private storeProjectDetails: Store<{ projectDetails: ProjectDetailsState }>,
  ) {
    this.projectDetails$ = this.storeProjectDetails.pipe(select('projectDetails'));
  }

  ngOnInit() {
    this.ProjectDetailsSubscription = this.projectDetails$
      .pipe(
        map(res => {
          if (res) {
            this.selectedProject = res.selectedProjectDetails;
            this.projectsDetailsError = res.projectsDetailsError;
          }
        })).subscribe();
    this.mainForm();
  }

  mainForm() {
    this.createStoryForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [{value : 'New', disabled: true}, [Validators.required]],
      storyPoints: ['', [Validators.required, Validators.pattern]],
      priority: ['', [Validators.required]],
    });
  }

  /*
  * Create service is called and new UserStory is created
  * */
  onSubmit() {
    if (!this.createStoryForm.valid) {
      return false;
    } else {
      if(!this.selectedProject) {
        this.selectedProject = JSON.parse(sessionStorage.getItem('SelectedProject'));
      }
      const newUserStory: UserStory = this.createStoryForm.value;
      newUserStory.status = 'New';
      newUserStory.projectId = this.selectedProject._id;
      this.store.dispatch(BoardActions.BeginCreateUserStory({payload: newUserStory}));
      this.dialogRef.close();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
