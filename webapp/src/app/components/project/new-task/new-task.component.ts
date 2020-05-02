import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup,FormControl, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import ProjectDetailsState from "../../../store/states/project-details.state";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserStoryService} from "../../../services/user-story.service";
import {select, Store} from "@ngrx/store";
import BoardState from "../../../store/states/board.state";
import {map} from "rxjs/operators";
import UserStory from "../../../store/models/userStory";
import * as BoardActions from "../../../store/actions/board.action";
import {Task} from "../../../store/models/task";
import User from 'app/store/models/user';
import * as UserActions from '../../../store/actions/user.action';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  createTaskForm: FormGroup;
  formData: any;
  updateForm: boolean;
  heading: string;
  teamMates: any[];
  editUserStory: UserStory;
  storyId: string;
  priorities = [
    {value: 'Low', viewValue: 'Low'},
    {value: 'Medium', viewValue: 'Medium'},
    {value: 'High', viewValue: 'High'}];
  status = [
    {value: 'New', viewValue: 'New'},
    {value: 'In Progress', viewValue: 'In Progress'},
    {value: 'Done', viewValue: 'Done'}];
  selectedProject: any;
  projectDetails$: Observable<ProjectDetailsState>;
  boardState$: Observable<BoardState>;
  ProjectDetailsSubscription: Subscription;
  BoardSubscription: Subscription;
  projectsDetailsError: Error = null;
  emptyImgUrl: string = '../../../assets/blank-profile-picture.png';
  selectedAssignee = new FormControl('', [Validators.required]);
  constructor(
    public fb: FormBuilder,
    private dialogRef: MatDialogRef<NewTaskComponent>,
    private userStoryService: UserStoryService,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<{ projectDetails: ProjectDetailsState, userStory: BoardState }>,
  ) {
    this.projectDetails$ = store.pipe(select('projectDetails'));
    this.boardState$ = store.pipe(select('userStory'));
    this.formData = data;
  }
 
  ngOnInit() {
    this.heading = 'Create A Task';
    this.createTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [{value : 'New', disabled: true}, [Validators.required]],
      assignee: this.selectedAssignee,
      priority: ['', [Validators.required]],
    });
    this.storyId = sessionStorage.getItem('storyId');
    this.selectedProject = JSON.parse(sessionStorage.getItem('SelectedProject'));
    this.teamMates = this.selectedProject.members;
    this.BoardSubscription = this.boardState$
      .pipe(
        map(res => {
          if (res) {
            this.editUserStory = res.userStory;
            this.projectsDetailsError = res.userStoriesError;
          }
        })
      ).subscribe();
    this.ProjectDetailsSubscription = this.projectDetails$
      .pipe(
        map(res => {
          if (res) {
            this.selectedProject = res.selectedProjectDetails;
            this.projectsDetailsError = res.projectsDetailsError;
          }
        })
      ).subscribe();
    if ( this.formData !== null) {
      this.updateTaskForm();
    }
  }

  compareFn(x: User, y: User): boolean {
    return x && y ? x.userName === y.userName : x === y;
  }

  /*
  * Update task service will be called
  * */
  updateTaskForm() {
    this.heading = 'Update The Task';
    this.updateForm = true;
    if (this.formData.assignee) {
    this.selectedAssignee = new FormControl(this.formData.assignee, [Validators.required]);
    }
    this.createTaskForm = this.fb.group({
      title: [this.formData.title, [Validators.required]],
      description: [this.formData.description, [Validators.required]],
      status: [this.formData.status, [Validators.required]],
      assignee: this.selectedAssignee,
      priority: [this.formData.priority, [Validators.required]],
    });

  }

  /*
  * Create service is called and new Task is created
  * */
  onSubmit() {
    if (!this.createTaskForm.valid) {
      return false;
    } else if (!this.updateForm) {
      const newTask: any = this.createTaskForm.value;
      newTask.status = 'New';
      newTask.storyId = this.storyId;
      this.userStoryService.createTask(newTask).subscribe(
        _response => {
          this.store.dispatch(BoardActions.BeginGetUserStory({storyId: this.storyId}));
          this.store.dispatch(UserActions.BeginGetUserTasks());
        }
      );
      this.dialogRef.close();
    } else if (this.updateForm) {
      const updatedTask: Task = this.createTaskForm.value;
      this.userStoryService.updateTask(updatedTask, this.formData.id).subscribe(
        _response => {
          this.store.dispatch(BoardActions.BeginGetUserStory({storyId: this.storyId}));
          this.store.dispatch(UserActions.BeginGetUserTasks());
        }
      );
      this.dialogRef.close();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
