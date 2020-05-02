import User from '../models/user';
import { Task } from '../models/task';

export default class UserState {
    activeUsers: Array<User>;
    loggedInUser: User;
    authToken: string;
    userError: Error;
    isUserRegistered: boolean;
    tasks: Array<Task>;
}

export const initializeState = (): UserState => { 
    return {
        activeUsers: Array<User>(),
        loggedInUser: null,
        authToken: '',
        userError: null,
        isUserRegistered: false,
        tasks: Array<Task>()
    };
};