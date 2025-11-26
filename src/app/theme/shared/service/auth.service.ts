import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './common.service';
import { Store } from '@ngrx/store';
import { resetStoreData } from 'src/app/store/common/common.actions';
import { getBaseUrl } from '../_helpers/base-url.util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'body',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = getBaseUrl()+'/';
  private configStatusSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, private commonService: CommonService, private store: Store) {
    const configStatus = this.commonService.getLocalStorageData('configStatus') || false;
    this.configStatusSubject = new BehaviorSubject<boolean>(configStatus);
  }

  setConfigStatus(value: boolean): void {
    this.commonService.setLocalStorageData('configStatus', value);
    this.configStatusSubject.next(value);
  }

  get ConfigStatus(): Observable<boolean> {
    return this.configStatusSubject.asObservable();
  }

  login(dataInfo: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        deviceId: '1234',
      }),
    };
    return this.http
      .post(
        // this.baseUrl + 'user-management/api/v1/login',
        this.baseUrl + 'api/admin/agent/login',
        dataInfo,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  register(dataInfo: any) {
    return this.http.post(
      // this.baseUrl + 'user-management/api/v1/register/customer',
      this.baseUrl + 'api/admin/agent/register',
      dataInfo
    );
  }

  logout() {
    this.spinner.show();
    localStorage.clear();
    this.commonService.apiPersonaResponse = null;
    this.store.dispatch(resetStoreData());
    setTimeout(() => {
      this.toastr.info('User Logged Out Successfully');
      this.router.navigate(['/login']);
      this.spinner.hide();
    }, 100);
  }

  checkModuleVisibility(): Observable<any> {
    return this.http
      .get(
        this.baseUrl + 'secure/user-management/api/v1/config/enable/status',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          if (res.body.statusCode == 200 && res.body.status == true) {
            this.setConfigStatus(res.body.responseObject.configEnabled);
          }
          return res;
        })
      );
  }
}
