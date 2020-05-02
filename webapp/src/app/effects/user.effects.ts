
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as UserActions from '../store/actions/user.action';
import User from '../store/models/user';
import { baseURL } from '../shared/baseurl';
import { Task } from 'app/store/models/task';

@Injectable()
export class UserEffects {
    constructor(private http: HttpClient, private action$: Actions) { }

    private registerApiUrl: string = baseURL + '/users/signup';
    private loginApiUrl: string = baseURL + '/users/login';
    private getActiveUsersUrl: string = baseURL + '/users';
    private getUserTasksUrl: string = baseURL + '/user/tasks';

    RegisterUser$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(UserActions.BeginRegisterUser),
            mergeMap(action =>
                this.http.post(this.registerApiUrl, JSON.stringify(action.payload)).pipe(
                    map((_data) => {
                        return UserActions.SuccessRegisterUser();
                    }),
                    catchError((error: Error) => {
                        return of(UserActions.ErrorUserAction(error));
                    })
                )
            )
        )
    );

    LoginUser$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(UserActions.BeginLoginUser),
            mergeMap(action =>
                this.http
                    .post(this.loginApiUrl, JSON.stringify(action.payload), {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map(data => {
                            return UserActions.SuccessLoginUser({ payload: action.payload });
                        }),
                        catchError((error: Error) => {
                            return of(UserActions.ErrorUserAction(error));
                        })
                    )
            )
        )
    );

    GetActiveUsers$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(UserActions.BeginGetActiveUsers),
            mergeMap(_action =>
                this.http
                    .get(this.getActiveUsersUrl, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map((data: User[]) => {
                            return UserActions.SuccessGetActiveUsers({ payload: data });
                        }),
                        catchError((error: Error) => {
                            return of(UserActions.ErrorUserAction(error));
                        })
                    )
            )
        )
    );

    GetUserTasks$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(UserActions.BeginGetUserTasks),
            mergeMap(_action =>
                this.http
                    .get(this.getUserTasksUrl, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map((data: Task[]) => {
                            return UserActions.SuccessGetUserTasks({ payload: data });
                        }),
                        catchError((error: Error) => {
                            return of(UserActions.ErrorUserAction(error));
                        })
                    )
            )
        )
    );
}
