import { Component, ElementRef, ViewChild } from '@angular/core';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-email-template',
  imports: [SharedModule, QuillModule],
  templateUrl: './email-template.html',
  styleUrl: './email-template.scss',
})
export class EmailTemplate extends UnsubscribeBase {
  @ViewChild('addModal') addModal: ElementRef;
  list: any[] = [];
  categoryForm: FormGroup;
  editingCategory;
  businessInfo: any;
  businessDetails: any;
  columns: any[] = [
    {
      key: 'title',
      label: 'Name',
    },
    {
      key: 'subject',
      label: 'Subject',
    },
    // {
    //   key: 'grp',
    //   label: 'GRP',
    // },
    {
      key: 'content',
      label: 'Content',
      format: 'html',
    },
    {
      key: 'created_at',
      label: 'Created At',
      format: 'timeOrDate',
    },
    {
      key: 'created_by',
      label: 'Created By',
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    // },
  ];
  actions: any[] = [
    // { type: 'View', label: 'View', icon: 'bi-eye' },
    { type: 'Edit', label: 'Edit', icon: 'bi-pencil' },
    { type: 'Delete', label: 'Delete', icon: 'bi-trash' },
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
  }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      title: ['', Validators.required],
      subject: ['', Validators.required],
      grp: ['', Validators.required],
      status: ['Active'],
      content: [''],
    });
    // this.store.select(getStoreData(SELECTOR.BUSINESS_UNITS)).subscribe(data => {
    //   this.businessDetails = data;
    // })
    this.fetchList();
  }

  fetchList() {
    this.apiService
      .commonGetMethod('/api/admin/admin-setting/email-templates', {
        show_row: this.params.limit,
        page: this.params.pageNo + 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.list = res.data;
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

  editModalOpen(category: any = null) {
    console.log(category, 'sdafdsf');

    const modelId = document.getElementById('addModal');
    modelId?.click();
    // this.addModal?.nativeElement?.click();

    this.editingCategory = category;
    this.categoryForm.patchValue({
      title: this.editingCategory?.title || '',
      subject: this.editingCategory?.subject || '',
      grp: this.editingCategory?.grp || '',
      status: this.editingCategory?.status || 'Active',
      content: this.editingCategory?.content || '',
    });
  }

  onSubmit(type: string) {
    if (this.categoryForm.valid) {
      const payload = {
        company_template_id:
          this.list[this.list?.length]?.company_template_id + 1,
        ...this.categoryForm.value,
      };

      const api =
        type === 'create'
          ? this.apiService.commonPostMethod(
              `/api/admin/admin-setting/email-templates`,
              payload,
            )
          : this.apiService.commonPutMethod(
              `/api/admin/admin-setting/email-templates/${this.editingCategory?.id}`,
              payload,
            );

      api.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.status == true && response.status_code == 200) {
            this.toastr.success(response.message);
            this.fetchList();
            this.categoryForm.reset();
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message);
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
              `/api/admin/admin-setting/email-templates/${category?.id}`,
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

  applyFilters(filters) {
    this.businessInfo.businessUnitId = filters.businessUnitId;
    this.categoryForm.patchValue({
      businessUnitId: filters.businessUnitId,
    });
    this.fetchList();
  }
}
