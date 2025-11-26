// Angular import
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UnsubscribeBase } from 'src/app/demo/unsubscribe-base';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { AuthService } from 'src/app/theme/shared/service/auth.service';
import { PusherService } from 'src/app/theme/shared/service/pusher.service';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TimeOrDatePipe } from "../../../../shared/pipes/time-converter.pipe";

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule, TimeOrDatePipe],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent extends UnsubscribeBase {
  @Input() userDetails: any = null;
  notificationList: any = [];
  notificationCount: number = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private pusherService: PusherService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.userDetails.user_type) {
      this.fetchNotificationList();
    }

    // this.pusherService.messagesChannel = this.pusherService.pusher.subscribe(`expense-related-activity.${this.userDetails?.id}`);
    // this.pusherService.messagesChannel.bind('pusher:subscription_succeeded', (message) => console.log('✅ Subscribed messages', message));
    // console.log('pusher initilize', this.pusherService.messagesChannel);
    // this.pusherService.messagesChannel.bind(
    //   'expense-related-activity',
    //   (data: any) => {
    //     // this.showToastr(data);
    //     //     this.fetchNotificationCount();
    //     console.log('📩 Received:', data);
    //   }
    // );
  }

  sendMessage() {
    const message: any = {
      id: 3,
      company_id: 1,
      agent_id: 1,
      title: 'New Expense Notification',
      msg: 'New Expense Add',
      employee_expense_id: 1,
      status: 'Active',
      created_by: 3,
      created_at: '2025-11-09T12:00:50.000000Z',
    };
    this.pusherService.send(message);
  }

  fetchNotificationList() {
    this.apiService
      .commonGetMethod('/api/admin/expense/notification/list', {
        pageNo: 0,
        limit: 10,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status === true && res.status_code === 200) {
            this.notificationList = res.data;
            // this.notificationCount = res.count || 0;
          } else {
            this.notificationList = [];
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  signout() {
    this.authService.logout();
  }
}
