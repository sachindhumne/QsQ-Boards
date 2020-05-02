import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ProjectDetailsActions from '../store/actions/project-details.action';
import Project from '../store/models/project';
import { baseURL } from '../shared/baseurl';


@Injectable()
export class ProjectDetailsEffects {
    constructor(private http: HttpClient, private action$: Actions) { }

    private getOrUpdateApi: string = baseURL.concat('/projects');

    GetProjectDetails$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(ProjectDetailsActions.BeginGetProjectDetailsAction),
            mergeMap(action =>
                this.http.get(this.getOrUpdateApi.concat('/').concat(action.payload)).pipe(
                    map((data: Project) => {
                        return ProjectDetailsActions.SuccessGetProjectDetailsAction({ payload: data });
                    }),
                    catchError((error: Error) => {
                        return of(ProjectDetailsActions.ErrorProjectDetailsAction(error));
                    })
                )
            )
        )
    );
}