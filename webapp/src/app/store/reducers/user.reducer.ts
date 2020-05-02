import { Action, createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.action';
import UserState, { initializeState } from '../states/user.state';

export const intialState = initializeState();

const reducer = createReducer(
    intialState,
    on(UserActions.RegisterUser, state => state),
    on(UserActions.LoginUser, state => state),
    on(UserActions.GetActiveUsers, state => state),
    on(UserActions.GetUserTasks, state => state),
    on(UserActions.SuccessRegisterUser, (state: UserState) => {
        return { ...state, isUserRegistered: true, userError: null };
    }),
    on(UserActions.SuccessLoginUser, (state: UserState, { payload }) => {
        return { ...state, loggedInUser: payload, isUserRegistered: true, userError: null };
    }),
    on(UserActions.SuccessGetActiveUsers, (state: UserState, { payload }) => {
        return {
            ...state,
            activeUsers: [...payload],
            projectsError: null
        };
    }),
    on(UserActions.SuccessGetUserTasks, (state: UserState, {payload}) => {
        return {
            ...state,
            tasks: payload,
            projectsError: null
        };
    }),
    on(UserActions.ErrorUserAction, (state: UserState, error: Error) => {
        console.log(error);
        return { ...state, projectsError: error };
    })
);

export function UserReducer(state: UserState | undefined, action: Action) {
    return reducer(state, action);
}
