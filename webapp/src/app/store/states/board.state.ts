import UserStory from '../models/userStory';

export default class BoardState {
  userStories: Array<UserStory>;
  userStory: UserStory;
  userStoriesError: Error;
}

export const initializeState = (): BoardState => {
  return { userStories: Array<UserStory>(), userStory: null, userStoriesError: null };
};
