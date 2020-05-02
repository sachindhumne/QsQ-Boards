import {Task} from './task';

export default class UserStory {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  status: string;
  storyPoints: string;
  priority: string;
  tasks: Task[];
  comment: string[];
}
