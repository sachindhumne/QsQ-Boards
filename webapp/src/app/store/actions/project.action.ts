import { createAction, props } from '@ngrx/store';
import Project from '../models/project';

export const GetProjects = createAction('[Project] - Get Projects');

export const CreateProject = createAction(
    '[Project] - Create Project',
    props<Project>()
);

export const DeleteProject = createAction(
    '[Project] - Delete Project',
    props<String>()
);

export const UpdateProject = createAction(
    '[Project] - Update Project',
    props<Project>()
);

export const BeginGetProjectsAction = createAction('[Project] - Begin Get Projects');

export const SuccessGetProjectsAction = createAction(
    '[Project] - Success Get Projects',
    props<{ payload: Project[] }>()
);

export const BeginCreateProject = createAction(
    '[Project] - Begin Create Project',
    props<{ payload: Project }>()
);

export const SuccessCreateProject = createAction(
    '[Project] - Success Create Project',
    props<{ payload: Project }>()
);

export const BeginUpdateProject = createAction(
    '[Project] - Begin Update Project Action',
    props<{ payload: Project }>()
);

export const SuccessUpdateProjectAction = createAction(
    '[Project] - Success Update Project',
    props<{ payload: Project }>()
);

export const BeginDeleteProject = createAction(
    '[Project] - Begin Delete Project',
    props<{ payload: string }>()
);

export const SuccessDeleteProject = createAction(
    '[Project] - Success Delete Project',
    props<{ payload: string }>()
);

export const ErrorProjectAction = createAction('[Project] - Error', props<Error>());
