import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private commonService: CommonService) {}

  canActivate(): boolean {
    const isLoggedIn = this.commonService.getLocalStorageData('userToken');
      if (isLoggedIn) {
      let status = false;
      this.authService.ConfigStatus.subscribe(data => status = data)
      if(status) {
        this.router.navigate(['/admin/admin-dashboard']);
      } else {
        this.router.navigate(['/admin/setting']);
      }
      return false; 
    }
    return true;
  }
}
