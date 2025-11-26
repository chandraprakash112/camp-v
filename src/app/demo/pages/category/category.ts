import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { Filters } from 'src/app/theme/shared/components/filters/filters';

@Component({
  selector: 'app-category',
  imports: [SharedModule, Filters],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category extends UnsubscribeBase {
  @ViewChild('addModal') addModal: ElementRef;
  categoryList: any[] = [];
  categoryForm: FormGroup;
  editingCategory;
  businessInfo: any;
  businessDetails: any;
  roles: any[] = [];
  columns: any[] = [
    {
      key: 'title',
      label: 'Name',
    },
    {
      key: 'role_id',
      label: 'Role',
      pipe: (val: any) => this.roles?.find((b) => b?.id == val)?.title || '',
    },
    {
      key: 'show_on',
      label: 'Show On',
      // format: 'both',
      // listIdentifier: 'Both',
    },
    {
      key: 'created_at',
      label: 'Created On',
      format: 'date',
    },
  ];
  actions: any[] = [
    { type: 'View', label: 'View Subcategory', icon: 'bi-eye' },
    { type: 'Edit', label: 'Edit Category', icon: 'bi-pencil' },
    { type: 'Delete', label: 'Delete Category', icon: 'bi-trash' },
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
    // Getting business info if user came from business list page, else redirecting to business list page
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation?.extras?.state) {
    //   this.businessInfo = navigation?.extras?.state['business'];
    // } else {
    //   this.businessInfo = {
    //     businessUnitId: null
    //   }
    // }
    this.store.select(getStoreData(SELECTOR.ROLES)).subscribe((data) => {
      this.roles = data;
    });
  }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      // department_id: [this.businessInfo?.businessUnitId || null, Validators.required],
      role_id: [null, Validators.required],
      title: [null, Validators.required],
      show_on: ['Both', Validators.required],
      status: ['Active'],
    });
    // this.store.select(getStoreData(SELECTOR.BUSINESS_UNITS)).subscribe(data => {
    //   this.businessDetails = data;
    // })
    this.fetchList();
    this.fetchBusinessList();
  }

  fetchList() {
    this.apiService
      .commonGetMethod('/api/admin/masters/category', {
        show_row: this.params.limit,
        page: this.params.pageNo + 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.categoryList = res.data.data;
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

  fetchBusinessList() {
    this.apiService
      .commonGetMethod('/api/admin/masters/role', {
        show_row: 10,
        page: 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.businessDetails = res.data.data;
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  editModalOpen(category) {
    this.addModal.nativeElement.click();
    this.editingCategory = category;
    if (this.editingCategory) {
      this.categoryForm.patchValue({
        role_id: parseInt(this.editingCategory?.role_id),
        title: category?.title,
        show_on: category?.show_on || 'Both',
        status: category?.status || 'Active',
      });
      // this.categoryForm.get('businessUnitId').disable();
    } else {
      // this.categoryForm.get('businessUnitId').enable();
    }
  }

  onCategoryCreation(type: string) {
    if (this.categoryForm.valid) {
      const newCategory = { ...this.categoryForm.value };

      const api =
        type === 'create'
          ? this.apiService.commonPostMethod(
              `/api/admin/masters/category`,
              newCategory,
            )
          : this.apiService.commonPutMethod(
              `/api/admin/masters/category/${this.editingCategory?.id}`,
              newCategory,
            );

      api.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.status == true && response.status_code == 200) {
            this.toastr.success(response.message);
            this.fetchList();
            this.categoryForm.reset();
          } else {
            // this.toastr.error(response.message);
            const error = Object.values(response.errors)[0][0];
            this.toastr.error(error || 'Something wrong');
          }
        },
        error: (err) => {
          // this.toastr.error(err.error.message);
          const error = Object.values(err.error.errors)[0][0];
          this.toastr.error(error || 'Something wrong');
        },
      });
    }
  }

  deleteCategory(category: any) {
    this.sweetAlertService
      .showDeletePopUp(
        this.commonService.viewPage('Masters', 'Category')?.allowEdit,
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.apiService
            .commonDeleteMethod(
              `/api/admin/masters/category/${category?.id}`,
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

  applyFilter(filter) {
    // this.filters.fromDate = filter.fromDate;
    // this.filters.toDate = filter.toDate;
    // this.fetchNotificationList();
  }

  applyFilters(filters) {
    this.businessInfo.businessUnitId = filters.businessUnitId;
    this.categoryForm.patchValue({
      businessUnitId: filters.businessUnitId,
    });
    this.fetchList();
  }

  viewSubCategory(category: any) {
    this.router.navigate(['/admin/subcategory-list'], { state: { category } });
  }
}
