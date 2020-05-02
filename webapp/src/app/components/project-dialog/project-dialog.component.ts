import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import User from '../../store/models/user';
import Project from '../../store/models/project';
import { select, Store } from '@ngrx/store';

// import { take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

// States
import UserState from 'app/store/states/user.state';
import ProjectState from '../../store/states/project.state';
import ProjectDetailsState from '../../store/states/project-details.state';

// Actions
import * as ProjectActions from '../../store/actions/project.action';


@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  emptyImgUrl: string = '../../../assets/blank-profile-picture.png';
  projectForm: FormGroup;
  members = new FormControl([]);
  searchTerm: string;
  dialogTitle: string;
  update: boolean;
  projectId: string;
  statusKeys = [
    {value: 'New', viewValue: 'New'},
    {value: 'In progress', viewValue: 'In progress'},
    {value: 'Done', viewValue: 'Done'}];
  activeUsers$: Observable<UserState>;
  activeUsers: User[];
  ActiveUsersSubscription: Subscription;
  userError: Error = null;
  dialogData: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<{ projects: ProjectState, user: UserState, projectDetails: ProjectDetailsState }>
  ) {
    this.activeUsers$ = store.pipe(select('user'));
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.ActiveUsersSubscription = this.activeUsers$
      .pipe(
        map(res => {
          this.activeUsers = res.activeUsers;
          this.userError = res.userError;
        })
      )
      .subscribe();

    // Test

    if (this.dialogData == null) {
      this.dialogTitle = "New Project";
      this.projectForm = new FormGroup({
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        members: this.members,
        status: new FormControl("New", null)
      });
    } else {

      this.dialogTitle = "Update Project";
      this.update = true;
      this.projectId = this.dialogData["id"];
      this.projectForm = new FormGroup({
        title: new FormControl(this.dialogData["title"], Validators.required),
        description: new FormControl(this.dialogData["description"], Validators.required),
        members: this.members,
        status: new FormControl(this.dialogData["status"], null)
      });
      let selectedMembers = [];
      this.dialogData["members"].forEach(member => {
        selectedMembers.push({
          userName: member,
          image: (this.activeUsers.find(activeUser => activeUser.userName === member)).image
        })
      })
      this.projectForm.controls['members'].setValue(selectedMembers, { onlySelf: true });
    }

  }

  /**
   * Returns comparison result of 2 user names
   * @param x 
   * @param y 
   */
  compareFn(x: User, y: User): boolean {
    return x && y ? x.userName === y.userName : x === y;
  }

  /**
   * Returns comparison result of 2 project statuses
   * @param x 
   * @param y 
   */
  compareStatus(x: string, y: string) : boolean {
    return x && y ? x === y : false;
  }

  isValid(controlName) {
    return this.projectForm.get(controlName).invalid && this.projectForm.get(controlName).touched;
  }

  onMemberRemoved(member: User) {
    const members = this.members.value as User[];
    this.removeFirst(members, member);
    this.members.setValue(members); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  modifyMembersValue(members) {
    let memberUserNames = [];
    if (members.length > 0) {
      members.forEach(member => memberUserNames.push(member.userName))
    }
    return memberUserNames;
  }

  /**
   * Handles creation of new project
   * @param newProject 
   */
  createProject(newProject) {
    const project: Project = newProject;
    // assign owner from session. 
    const loggedInUser = JSON.parse(sessionStorage.getItem('User'));
    project.owner = loggedInUser.userName;
    this.store.dispatch(ProjectActions.BeginCreateProject({ payload: project }));
    this.dialogRef.close();
  }

  /**
   * Handles updation of project
   * @param updatedProject 
   */
  updateProject(updatedProject) {
    const project: Project = updatedProject;
    // assign owner from session. 
    const loggedInUser = JSON.parse(sessionStorage.getItem('User'));
    project.owner = loggedInUser.userName;
    project._id = this.projectId;
    this.store.dispatch(ProjectActions.BeginUpdateProject({ payload: project }));
    this.dialogRef.close();
  }

  save() {
    if (this.projectForm.valid) {
      const validMembers = this.modifyMembersValue(this.projectForm.value.members);
      this.projectForm.value.members = validMembers;
      if (this.update) {
        this.updateProject(this.projectForm.value);
      } else {
        this.createProject(this.projectForm.value)
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSelectClose() {
    this.searchTerm = "";
  }
}
