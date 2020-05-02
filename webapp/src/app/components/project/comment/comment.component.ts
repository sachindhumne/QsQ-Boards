import { Component, OnInit, Inject } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {map} from "rxjs/operators";
import * as CommentActions from "../../../store/actions/comment.action";
import CommentState from 'app/store/states/comment.state';
import Comment from 'app/store/models/comment';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Task } from 'app/store/models/task';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentState$: Observable<CommentState>;
  commentSubscription: Subscription;
  commentsError: Error = null;
  taskComments: Comment[];
  currentTask: Task;
  createCommentForm: FormGroup;
  emptyImgUrl: string = '../../../assets/blank-profile-picture.png';

  constructor(public fb: FormBuilder, private store: Store<{comments: CommentState}>, @Inject(MAT_DIALOG_DATA) data,  private dialogRef: MatDialogRef<CommentComponent>) { 
    this.commentState$ = store.pipe(select('comments'));
    this.currentTask = data;
  }

  ngOnInit(): void {
    this.createCommentForm = this.fb.group({
      comment: ['', [Validators.required]]
    });

    this.store.dispatch(CommentActions.BeginGetComments({payload: this.currentTask._id}));
    this.commentSubscription = this.commentState$
        .pipe(
          map(response => {
            this.taskComments = response.comments;
            this.commentsError = response.commentsError;
          })
        ).subscribe();
  }

  // Creating a comment
 onSubmit(formDirective: FormGroupDirective) {
  if (!this.createCommentForm.valid) {
    return false;
  } else {
    const createdComment: Comment = this.createCommentForm.value;
    createdComment.taskId = this.currentTask._id ;
    this.store.dispatch(CommentActions.BeginCreateComment({payload: createdComment}));
    formDirective.resetForm();
    this.createCommentForm.reset();
    }
  }


  cancel() {
    this.dialogRef.close();
  }

}
