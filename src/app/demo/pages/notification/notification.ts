import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TimeOrDatePipe } from 'src/app/theme/shared/pipes/time-converter.pipe';

@Component({
  selector: 'app-notification',
  imports: [SharedModule, TimeOrDatePipe],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification extends UnsubscribeBase {
  notificationList = [];
  filters = {
    fromDate: null,
    toDate: null,
    limit: 10,
    pageNo: 0,
  };
  loadMore:boolean = false;
  totalElements: number = 0;
  columns: any[] = [
    { key: 'title', label: 'Title' },
    { key: 'msg', label: 'Remarks' },
    { key: 'created_at', label: 'Create At', format: 'datetime' },
    { key: 'status', label: 'Status' },
  ];

  actions: any[] = [{ type: 'Delete', label: 'Delete', icon: 'bi-trash' }];

  constructor(
    private apiService: ApiService,
    private sweetAlertService: SweetAlertService,
    private toastr: ToastrService,
    public commonService: CommonService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetchNotificationList();
  }

  fetchNotificationList(type: string = '') {
    type == 'scroll' ? this.loadMore = true : "";
    this.apiService
      .commonGetMethod('/api/admin/expense/notification/list', this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status === true && res.status_code === 200) {
            this.notificationList =
              type == 'scroll'
                ? this.notificationList.concat(res?.data)
                : res.data;

            this.totalElements = res.count || 0;
          } else {
            this.notificationList = [];
            this.totalElements = 0;
          }
          this.loadMore = false;
        },
        error: (err) => {
          this.notificationList = [];
          this.totalElements = 0;
          this.loadMore = false;
        },
      });
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
              `/api/admin/expense/notification/list/${category?.id}`,
              {},
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                if (res.status == true && res.status_code == 200) {
                  this.toastr.success(res.message);
                  this.fetchNotificationList();
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
    this.filters.fromDate = filter.fromDate;
    this.filters.toDate = filter.toDate;
    this.fetchNotificationList();
  }

  updatePagination(event) {
    this.filters.limit = event.pageSize || this.filters?.limit;
    this.filters.pageNo = event.currentPage;
    this.fetchNotificationList('scroll');
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
