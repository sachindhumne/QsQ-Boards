import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // We retrieve the token, if any
    const user = JSON.parse(sessionStorage.getItem('User'));
    //let newHeaders = req.headers.set('Content-Type', 'application/json');
    let newHeaders;
    if (user) {
      // If we have a token, we append it to our new headers
      const token = user.token;
      newHeaders = req.headers.set('Authorization', 'Bearer ' + token);
    }
    // Finally we have to clone our request with our new headers
    // This is required because HttpRequests are immutable
    const authReq = req.clone({headers: newHeaders});
    // Then we return an Observable that will run the request
    // or pass it to the next interceptor if any
    return next.handle(authReq);
  }
}
