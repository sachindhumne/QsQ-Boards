# QSQ Boards

## Preview
**[View Live Preview](https://youtu.be/q_oB-u11yxg)**

----------------------------------------------------------
## Technology Stack (MEAN)
* MongoDB
* Express
* Angular
* Node.js
----------------------------------------------------------
## Additional Technologies used 
1. OAuth
2. JWT and BCrypt
3. RxJs
4. @ngrx/effects
5. @ngrx/store
6. Angular Material
7. Highcharts
8. SCSS
----------------------------------------------------------
## How to run the app?
- Start the Frontend Angular App
  - `cd webapp` to enter into the frontend folder
  - `npm install` to install required dependencies
  - `ng serve` to start the Angular CLI server
- Start the Node server backend
  - `cd server` to enter into the backend folder
  - `npm install` to install required dependencies
  - `node server` to start the MongoDB server
----------------------------------------------------------
## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

----------------------------------------------------------
## How to use the app?
1. Click on "Click here to register" to register yourself using a username, emailId and password.
2. On the login page, enter your credentials.
3. On the top navigation bar, click on your username and-
    1. Click on "Profile" to edit and update your details.
    2. Click on "Logout" to logout of the application.
----------------------------------------------------------
### Inbox
Display and manage all tasks assigned to you and not in done status.
1. Click on the green comment icon against each task to view/add comments to the task
2. Click on edit icon against each task to edit task details.
----------------------------------------------------------
#### Project
1. Click on "New Project" on the home page to enter project details and create new project.
2. Click on edit or delete icon on the project card for their respective functionalities.
3. Click on any project card on the home page to navigate to a view and manage details of each project.
----------------------------------------------------------
#### Project - Overview 
To view a high level summary about your project- title, description, members, basic stats

----------------------------------------------------------
#### Project - Board
An interactive project management board to create and manage user stories associated with a project
1. Click on "Add User Story" to enter the details and add a new user story to the project
2. Click and drag user story card to change the status of the story.
3. Click on delete icon on the card to delete the user story
4. Click on edit icon on the card for edit user story details
    1. On "Edit UserStory" tab, update the details and click on "Submit"
    2. On "Edit Task" tab,
        1. Click on "Add task" to create new task
        2. Click on the green comment icon against each task to view/add comments to the task
        3. Click on edit or delete icon against each task for their respective functionality.
----------------------------------------------------------
#### Project - Backlog
To View and manage the backlog items (user story and tasks in new or in-progress status) associated with the task.
1. Click on the search box and start entering the title of a userstory/task to search for it in the list.
2. Click on "Title" on the header to sort the view based on the title.
3. Click on "Export" button to download the view as a csv file.

----------------------------------------------------------
#### Project - Analytics
To view and analyze the project progress.
1. Click on the dropdown on the top middle to select either User Story or Task based analytics.

----------------------------------------------------------
