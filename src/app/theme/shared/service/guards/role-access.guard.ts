import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';
import { SweetAlertService } from '../sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class RoleAccessGuard implements CanActivate {
  constructor(
    private commonService: CommonService,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const pageName = route.data['pageName'];

    const hasRouteAccess =
      this.commonService.viewPage('Incidents', pageName)?.allowView == true;
    if (hasRouteAccess) {
      return true;
    } else {
      this.sweetAlertService.showWarningPopup(
        '',
        'Sorry! You do not have the access!'
      );
      this.router.navigateByUrl('/admin/dashboard');
      return false;
    }
  }
}
