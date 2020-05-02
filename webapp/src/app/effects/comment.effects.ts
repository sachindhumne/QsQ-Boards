import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CommentActions from '../store/actions/comment.action';
import Comment from '../store/models/comment';
import { baseURL } from '../shared/baseurl';

@Injectable()
export class CommentEffects {
    constructor(private http: HttpClient, private action$: Actions) { }

    private getOrCreateCommentsURL: string = baseURL.concat('/comments');

    GetComments$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(CommentActions.BeginGetComments),
            mergeMap(action =>
                this.http.get(this.getOrCreateCommentsURL.concat('/').concat(action.payload)).pipe(
                    map((data: Comment[]) => {
                        return CommentActions.SuccessGetComments({ payload: data });
                    }),
                    catchError((error: Error) => {
                        return of(CommentActions.ErrorCommentsAction(error));
                    })
                )
            )
        )
    );

    CreateComment$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(CommentActions.BeginCreateComment),
            mergeMap(action =>
                this.http
                    .post(this.getOrCreateCommentsURL, JSON.stringify(action.payload), {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map((data: Comment) => {
                            return CommentActions.SuccessCreateComment({ payload: data });
                        }),
                        catchError((error: Error) => {
                            return of(CommentActions.ErrorCommentsAction(error));
                        })
                    )
            )
        )
    );
}