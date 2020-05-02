import { Component, OnInit } from '@angular/core';
import { Task } from 'app/store/models/task';
import { Observable, Subscription } from 'rxjs';
import UserState from 'app/store/states/user.state';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import ProjectState from 'app/store/states/project.state';
import ProjectDetailsState from 'app/store/states/project-details.state';
import * as UserActions from '../../store/actions/user.action';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CommentComponent } from '../project/comment/comment.component';
import { Router } from '@angular/router';
import * as constantRoutes from '../../shared/constants';
import { NewTaskComponent } from '../project/new-task/new-task.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  currentUserName: string;
  dataSource: any;
  displayedColumns: string[] = ['title', 'description', 'priority', 'status', 'comments'];
  tasks: Task[];

  activeUsers$: Observable<UserState>;
  ActiveUsersSubscription: Subscription;
  userError: Error = null;
  
  constructor( private store: Store<{ projects: ProjectState, 
    user: UserState, 
    projectDetails: ProjectDetailsState }>,
    private dialog: MatDialog,
    private router: Router,) {
    this.activeUsers$ = store.pipe(select('user'));
   }

  ngOnInit(): void {
    this.tasks = [];
      this.store.dispatch(UserActions.BeginGetUserTasks());
      this.ActiveUsersSubscription = this.activeUsers$
      .pipe(
        map(res => {
          this.tasks = res.tasks;
          this.userError = res.userError;
          this.tasks = this.tasks.filter(task => task.status != "Done");
          this.dataSource = this.tasks;
        })
      )
      .subscribe();
      
  }

  /**
   * Method to truncate long task descriptions
   * @param taskDesc 
   */
  getElementDesc(taskDesc) {
    if (taskDesc.length > 35) {
      return taskDesc.substring(0, 35).concat(" ...");
    }
    return taskDesc;
  }

    // for task comments
    commentTask(task: Task) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '60vw';
      dialogConfig.height="80%";
      dialogConfig.data = task;
      this.dialog.open(CommentComponent, dialogConfig);
    }
  
    navigateToHome():void{
      this.router.navigateByUrl(constantRoutes.homeRoute);
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
}
