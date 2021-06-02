import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/_services';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  tkn: string = null;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      this.tkn = params.token;
      console.log('route token:', params.token, this.tkn);
    });
    console.log('interceptor constructor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // const currentUser = this.authenticationService.currentUserValue;
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = this.tkn;
    console.log(localStorage.getItem('currentUser'));

    // if (currentUser && currentUser.token) {
    if (currentUser) {
      localStorage.setItem('currentUser', '{"id":1,"username":"test","firstName":"Test","lastName":"User","token":"fake-jwt-token"}');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser}`
        }
      });

      console.log('tkn set:', this.tkn);
    }

    return next.handle(request);
  }
}
