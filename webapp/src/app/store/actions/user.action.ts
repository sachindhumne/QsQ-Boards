import { createAction, props } from '@ngrx/store';
import User from '../models/user';
import { Task } from '../models/task';

// Types with props
export const RegisterUser = createAction(
    '[User] - Register User',
    props<User>()
);
export const LoginUser = createAction(
    '[User] - Login User',
    props<User>()
);
export const GetActiveUsers = createAction('[User] - Get Active Users');

export const GetUserTasks = createAction('[Task] - Get User tasks')

// Begin Actions
export const BeginRegisterUser = createAction(
    '[User] - Begin Register User',
    props<{ payload: User }>()
);

export const SuccessRegisterUser = createAction('[ToDo] - Success Register User');

export const BeginLoginUser = createAction(
    '[User] - Begin Login User',
    props<{ payload: User }>()
);

export const SuccessLoginUser = createAction(
    '[User] - Success Login User',
    props<{ payload: User }>()
);


export const BeginGetActiveUsers = createAction('[User] - Begin Get Active Users');

export const SuccessGetActiveUsers = createAction(
    '[User] - Success Get Active Users',
    props<{ payload: User[] }>()
);

export const BeginGetUserTasks = createAction('[Task] - Begin Get User tasks');

export const SuccessGetUserTasks = createAction(
    '[Task] - Success Get User tasks',
    props<{ payload: Task[] }>()
);


export const ErrorUserAction = createAction('[User] - Error', props<Error>());
