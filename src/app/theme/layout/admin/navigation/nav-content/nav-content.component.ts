// Angular import
import { Component, OnInit, output, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

//theme version
import { environment } from 'src/environments/environment';

// project import
import { NavigationItem, NavigationItems } from '../navigation';

import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';

// NgScrollbarModule
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Store } from '@ngrx/store';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-nav-content',
  imports: [RouterModule, NavCollapseComponent, NavGroupComponent, NavItemComponent, SharedModule],
  templateUrl: './nav-content.component.html',
  styleUrl: './nav-content.component.scss'
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);

  NavCollapsedMob = output();
  SubmenuCollapse = output();

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  windowWidth: number;

  constructor(
    public commonService: CommonService,
    private store: Store,
  ) {
    // this.navigations = NavigationItems;
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
    this.store.select(getStoreData(SELECTOR.PERSONA)).subscribe((data) => {
      this.fetchDetails(data);
    });

    if (this.windowWidth < 1025) {
      setTimeout(() => {
        (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
      }, 500);
    }
  }

  fetchDetails(data:any) {
    if (data) {
      const userDetails = this.commonService.userDetails;
      const role = data?.find(
        (user: any) => user?.id == userDetails?.role_id
      );

      this.navigations = NavigationItems.filter((menu) => {
        menu['allowView'] = false;

        if (menu?.children?.length > 0) {
          menu.children = menu.children?.filter((subMenu: any) => {
            const pagePermission = role?.modules?.find(
              (mod: any) => mod?.controller_title?.trim() === subMenu?.id
            );

            if (pagePermission?.status === 'Yes') {
              menu['title'] = pagePermission?.menu_name || menu?.title;
              menu['allowView'] = true;

              subMenu['allowView'] = true;
              subMenu['title'] = pagePermission?.display_title || subMenu?.title;
            }
            return subMenu;
          });
        } else {
          const pagePermission = role?.modules?.find(
            (mod: any) => mod?.title?.trim() === menu.title
          );

          if (pagePermission?.status === 'Yes') {
            menu['allowView'] = true;
            menu['title'] = pagePermission?.display_title || menu?.title;
          }
        }
        return menu;
      });
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    // eslint-disable-next-line
    // @ts-ignore
    if (this.location['_baseHref']) {
      // eslint-disable-next-line
      // @ts-ignore
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
