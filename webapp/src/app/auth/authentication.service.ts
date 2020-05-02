import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SocialUser} from 'angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor() {
  }

  userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$: Observable<any> = this.userProfileSubject$.asObservable();
}
