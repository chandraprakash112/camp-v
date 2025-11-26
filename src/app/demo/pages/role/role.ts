import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataLoaderService } from 'src/app/theme/shared/service/data-loader.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-role',
  imports: [SharedModule],
  templateUrl: './role.html',
  styleUrl: './role.scss',
})
export class Role extends UnsubscribeBase {
  @ViewChild('addModal') addModal: ElementRef;
  roleList: any[] = [];
  businessList: any[] = [];
  tableColumns: any[] = [
    {
      key: 'title',
      label: 'Name',
    },
    {
      key: 'department_id',
      label: 'Department',
      pipe: (val: any) =>
        this.businessList?.find((b) => b?.id == val)?.title || '',
    },
  ];
  actions: any[] = [
    { type: 'Edit', label: 'Edit Role Access', icon: 'bi-pencil' },
    { type: 'Delete', label: 'Delete Role', icon: 'bi-trash' },
  ];
  rolesForm: FormGroup;
  editingRole;
  selectedBusinessUnitIds = [];
  params = {
    limit: 10,
    pageNo: 0,
  };

  constructor(
    private store: Store,
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private sweetAlertService: SweetAlertService,
    private dataLoaderService: DataLoaderService,
    public commonService: CommonService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.rolesForm = this._formBuilder.group({
      department_id: [''],
      title: ['', Validators.required],
    });
    this.store?.select(getStoreData(SELECTOR.DEPARTMENT))?.subscribe((data) => {
      this.businessList = data;
    });
    this.fetchList();
    // this.fetchBusinessUnits();
  }

  fetchList() {
    this.apiService
      .commonGetMethod('/api/admin/masters/role', {
        show_row: this.params.limit,
        page: this.params.pageNo + 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.roleList = res.data.data;
            this.dataLoaderService.fetchPersona();

            // this.store.dispatch(
            //   saveStoreData({
            //     key: SELECTOR.CREATED_USERS,
            //     data: this.userList,
            //   })
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
  updatePagination(event) {
    this.params.limit = event.pageSize;
    this.params.pageNo = event.currentPage;
    this.fetchList();
  }

  // fetchBusinessUnits() {
  //   this.apiService
  //     .commonGetMethod('/api/admin/masters/department', {})
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res) => {
  //         if (res.status == true && res.status_code === 200) {
  //           this.businessList = res.data.data;
  //         } else {
  //           console.error(res.message);
  //         }
  //       },
  //       error: (err) => {
  //         console.error(err.error.message);
  //       },
  //     });
  // }

  onBUChange(selectedItems: []) {
    // this.selectedBusinessUnitIds = selectedItems;
  }

  // fetchRoles() {
  //   this.store.select(getStoreData(SELECTOR.ROLES)).subscribe((data) => {
  //     this.roleList = data;
  //   });
  // }

  editModalOpen(role) {
    const modelId = document.getElementById('addModal');
    modelId?.click();
    // this.addModal?.nativeElement?.click();

    this.editingRole = role;
    this.rolesForm.patchValue({
      ...this.rolesForm.value,
      department_id: parseInt(this.editingRole?.department_id),
      title: this.editingRole?.title,
    });
  }

  onRoleCreation(type: string) {
    const payload = {
      ...this.rolesForm.value,
      assign_rule: '0',
    };

    if (this.rolesForm.valid) {
      const api =
        type === 'create'
          ? this.apiService.commonPostMethod(`/api/admin/masters/role`, payload)
          : this.apiService.commonPutMethod(
              `/api/admin/masters/role/${this.editingRole?.id}`,
              payload,
            );

      api.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res.status == true && res.status_code == 200) {
            this.toastr.success(res.message);
            this.fetchList();
            // this.selectedBusinessUnitIds = [];
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
        complete: () => {
          this.rolesForm.reset();
        },
      });
    }
  }

  onDeleteRole(role: any) {
    this.sweetAlertService
      .showDeletePopUp(
        this.commonService.viewPage('User Settings', 'Roles')?.allowEdit,
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.apiService
            .commonDeleteMethod(`/api/admin/masters/role/${role?.id}`, {})
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                if (res.status == true && res.status_code == 200) {
                  this.toastr.success(res.message);
                  this.fetchList();
                } else {
                  this.toastr.error(res.message);
                }
              },
              error: (err) => {
                this.toastr.error(err.error.message);
              },
            });
        }
      });
  }
}
