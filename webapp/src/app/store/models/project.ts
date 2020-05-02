import User from "./user";

export default class Project {
    _id: string;
    title: string;
    owner: User;
    description: string;
    members?: User[];
    status: string;
}