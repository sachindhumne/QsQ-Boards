import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ProjectActions from '../store/actions/project.action';
import Project from '../store/models/project';
import { baseURL } from '../shared/baseurl';

@Injectable()
export class ProjectEffects {
    constructor(private http: HttpClient, private action$: Actions) { }

    private getOrCreateProjectsURL: string = baseURL.concat('/projects');

    GetProjects$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(ProjectActions.BeginGetProjectsAction),
            mergeMap(action =>
                this.http.get(this.getOrCreateProjectsURL).pipe(
                    map((data: Project[]) => {
                        return ProjectActions.SuccessGetProjectsAction({ payload: data });
                    }),
                    catchError((error: Error) => {
                        return of(ProjectActions.ErrorProjectAction(error));
                    })
                )
            )
        )
    );

    CreateProject$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(ProjectActions.BeginCreateProject),
            mergeMap(action =>
                this.http
                    .post(this.getOrCreateProjectsURL, JSON.stringify(action.payload), {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map((data: Project) => {
                            return ProjectActions.SuccessCreateProject({ payload: data });
                        }),
                        catchError((error: Error) => {
                            return of(ProjectActions.ErrorProjectAction(error));
                        })
                    )
            )
        )
    );

    DeleteProject$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(ProjectActions.BeginDeleteProject),
            mergeMap(action =>
                this.http
                    .delete(this.getOrCreateProjectsURL.concat('/').concat(action.payload), {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map((_data) => {
                            return ProjectActions.SuccessDeleteProject({ payload: action.payload });
                        }),
                        catchError((error: Error) => {
                            return of(ProjectActions.ErrorProjectAction(error));
                        })
                    )
            )
        )
    );

    UpdateProject$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(ProjectActions.BeginUpdateProject),
            mergeMap(action =>
                this.http
                    .put(this.getOrCreateProjectsURL.concat('/').concat(action.payload._id), JSON.stringify(action.payload), {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .pipe(
                        map((_data) => {
                            return ProjectActions.SuccessUpdateProjectAction({ payload: action.payload });
                        }),
                        catchError((error: Error) => {
                            return of(ProjectActions.ErrorProjectAction(error));
                        })
                    )
            )
        )
    );
}