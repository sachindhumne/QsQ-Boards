import User from "./user";

export default class Comment {
    _id: string;
    createdAt: string;
    comment: string;
    taskId: string;
    author: User
}