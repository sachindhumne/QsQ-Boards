import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router } from "@angular/router";
import * as constantRoutes from '../../shared/constants';
import { baseURL } from 'app/shared/baseurl';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  profile: any;
  url: string | ArrayBuffer;
  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('User')) {
      this.profile = JSON.parse(sessionStorage.getItem('User'));
      if(this.profile.image == ""){
        this.url = null;
      }
      else{
        this.url = this.profile.image;
      }
      //this.authService.userProfile$.subscribe(prof => this.profile = prof);
    }
  }

  navigateToHome():void{
    this.router.navigateByUrl(constantRoutes.homeRoute);
  }
  logoutProfile(): void {
    this.authService.userProfile$.subscribe().unsubscribe();
    sessionStorage.removeItem('User');
    this.router.navigateByUrl(constantRoutes.emptyRoute);
  }

  editProfile(): void {
    this.router.navigateByUrl(constantRoutes.userProfileRoute);
  }
}
