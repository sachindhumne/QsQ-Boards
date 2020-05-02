import Comment from '../models/comment';

export default class CommentState {
  comments: Array<Comment>;
  commentsError: Error;
}

export const initializeState = (): CommentState => {
  return { comments: Array<Comment>(), commentsError: null };
};
