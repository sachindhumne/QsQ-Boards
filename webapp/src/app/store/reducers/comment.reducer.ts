import { Action, createReducer, on } from '@ngrx/store';
import * as CommentActions from '../actions/comment.action';
import CommentState, { initializeState } from '../states/comment.state';

export const intialState = initializeState();

const reducer = createReducer(
    intialState,
    on(CommentActions.GetComments, state => state),
    on(CommentActions.CreateComment, state => state),
    on(CommentActions.SuccessGetComments, (state: CommentState, { payload }) => {
        return { ...state, comments: payload };
    }),
    on(CommentActions.SuccessCreateComment, (state: CommentState, { payload }) => {
        let currentComments = [...state.comments];
        currentComments.unshift(payload);
        return { 
            ...state, 
            comments: [...currentComments], commentsError: null };
    }),
    on(CommentActions.ErrorCommentsAction, (state: CommentState, error: Error) => {
        return { ...state, commentsError: error };
    })
);

export function CommentReducer(state: CommentState | undefined, action: Action) {
    return reducer(state, action);
}
