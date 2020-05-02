import {Action, createReducer, on} from '@ngrx/store';
import * as BoardActions from '../actions/board.action';
import BoardState, {initializeState} from '../states/board.state';
import UserStory from '../models/userStory';

export const intialState = initializeState();

const reducer = createReducer(
  intialState,
  on(BoardActions.GetAllUserStories, state => state),
  on(BoardActions.CreateUserStoryAction, (state: BoardState, userStory: UserStory) => {
    return { ...state, userStories: [...state.userStories, userStory], userStoriesError: null };
  }),
  /*on(BoardActions.BeginUpdateUserStory, (state: BoardState, userStory: UserStory) => {
    return { ...state, userStories: [...state.userStories,], userStoriesError: null };
  }),*/
  on(BoardActions.SuccessGetAllUserStoriesAction, (state: BoardState, { payload }) => {
    return { ...state, userStories: payload };
  }),
  on(BoardActions.SuccessCreateUserStory, (state: BoardState, { payload }) => {
    return { ...state, userStories: [...state.userStories, payload], userStoriesError: null };
  }),
  on(BoardActions.SuccessUpdateStory, (state: BoardState, { payload }) => {
    return { ...state, userStories: [...state.userStories, payload], userStoriesError: null };
  }),
  on(BoardActions.SuccessDeleteStory, (state: BoardState, { storyId }) => {
    const currentStories = [...state.userStories];
    const indexDel = currentStories.map(story => story._id).indexOf(storyId);
    currentStories.splice(indexDel, 1);
    return { ...state, userStories: [...currentStories], userStoriesError: null };
  }),
  on(BoardActions.SuccessGetStory, (state: BoardState, { payload }) => {
    return { ...state, userStory: payload};
  }),
  on(BoardActions.ErrorUserStoryAction, (state: BoardState, error: Error) => {
    console.log(error);
    return { ...state, userStoriesError: error };
  })
);

export function BoardReducer(state: BoardState | undefined, action: Action) {
  return reducer(state, action);
}
