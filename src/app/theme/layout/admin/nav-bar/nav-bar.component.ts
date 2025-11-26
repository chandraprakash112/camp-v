import { Component, HostListener, output } from '@angular/core';
import { BerryConfig } from 'src/app/app-config';

import { NavLeftComponent } from './nav-left/nav-left.component';
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import { NavRightComponent } from './nav-right/nav-right.component';
import { DataLoaderService } from 'src/app/theme/shared/service/data-loader.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-nav-bar',
  imports: [NavLogoComponent, NavLeftComponent, NavRightComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  NavCollapse = output();
  NavCollapsedMob = output();
  navCollapsed: boolean;
  windowWidth: number;
  navCollapsedMob: boolean;
  userDetails: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  constructor(
    private dataLoaderService: DataLoaderService,
    // private webSocketService: WebSocketService,
    private commonService: CommonService,
  ) {
    this.windowWidth = window.innerWidth;
    this.navCollapsed =
      this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit(): void {
    this.userDetails = this.commonService?.userDetails;
    this.dataLoaderService.loadData(this.userDetails); // Loading all data into store on app initialization
    console.log(this.userDetails);

    // this.store.select(getStoreData(SELECTOR.APP_CONFIG)).subscribe((data) => {
    //   this.appConfigData = data || {};
    // });
    // this.webSocketService.connect();
    // this.webSocketService.messages$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((msg) => {
    //     const message = JSON.parse(msg);
    //     this.showToastr(message);
    //     this.fetchNotificationCount();
    //   });
  }

  navCollapse() {
    if (this.windowWidth >= 1025) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }
}
