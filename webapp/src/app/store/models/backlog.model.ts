import User from './user';

export class BacklogItem {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: string;
  storyPoints: string;
  priority: string;
  assignee: User;
  type: string;
}