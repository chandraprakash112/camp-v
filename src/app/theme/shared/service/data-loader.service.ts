import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { SELECTOR } from 'src/app/store/common/common.selectors';
import { saveStoreData } from 'src/app/store/common/common.actions';

@Injectable({
  providedIn: 'root',
})
export class DataLoaderService {
  constructor(
    private store: Store,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService,
  ) {}
  loadData(user: any) {
    this.fetchPersona();
    this.fetchDepartment();
    this.fetchBusinessUnits();
    this.fetchRoles();
    this.fetchUsers();
    this.fetchCategories();
    // this.fetchConfigStatus();
    // this.fetchProfileDetails(user?.id);
    // this.fetchAppConfig();
    // this.fetchBins();
    // this.fetchSeverity();
    // this.fetchStatus();
    // this.fetchAssignUserList();
    // this.fetchCreatedUserList();
    // this.fetchLocationDetails();
  }

  fetchPersona() {
    this.commonService.removeLocalStorageData('persona');
    this.apiService
      .commonGetMethod('/api/admin/admin-setting/role-access/listing-page', {
        view_as: 'role',
        show_rows: 50,
        page: 1,
      })
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            let accessPersona = res.data;
            this.commonService.apiPersonaResponse = accessPersona;
            this.commonService.personaResponse =
              this.commonService.getPersonaData(accessPersona);
            this.commonService.setLocalStorageData('persona', accessPersona);
            this.store.dispatch(
              saveStoreData({
                key: SELECTOR.PERSONA,
                data: this.commonService.personaResponse,
              }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchConfigStatus() {
    this.authService.checkModuleVisibility().subscribe((res) => {});
  }

  fetchProfileDetails(id) {
    this.apiService
      .commonGetMethod(`/api/admin/agent/view/${id}`, {})
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            let userDetails = res?.data;
            this.commonService.userDetails = userDetails;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.PROFILE, data: userDetails }),
            );
            // this.store.dispatch(
            //   saveStoreData({ key: SELECTOR.ROLE_TYPE, data: userDetails.roleType == 'Both' ? 'Creator' : userDetails.roleType })
            // );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }
  fetchRoles() {
    this.apiService.commonGetMethod('/api/admin/masters/role', {}).subscribe({
      next: (res) => {
        if (res.status == true && res.status_code === 200) {
          let roles = res.data?.data?.map((el: any) => ({
            ...el,
            id: el?.id?.toString(),
          }));
          this.store.dispatch(
            saveStoreData({ key: SELECTOR.ROLES, data: roles }),
          );
        } else {
          console.error(res.message);
        }
      },
      error: (err) => {
        console.error(err.error.message);
      },
    });
  }
  fetchUsers() {
    this.apiService.commonGetMethod('/api/admin/agent/list', {}).subscribe({
      next: (res) => {
        if (res.status == true && res.status_code === 200) {
          let list = res.data?.data?.map((el: any) => ({
            ...el,
            id: el?.id?.toString(),
          }));
          this.store.dispatch(
            saveStoreData({ key: SELECTOR.USERS, data: list }),
          );
        } else {
          console.error(res.message);
        }
      },
      error: (err) => {
        console.error(err.error.message);
      },
    });
  }

  fetchDepartment() {
    this.apiService
      .commonGetMethod('/api/admin/masters/department', {})
      .subscribe({
        next: (res: any) => {
          if (res.status == true && res.status_code === 200) {
            let list = res.data?.data?.map((el: any) => ({
              ...el,
              id: el?.id?.toString(),
            }));
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.DEPARTMENT, data: list }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }
  fetchBusinessUnits() {
    this.apiService
      .commonGetMethod('/api/admin/masters/business-unit', {})
      .subscribe({
        next: (res: any) => {
          if (res.status == true && res.status_code === 200) {
            let businessUnitRes = res.data?.data?.map((el: any) => ({
              ...el,
              id: el?.id?.toString(),
            }));
            this.store.dispatch(
              saveStoreData({
                key: SELECTOR.BUSINESS_UNITS,
                data: businessUnitRes,
              }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchCategories() {
    this.apiService
      .commonGetMethod('/api/admin/masters/category', {})
      .subscribe({
        next: (res: any) => {
          if (res.status == true && res.status_code == 200) {
            let list = res.data?.data?.map((el: any) => ({
              ...el,
              id: el?.id?.toString(),
            }));
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.CATEGORY, data: list }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.error);
        },
      });
  }

  fetchAssignUserList() {
    this.apiService
      .commonGetMethod(
        '/secure/ticket-management/api/fetch/assign/user/list',
        {},
      )
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            let users = res?.responseObject?.userData;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.ASSIGN_USERS, data: users }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchStatus() {
    this.apiService
      .commonGetMethod(
        '/secure/ticket-management/api/v1/fetch/ticket/status',
        {},
      )
      .subscribe({
        next: (res) => {
          if (res.status && res.statusCode === 200) {
            let statusList = res?.responseObject?.ticketStatus;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.STATUS, data: statusList }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchLocationDetails() {
    this.apiService
      .commonGetMethod('/secure/user-management/api/fetch/location', {})
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            const locationList = response.responseObject.locationDtos;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.LOCATION, data: locationList }),
            );
          } else {
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchAppConfig() {
    this.apiService
      .commonGetMethod(`/secure/ticket-management/api/v1/fetch/app/config`, {})
      .subscribe((response) => {
        if (response.status && response.statusCode == 200) {
          let appConfig = response?.responseObject.appConfigDetails;
          this.store.dispatch(
            saveStoreData({ key: SELECTOR.APP_CONFIG, data: appConfig }),
          );
        }
      });
  }
  fetchCreatedUserList() {
    this.apiService
      .commonGetMethod('/secure/user-management/api/v1/user/list', {})
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            let userList = res.responseObject.users;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.CREATED_USERS, data: userList }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchSeverity() {
    this.apiService
      .commonGetMethod(
        '/secure/ticket-management/api/fetch/ticket/severity',
        {},
      )
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            let severities = res?.responseObject?.severityData;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.SEVERITY, data: severities }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }
  fetchBins() {
    this.apiService
      .commonPostMethod('/secure/ticket-management/api/fetch/incident/bin', {
        businessUnitId: '',
      })
      .subscribe({
        next: (res: any) => {
          if (res.status == true && res.statusCode === 200) {
            let incidentBinRes = res.responseObject.incidentBinRes;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.BINS, data: incidentBinRes }),
            );
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }
}
