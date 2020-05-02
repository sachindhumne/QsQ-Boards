import { createAction, props } from '@ngrx/store';
import Project from '../models/project';

export const GetProjectDetails = createAction(
    '[ProjectDetails] - Get Project Details',
    props<String>()
);

export const BeginGetProjectDetailsAction = createAction(
    '[ProjectDetails] - Begin Get Project Details Action',
    props<{ payload: string }>()
);

export const SuccessGetProjectDetailsAction = createAction(
    '[ProjectDetails] - Success Get Project Details',
    props<{ payload: Project }>()
);

export const ErrorProjectDetailsAction = createAction('[ProjectDetails] - Error', props<Error>());
