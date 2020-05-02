import { createAction, props } from '@ngrx/store';
import Comment from '../models/comment';

export const GetComments = createAction(
    '[Comments] - Get Comments',
    props<String>()
);

export const CreateComment = createAction(
    '[Comments] - Create Comment',
    props<Comment>()
);

export const BeginGetComments = createAction(
    '[Comments] - Begin Get Comments',
    props<{ payload: string }>()
);

export const SuccessGetComments = createAction(
    '[Comments] - Success Get Comments',
    props<{ payload: Comment[] }>()
);

export const BeginCreateComment = createAction(
    '[Comments] - Begin Create Comments',
    props<{ payload: Comment }>()
);

export const SuccessCreateComment = createAction(
    '[Comments] - Success Create Comment',
    props<{ payload: Comment }>()
);

export const ErrorCommentsAction = createAction('[Comments] - Error', props<Error>());
