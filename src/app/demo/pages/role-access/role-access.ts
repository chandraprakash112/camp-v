import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataLoaderService } from 'src/app/theme/shared/service/data-loader.service';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-role-access',
  imports: [SharedModule],
  templateUrl: './role-access.html',
  styleUrl: './role-access.scss',
})
export class RoleAccess extends UnsubscribeBase {
  personaDetails: any;
  roleList: any[] = [];
  moduleList: any = [];
  changedAccessList: any[] = [];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private store: Store,
    private dataLoaderService: DataLoaderService,
    public commonService: CommonService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.select(getStoreData(SELECTOR.PERSONA)).subscribe((data) => {
      if (data) {
        this.roleList = data;
        this.moduleList = data?.[0]?.modules;
      }
    });

    // this.fetchAllPersona();
  }

  fetchAllPersona() {
    this.apiService
      .commonGetMethod('/api/admin/admin-setting/role-access/listing-page', {
        view_as: 'role',
        show_rows: 50,
        page: 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.personaDetails = res.data;
            console.log(this.personaDetails);

            // const personaKeys = Object.keys(this.personaDetails?.[0] || []);

            this.roleList = this.personaDetails?.[0] || [];
            // .map((item: any) => {
            //   return {
            //     roleId: item.split(',')[0],
            //     roleName: item.split(',')[1],
            //   };
            // });

            this.moduleList = this.personaDetails?.[1]?.data || [];
            // if (personaKeys.length) {
            //   const firstRole = this.personaDetails[personaKeys[0]];
            //   firstRole.forEach((val) => {
            //     val.pageDetailsList.forEach((page) => {
            //       if (!this.moduleList.some((m) => m.pageId === page.pageId)) {
            //         this.moduleList.push(page);
            //       }
            //     });
            //   });
            // }
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  trackByModule(index: number, item: any) {
    return item?.id;
  }

  getPermission(role: any, role_access: any) {
    const page = role_access.find((page: any) => page?.role_id === role?.id);
    if (page) {
      return page;
    }
    return { status: 'No', allowEdit: false };
  }

  changeAccess(type: string, page: any, roleId: string, pageId: number) {
    const updatedPage = { ...page };
    if (type === 'view') {
      updatedPage.allowView = !page.allowView;
    } else {
      updatedPage.allowEdit = !page.allowEdit;
    }
    const index = this.changedAccessList.findIndex(
      (item) => item.roleId === roleId && item.pageId === pageId,
    );
    if (index > -1) {
      this.changedAccessList[index] = {
        ...this.changedAccessList[index],
        ...updatedPage,
      };
    } else {
      this.changedAccessList.push({ ...updatedPage, roleId, pageId });
    }
    page.allowView = updatedPage.allowView;
    page.allowEdit = updatedPage.allowEdit;
  }

  onSubmitRoleAccess() {
    if (this.changedAccessList.length) {
      this.apiService
        .commonPostMethod('/secure/user-management/api/update/access/persona', {
          updateAccessPersona: this.changedAccessList,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status == true && response.statusCode == 200) {
              this.toastr.success(response.message);
              this.changedAccessList = [];
              this.fetchAllPersona();
              this.dataLoaderService.fetchPersona();
            } else {
              this.toastr.error(response.message);
            }
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }

  isAccessChanged(roleId: string, pageId: number) {
    return this.changedAccessList.some(
      (item) => item.roleId === roleId && item.pageId === pageId,
    );
  }

  onChangeRoleAccess(role: any, index: number, moduleIndex: number) {
    console.log(role);

    this.apiService
      .commonPostMethod('/api/admin/admin-setting/role-access/change-access', {
        role_id: role?.id,
        page_id: role?.page_id,
        status: role?.status == 'Yes' ? 'No' : 'Yes',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.status_code == 200) {
            this.toastr.success(response.message);
            this.dataLoaderService.fetchPersona();
            this.roleList[index].modules[moduleIndex].status =
              role?.status == 'Yes' ? 'No' : 'Yes';
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
