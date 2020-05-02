import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Observable, Subscription} from "rxjs";
import ProjectDetailsState from "../../../store/states/project-details.state";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserStoryService} from '../../../services/user-story.service';
import {select, Store} from "@ngrx/store";
import BoardState from "../../../store/states/board.state";
import {map} from "rxjs/operators";
import * as BoardActions from "../../../store/actions/board.action";
import UserStory from '../../../store/models/userStory';
import {Task} from "../../../store/models/task";
import {Location} from '@angular/common';
import {NewTaskComponent} from "../new-task/new-task.component";
import Project from "../../../store/models/project";
import CommentState from 'app/store/states/comment.state';
import { CommentComponent } from '../comment/comment.component';


@Component({
  selector: 'app-user-story-details',
  templateUrl: './user-story-details.component.html',
  styleUrls: ['./user-story-details.component.scss']
})
export class UserStoryDetailsComponent implements OnInit {
  updateStoryForm: FormGroup;
  newStatus: 'Todo';
  storyId: string;
  editStory: UserStory;
  priorities = [
    {value: 'Low', viewValue: 'Low'},
    {value: 'Medium', viewValue: 'Medium'},
    {value: 'High', viewValue: 'High'}];
  status = [
    {value: 'New', viewValue: 'New'},
    {value: 'In Progress', viewValue: 'In Progress'},
    {value: 'Done', viewValue: 'Done'}];
  selectedProject: Project;

  // States and subscriptions
  boardState$: Observable<BoardState>;
  boardSubscription: Subscription;
  allUserStories: UserStory[];
  allErrors: Error = null;
  projectsDetailsError: Error = null;
  displayedTaskColumns: string[] = ['title', 'description', 'status', 'priority', 'assignee', 'actions'];
  emptyImgUrl: string = '../../../assets/blank-profile-picture.png';
  selectedTaskTab = new FormControl(0);
  constructor(
    public fb: FormBuilder,
    private dialog: MatDialog,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private userStoryService: UserStoryService,
    private store: Store<{ board: BoardState, projectDetails: ProjectDetailsState, comments: CommentState}>,
  ) {
    this.boardState$ = store.pipe(select('board'));
  }

  ngOnInit() {
    if (sessionStorage.getItem('User')) {
      this.mainForm();
      this.storyId = this.activatedRoute.snapshot.paramMap.get('id');
      this.store.dispatch(BoardActions.BeginGetUserStory({storyId: this.storyId}));
      this.selectedProject = JSON.parse(sessionStorage.getItem('SelectedProject'));
      this.userStoryService.getAllUserStories(this.selectedProject._id).subscribe((response) => {
        this.allUserStories = response;
        this.editStory = response.filter(story => story._id === this.storyId)[0];
        this.setForm();
      });
      this.boardSubscription = this.boardState$
        .pipe(
          map(response => {
            this.allErrors = response.userStoriesError;
            this.editStory = response.userStory;
            this.setForm();
          })
        ).subscribe();

      sessionStorage.setItem('storyId', this.storyId);
    }
  }

  // for task comments
  commentTask(task: Task) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60vw';
    dialogConfig.height = '80%';
    dialogConfig.data = task;
    this.dialog.open(CommentComponent, dialogConfig);
  }


  getElementDesc(taskDesc) {
    if (taskDesc.length > 35) {
      return taskDesc.substring(0, 35).concat(' ...');
    }
    return taskDesc;
  }

  setForm() {
    this.updateStoryForm.setValue({
      title: this.editStory ? this.editStory.title : '',
      description: this.editStory ? this.editStory.description : '',
      status: this.editStory ? this.editStory.status : 'New',
      storyPoints: this.editStory ? this.editStory.storyPoints : 0,
      priority: this.editStory ? this.editStory.priority : 'Low',
    });
  }

  mainForm() {
    this.updateStoryForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      storyPoints: ['', [Validators.required, Validators.pattern]],
      priority: ['', [Validators.required]],
    });
  }

  /*
  * Creating the new task
  * */
  createTask() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    this.dialog.open(NewTaskComponent, dialogConfig);
    // this.store.dispatch(BoardActions.BeginGetUserStory({storyId: this.storyId}));
  }

  onSubmit() {
    const updatedStory: UserStory = this.updateStoryForm.value;
    this.store.dispatch(BoardActions.BeginUpdateUserStory({storyId : this.storyId, payload: updatedStory}));
    this.location.back();
  }

  /*
  * Calling the update pop-up
  * */
  updateTask(task: Task) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      id: task._id,
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority
    };

    this.dialog.open(NewTaskComponent, dialogConfig);
  }

  /*
  * The service is called for deleting user Stories
  * */
  deleteTask(task: Task) {
    if (window.confirm('Are you sure?')) {
      this.userStoryService.deleteTask(task._id).subscribe(_response => {
          this.store.dispatch(BoardActions.BeginGetUserStory({storyId: this.storyId}));
        });
      }
  }
}
