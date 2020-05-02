import Project from '../models/project';

export default class ProjectDetailsState {
    selectedProjectDetails: Project;
    projectsDetailsError: Error;
}

export const initializeState = (): ProjectDetailsState => {
    return { selectedProjectDetails: null, projectsDetailsError: null };
};