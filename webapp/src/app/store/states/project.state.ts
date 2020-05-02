import Project from '../models/project';

export default class ProjectState {
    projects: Array<Project>;
    projectsError: Error;
}

export const initializeState = (): ProjectState => {
    return { projects: Array<Project>(), projectsError: null};
};