import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { Store } from '@ngrx/store';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-department',
  imports: [SharedModule],
  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class Department extends UnsubscribeBase {
  @ViewChild('addModal') addModal: ElementRef;
  businessList: any[] = [];
  businessUnitsList: any[] = [];
  editingBusiness;
  businessForm: FormGroup;
  actions: any[] = [
    // { type: 'View', label: 'Configure Bin', icon: 'bi-gear' },
    { type: 'Edit', label: 'Edit', icon: 'bi-pencil' },
    { type: 'Delete', label: 'Delete', icon: 'bi-trash' },
  ];
  columns: any[] = [
    {
      key: 'title',
      label: 'Department',
    },
    // {
    //   key: 'divisionDtls',
    //   label: 'Divisions',
    //   format: 'list',
    //   listIdentifier: 'divisionName'
    // },
    {
      key: 'business_units',
      label: 'Organization',
      listIdentifier: 'title',
    },
    {
      key: 'created_at',
      label: 'Created On',
      format: 'timeOrDate',
    },
  ];
  params = {
    limit: 10,
    pageNo: 0,
  };

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private sweetAlertService: SweetAlertService,
    private store: Store,
    public commonService: CommonService,
  ) {
    super();
    this.businessForm = this.fb.group({
      businessUnit_id: [''],
      title: [''],
      // status: ['Active'],
    });
  }

  ngOnInit(): void {
    //Fetching already stored Departments from common store
    // this.store.select(getStoreData(SELECTOR.DEPARTMENT)).subscribe(data => {
    //   this.businessList = data;
    // })
    this.fetchList();
    this.fetchBusinessUnitsDetails();
  }

  fetchList() {
    this.apiService
      .commonGetMethod('/api/admin/masters/department', {
        show_row: this.params.limit,
        page: this.params.pageNo + 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.businessList = res.data.data;
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

  fetchBusinessUnitsDetails() {
    this.apiService
      .commonGetMethod('/api/admin/masters/business-unit', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.status_code == 200) {
            this.businessUnitsList = response.data?.data;
          } else {
            this.businessUnitsList = [];
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  onSubmit(type: string) {
    const payload = { ...this.businessForm.value, status: 'active' };
    console.log(payload);

    if (this.businessForm.valid) {
      const api =
        type === 'create'
          ? this.apiService.commonPostMethod(
              `/api/admin/masters/department`,
              payload,
            )
          : this.apiService.commonPutMethod(
              `/api/admin/masters/department/${this.editingBusiness?.id}`,
              payload,
            );

      api.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res.status == true && res.status_code == 200) {
            this.toastr.success(res.message);
            this.fetchList();
            this.businessForm.reset();
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
      });
    }
  }

  editModalOpen(business: any) {
    const modelId = document.getElementById('addModal');
    modelId?.click();
    // this.addModal?.nativeElement?.click();

    this.editingBusiness = business;
    this.businessForm.patchValue({
      ...this.businessForm.value,
      businessUnit_id: this.editingBusiness?.businessUnit_id,
      title: this.editingBusiness?.title,
    });
  }

  deleteBusiness(business: any) {
    this.sweetAlertService
      .showDeletePopUp(
        this.commonService.viewPage('Masters', 'Department')?.allowEdit,
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.apiService
            .commonDeleteMethod(
              `/api/admin/masters/department/${business?.id}`,
              {},
            )
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

  viewBin(business: any) {
    // this.router.navigate(['/admin/bin'], { state: { business } });
  }
}
