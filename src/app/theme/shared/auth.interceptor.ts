import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { CommonService } from './service/common.service';
import { AuthService } from './service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private deviceId = uuid();
  private totalRequests = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedReq = request.clone({
      setHeaders: {
        deviceId: this.deviceId,
      },
    });
    const shouldSkipSpinner = request.url.includes('dropdown') || request.url.includes('constant') || request.url.includes('notification/list');
    let authToken = this.commonService.getLocalStorageData('userToken');
    
    if (authToken) {
      const authRequest = modifiedReq.clone({
        setHeaders: {
          authorization: `Bearer ${authToken}`,
        },
      });
      if(!shouldSkipSpinner) {
        if (this.totalRequests === 0) {
          this.spinner.show();
          console.log(this.spinner);
          
        }
        this.totalRequests++;
      }
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 403) {
            this.authService.logout();
            this.spinner.hide();
          }
          return throwError(() => error);
        }),
        finalize(() => {
          if(!shouldSkipSpinner) {
            this.totalRequests--;
            if (this.totalRequests === 0) {
              this.spinner.hide();
            }
          }
        })
      );
    }
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 403) {
          Swal.fire({
            title: error.error.message,
            icon: 'error'
          })
          this.authService.logout();
          this.spinner.hide();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        if(!shouldSkipSpinner) {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.spinner.hide();
          }
        }
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
