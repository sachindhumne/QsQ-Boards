import { Action, createReducer, on } from '@ngrx/store';
import * as ProjectDetailsActions from '../actions/project-details.action';
import ProjectDetailsState, { initializeState } from '../states/project-details.state';

export const intialState = initializeState();

const reducer = createReducer(
    intialState,
    on(ProjectDetailsActions.GetProjectDetails, state => state),
    on(ProjectDetailsActions.SuccessGetProjectDetailsAction, (state: ProjectDetailsState, { payload }) => {
        return { ...state, selectedProjectDetails: payload };
    }),
    on(ProjectDetailsActions.ErrorProjectDetailsAction, (state: ProjectDetailsState, error: Error) => {
        return { ...state, projectsDetailsError: error };
    })
);

export function ProjectDetailsReducer(state: ProjectDetailsState | undefined, action: Action) {
    return reducer(state, action);
}