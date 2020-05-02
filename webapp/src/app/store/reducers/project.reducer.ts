import { Action, createReducer, on } from '@ngrx/store';
import * as ProjectActions from '../actions/project.action';
import ProjectState, { initializeState } from '../states/project.state';

export const intialState = initializeState();

const reducer = createReducer(
    intialState,
    on(ProjectActions.GetProjects, state => state),
    on(ProjectActions.CreateProject, state => state),
    on(ProjectActions.DeleteProject, state => state),
    on(ProjectActions.UpdateProject, state => state),
    on(ProjectActions.SuccessGetProjectsAction, (state: ProjectState, { payload }) => {
        return { ...state, projects: payload };
    }),
    on(ProjectActions.SuccessCreateProject, (state: ProjectState, { payload }) => {
        return { ...state, projects: [...state.projects, payload], projectsError: null };
    }),
    on(ProjectActions.SuccessDeleteProject, (state: ProjectState, { payload }) => {
        const currentProjects = [...state.projects];
        // get index of object with projectId
        const removeIndex = currentProjects.map(function(project) { return project._id; }).indexOf(payload);
        // remove object
        currentProjects.splice(removeIndex, 1);
        return {
            ...state,
            projects: [...currentProjects],
            projectsError: null
        };
    }),
    on(ProjectActions.SuccessUpdateProjectAction, (state: ProjectState, { payload }) => {
        let currentProjects = [...state.projects];
        let foundIndex = currentProjects.findIndex(project => project._id === payload._id);
        currentProjects[foundIndex] = payload;
        return { ...state, projects: [...currentProjects], projectsError: null };
    }),
    on(ProjectActions.ErrorProjectAction, (state: ProjectState, error: Error) => {
        console.log(error);
        return { ...state, projectsError: error };
    })
);

export function ProjectReducer(state: ProjectState | undefined, action: Action) {
    return reducer(state, action);
}
