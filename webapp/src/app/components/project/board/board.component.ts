import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Board} from '../../../store/models/board';
import {Column} from '../../../store/models/column';
import {MatDialog} from '@angular/material/dialog';
import {NewUserStoryComponent} from '../new-user-story/new-user-story.component';
import {Observable, Subscription} from 'rxjs';
import UserStory from '../../../store/models/userStory';
import BoardState from '../../../store/states/board.state';
import * as BoardActions from '../../../store/actions/board.action';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import ProjectDetailsState from "../../../store/states/project-details.state";
import {ActivatedRoute, Router} from "@angular/router";
import * as constantRoutes from "../../../shared/constants";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  todoUserStories: UserStory[];
  inProgressUserStories: UserStory[];
  doneUserStories: UserStory[];
  projectId: string;
  selectedProject: any;
  projectDetails$: Observable<ProjectDetailsState>;
  ProjectDetailsSubscription: Subscription;
  todoColumn: Column;
  inProgressColumn: Column;
  doneColumn: Column;
  boardState$: Observable<BoardState>;
  boardSubscription: Subscription;
  allUserStories: UserStory[];
  allErrors: Error = null;
  projectsDetailsError: Error = null;
  // tslint:disable-next-line:max-line-length
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<{board: BoardState , projectDetails: ProjectDetailsState}>) {
    this.boardState$ = store.pipe(select('board'));
    this.projectDetails$ = store.pipe(select('projectDetails'));
  }

  board: Board = new Board('Sprint Board', []);

  ngOnInit() {
    this.selectedProject = JSON.parse(sessionStorage.getItem('SelectedProject'));
    if (sessionStorage.getItem('User')) {
      this.boardSubscription = this.boardState$
        .pipe(
          map(response => {
            this.allUserStories = response.userStories;
            this.allErrors = response.userStoriesError;
            this.drawTheBoard();
          })
        ).subscribe();
      this.store.dispatch(BoardActions.BeginGetUserStoriesAction({projectId: this.selectedProject._id}));
    } else {
      this.router.navigateByUrl(constantRoutes.emptyRoute);
    }
  }

  /*
  * This method is used to draw the board
  * */
  drawTheBoard() {
      this.todoUserStories = this.allUserStories.filter(item => item.status.toLowerCase() === 'new');
      this.inProgressUserStories = this.allUserStories.filter(item => item.status.toLowerCase() === 'in progress');
      this.doneUserStories = this.allUserStories.filter(item => item.status.toLowerCase() === 'done');
      this.todoColumn = new Column('New', this.todoUserStories);
      this.inProgressColumn = new Column('In Progress', this.inProgressUserStories);
      this.doneColumn = new Column('Done', this.doneUserStories);
  }

  /*
  * Below are the dropping events for drag and drop
  * */
  dropInTodo(event: CdkDragDrop<UserStory[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.updateTheStatus(event.item.data, 'New');
    }
  }

  dropInProgress(event: CdkDragDrop<UserStory[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.updateTheStatus(event.item.data, 'In Progress');
    }
  }

  dropDone(event: CdkDragDrop<UserStory[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.updateTheStatus(event.item.data, 'Done');
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /*
  * This method is used for updating the status for the stories in board
  * */
  updateTheStatus(userStory: UserStory, status: string) {
    const updateStory = Object.assign({}, userStory);
    updateStory.status = status;
    this.store.dispatch(BoardActions.BeginUpdateUserStory({storyId : updateStory._id, payload: updateStory}));
    this.store.dispatch(BoardActions.BeginGetUserStoriesAction({projectId: this.selectedProject._id}));
  }

  /*
  * Deleting the story using id
  * */
  deleteStory(item) {
    if (window.confirm('Are you sure?')) {
      this.store.dispatch(BoardActions.BeginDeleteUserStory({storyId: item._id}));
    }
  }

  /*
  * Navigating to User Story Details page
  * */
  editTheStory(userStory: UserStory) {
    const id = userStory._id;
    this.router.navigate(['../user-story-details/' + id], { relativeTo: this.activatedRoute });
  }

  /*
  * Create User story pop up
  * */
  createUserStory() {
    this.dialog.open(NewUserStoryComponent, {width: '500px'});
  }
}
