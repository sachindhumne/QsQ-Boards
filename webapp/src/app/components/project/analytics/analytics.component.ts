import {ActivatedRoute, Route, Router} from "@angular/router";
import * as constantRoutes from "../../../shared/constants";
import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as Highcharts from 'highcharts';
import {Observable, Subject, Subscription} from 'rxjs';
import ProjectDetailsState from "../../../store/states/project-details.state";
import UserStory from '../../../store/models/userStory';
import BoardState from '../../../store/states/board.state';
import {map} from 'rxjs/operators';
import * as BoardActions from '../../../store/actions/board.action';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

   projectDetails$: Observable<ProjectDetailsState>;
  ProjectDetailsSubscription: Subscription;
  boardState$: Observable<BoardState>;
  boardSubscription: Subscription;
  allUserStories: UserStory[];
  allErrors: Error = null;
  projectsDetailsError: Error = null;
  selectedProject: any;
  openCount : number = 0;
  inProgressCount: number =0;
  finishedCount : number =0;
  lowCount : number = 0;
  mediumCount: number =0;
  highCount : number =0;
  openTaskCount : number = 0;
  inProgressTaskCount: number =0;
  finishedTaskCount : number =0;
  lowTaskCount : number = 0;
  mediumTaskCount: number =0;
  highTaskCount : number =0;
  optionValue : string = "userstories";

  constructor(private router: Router,private storePrDetail: Store<{ projectDetails: ProjectDetailsState }>,
   private store: Store<{board: BoardState }>) {
      this.boardState$ = store.pipe(select('board'));
      this.projectDetails$ = this.storePrDetail.pipe(select('projectDetails'));
    }

  ngOnInit(): void {
   if (sessionStorage.getItem('User')) {
      this.ProjectDetailsSubscription = this.projectDetails$
        .pipe(
          map(res => {
            if (res) {
              this.selectedProject = res.selectedProjectDetails;
              this.projectsDetailsError = res.projectsDetailsError;
              this.getUserStories();
            }
          })).subscribe();
    } else {
      this.router.navigateByUrl(constantRoutes.emptyRoute);
    }
  }

   getUserStories() {
   if(!this.selectedProject) {
      this.selectedProject = JSON.parse(sessionStorage.getItem('SelectedProject'));
    }
   this.boardSubscription = this.boardState$
     .pipe(
       map(response => {
         this.allUserStories = response.userStories;
         this.allErrors = response.userStoriesError;
         this.constructGraphData();
         
       })
     ).subscribe();
      this.store.dispatch(BoardActions.BeginGetUserStoriesAction({projectId: this.selectedProject._id}));
     
  }

  resetCount() { 
   this.openCount = 0;
   this.inProgressCount = 0;
   this.finishedCount  = 0;
   this.lowCount = 0;
   this.mediumCount = 0;
   this.highCount  = 0;
   this.openTaskCount = 0;
   this.inProgressTaskCount = 0;
   this.finishedTaskCount = 0;
   this.lowTaskCount = 0;
   this.mediumTaskCount = 0;
   this.highTaskCount = 0;
  } 

  /**
   * Sets the value and axes required for the construction of charts
   */
  constructGraphData(){
   this.resetCount();
      this.allUserStories.forEach(
         story => {
            if(story.status.toLowerCase() == "new"){
               this.openCount++;
            }
            if(story.status.toLowerCase() == "in progress"){
               this.inProgressCount++;
            }
            if(story.status.toLowerCase() == "done"){
               this.finishedCount++;
            }
            if(story.priority.toLowerCase() == "low"){
               this.lowCount++;
            }
            if(story.priority.toLowerCase() == "medium"){
               this.mediumCount++;
            }
            if(story.priority.toLowerCase() == "high"){
               this.highCount++;
            }
            story.tasks.forEach(task => {
               if(task.status.toLowerCase() == "new"){
                  this.openTaskCount++;
               }
               if(task.status.toLowerCase() == "in progress"){
                  this.inProgressTaskCount++;
               }
               if(task.status.toLowerCase() == "done"){
                  this.finishedTaskCount++;
               }
               if(task.priority.toLowerCase()== "low"){
                  this.lowTaskCount++;
               }
               if(task.priority.toLowerCase() == "medium"){
                  this.mediumTaskCount++;
               }
               if(task.priority.toLowerCase() == "high"){
                  this.highTaskCount++;
               }
            })
         }
      )

      this.chartOptions = {
         chart : {
            plotBorderWidth: null,
            plotShadow: false
         },
         title : {
            text: 'Project User Stories Stats'   
         },
         tooltip : {
               pointFormat: '{series.name}:{point.y}'
         },
         plotOptions : {
            pie: {
               allowPointSelect: true,
               cursor: 'pointer',
         
               dataLabels: {
                  enabled: false           
               },
               colors: [
                  '#ff9504',
                  '#3f51b5',
                  'mediumseagreen',
                  
          ],
               showInLegend: true
            }
         },
         series : [{
            type: 'pie',
            name: 'User Stories',
            data: [
               ['New',   this.openCount],
               ['In Progress', this.inProgressCount],
               {
                  name: 'Done',
                  y: this.finishedCount,
                  sliced: true,
                  selected: true
               }
            ]
         }]
      };


      this.burnDownChartOptions = {
         chart: {
            type: 'bar'
         },
         title: {
            text: 'Priority vs Number of User Stories'
         },
         legend : {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 250,
            y: 100,
            floating: true,
            borderWidth: 1,
           
            backgroundColor: ('#FFFFFF'), shadow: true
            },
            xAxis:{
               categories: ['Prority'], title: {
               text: null
            } 
         },
         yAxis : {
            min: 0, title: {
               text: 'Number of User Stories', align: 'high'
            },
            labels: {
               overflow: 'justify'
            },
            tickInterval: 1
         },
         plotOptions : {
            bar: {
               dataLabels: {
                  enabled: true
               }
            }
         },
         credits:{
            enabled: false
         },
         colors: [
            'red',
            '#ff9504',
            'mediumseagreen',
            
    ],
         series: [
            {
               name: 'High',
               data: [this.highCount]
            }, 
            {
               name: 'Medium',
               data: [this.mediumCount]
            }, 
            {
               name: 'Low',
               data: [this.lowCount]      
            }
         ]
      };

      this.taskPieChartOptions = {
         chart : {
            plotBorderWidth: null,
            plotShadow: false
         },
         title : {
            text: 'Project Tasks stats'   
         },
         tooltip : {
               pointFormat: '{series.name}:{point.y}'
         },
         plotOptions : {
            pie: {
               allowPointSelect: true,
               cursor: 'pointer',
         
               dataLabels: {
                  enabled: false           
               },
               colors: [
                  '#ff9504',
                  '#3f51b5',
                  'mediumseagreen',
                  
          ],
               showInLegend: true
            }
         },
         series : [{
            type: 'pie',
            name: 'All Tasks',
            data: [
               ['New',   this.openTaskCount],
               ['In Progress', this.inProgressTaskCount],
               {
                  name: 'Done',
                  y: this.finishedTaskCount,
                  sliced: true,
                  selected: true
               }
            ]
         }]
      };


      this.taskBarGraphOptions = {
         chart: {
            type: 'bar'
         },
         title: {
            text: 'Priority vs Number of Tasks'
         },
         legend : {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 250,
            y: 100,
            floating: true,
            borderWidth: 1,
           
            backgroundColor: ('#FFFFFF'), shadow: true
            },
            xAxis:{
               categories: ['Prority'], title: {
               text: null
            } 
         },
         yAxis : {
            min: 0, title: {
               text: 'Number of Tasks', align: 'high'
            },
            labels: {
               overflow: 'justify'
            },
            tickInterval: 1
         },
         plotOptions : {
            bar: {
               dataLabels: {
                  enabled: true
               }
            }
         },
         credits:{
            enabled: false
         },
         colors: [
            'red',
            '#ff9504',
            'mediumseagreen',
    ],
         series: [
            {
               name: 'High',
               data: [this.highTaskCount]
            }, 
            {
               name: 'Medium',
               data: [this.mediumTaskCount]
            }, 
            {
               name: 'Low',
               data: [this.lowTaskCount]      
            }
         ]
      };
  }

  highcharts = Highcharts;
  chartOptions = {};


   burnDownHighcharts = Highcharts;
   burnDownChartOptions = {
   };


   taskPieChart = Highcharts;
   taskPieChartOptions = {};


   taskBarGraph = Highcharts;
   taskBarGraphOptions = {
   };
}
