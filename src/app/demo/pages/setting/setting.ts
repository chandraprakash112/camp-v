import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { saveStoreData } from 'src/app/store/common/common.actions';
import { SELECTOR } from 'src/app/store/common/common.selectors';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { AuthService } from 'src/app/theme/shared/service/auth.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { FileUploadService } from 'src/app/theme/shared/service/file-upload.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { UnsubscribeBase } from '../../unsubscribe-base';

@Component({
  selector: 'app-setting',
  imports: [SharedModule],
  templateUrl: './setting.html',
  styleUrl: './setting.scss',
})
export class Setting extends UnsubscribeBase {
  currentConfigStatus: boolean;
  stepsTitle: string[] = [
    'email',
    'notification',
  ];
  currentStep: number = 1;
  dateFormats = [
    {
      value: 'YYYY-MM-DD',
      title: '(YYYY-MM-DD)',
      example: '2024-03-07',
    },
    {
      value: 'YYYY.MM.DD',
      title: '(YYYY.MM.DD)',
      example: '2024.03.07',
    },
    {
      value: 'YYYY/MM/DD',
      title: '(YYYY/MM/DD)',
      example: '2024/03/07',
    },
    {
      value: 'DD/MM/YYYY',
      title: '(DD/MM/YYYY)',
      example: '07/03/2024',
    },
    {
      value: 'DD-MM-YYYY',
      title: '(DD-MM-YYYY)',
      example: '07-03-2024',
    },
    {
      value: 'DD-MMM-YYYY',
      title: '(DD-MMM-YYYY)',
      example: '07-Mar-2024',
    },
    {
      value: 'MMM DD, YYYY',
      title: '(MMM DD, YYYY)',
      example: 'Mar 07, 2024',
    },
    {
      value: 'MMMM DD, YYYY',
      title: '(MMMM DD, YYYY)',
      example: 'March 07, 2024',
    },
  ];

  timeFormats = [
    {
      value: 'HH:mm:ss',
      title: '24H (HH:MM:SS)',
      example: '18:20:30',
    },
    {
      value: 'HH:mm',
      title: '24H (HH:MM)',
      example: '18:20',
    },
    {
      value: 'hh:mm:ss A',
      title: '12H (HH:MM:SS PM)',
      example: '06:20:30 PM',
    },
    {
      value: 'hh:mm A',
      title: '12H (HH:MM PM)',
      example: '06:20 PM',
    },
  ];

  generalFormGroup: FormGroup;
  isGeneralFormSubmitted: boolean = false;
  emailFormGroup: FormGroup;
  isEmailFormSubmitted: boolean = false;
  ticketFormGroup: FormGroup;
  isTicketFormSubmitted: boolean = false;
  notificationFormGroup: FormGroup;
  isNotificationFormSubmitted: boolean = false;

  appConfigData: any;
  logoUrl: string;
  userProfile;
  statusData: any;
  selectedStatuses: any;
  expenseNotifyArray: any[] = [
    { label: 'Bill Notification', control: 'reminderEmailN' },
    { label: 'Agreement Notification', control: 'agreement_notification' },
    { label: 'License Notification', control: 'license_notification' },
    { label: 'Employee Notification', control: 'employee_notification' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private store: Store,
    private fileUploadService: FileUploadService,
    private sweetAlertService: SweetAlertService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentConfigStatus =
      this.commonService.getLocalStorageData('configStatus');

    this.generalFormGroup = this._formBuilder.group({
      appName: [null],
      email: ['', [Validators.email]],
      logoUrl: [null],
      dateFormat: ['YYYY-MM-DD'],
      timeFormat: ['HH:mm:ss'],
      mainColor: ['#ffffff'],
      headerColor: ['#ffffff'],
    });

    this.emailFormGroup = this._formBuilder.group({
      outEmailName: [null],
      outEmailFrom: [null],
      outReplyToEmail: [null],
      outMailByDriverType: [false],
      smtpHost: [null],
      smtpPort: [null],
      smtpSecureType: [null],
      smtpUserName: [null],
      smtpUserPassword: [null],
    });

    this.ticketFormGroup = this._formBuilder.group({
      enableHtmlInput: [true],
      enableAutoClose: [false],
      interval: [0],
      intervalUnit: ['hrs'],
      autoCloserStatus: [''],
      closingMessage: [null],
      ticketPrefix: [null],
      userReopen: [true],
      reopenTime: [0],
      reopenTimeUnit: ['hrs'],
    });

    this.notificationFormGroup = this._formBuilder.group({
      reminderEmailN: [false],
      expensePushN: [false],
      agreement_notification: [false],
      license_notification: [false],
      employee_notification: [false],
    });
    // this.store.select(getStoreData(SELECTOR.STATUS)).subscribe((data) => {
    //   this.statusData =
    //     data
    //       ?.filter((val) => val.active)
    //       .map((status) => {
    //         return {
    //           itemId: status.statusId,
    //           itemName: status.statusName,
    //         };
    //       }) || [];
    //   if (this.appConfigData?.autoCloserStatus) {
    //     this.selectedStatuses = this.appConfigData?.autoCloserStatus
    //       ?.split(',')
    //       .map((val) => {
    //         return {
    //           itemId: val,
    //           itemName: this.statusData.find((obj) => obj.itemId == val)
    //             .itemName,
    //         };
    //       });
    //   }
    // });
    // this.store.select(getStoreData(SELECTOR.PROFILE)).subscribe((data) => {
    //   if (data) {
    //     this.userProfile = data;
    //     this.generalFormGroup.patchValue({
    //       email: this.userProfile.email,
    //     });
    //   }
    // });
    // this.store.select(getStoreData(SELECTOR.APP_CONFIG)).subscribe((data) => {
    //   if (data) {
    //     this.appConfigData = data;
    //     this.updateFormGroups();
    //   }
    // });
    this.fetchList();
  }

  fetchList() {
    this.apiService
      .commonGetMethod('/api/admin/admin-setting/app-setting', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.appConfigData = res.data?.[0];

            this.updateFormGroups();
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  onStatusesSelected(selectedList: any) {
    this.selectedStatuses = selectedList;
    this.ticketFormGroup.patchValue({
      ...this.ticketFormGroup.value,
      autoCloserStatus: this.selectedStatuses
        .map((val) => {
          return val['itemId'];
        })
        .join(','),
    });
  }

  nextStep() {
    this.isFormSubmitted();
    if (this.isFormValid()) {
      this.saveAppConfig();
      // this.currentStep++;
      // window.scrollTo(0, 0);
      // } else if (
      //   // this.currentStep === this.stepsTitle.length &&
      //   this.isFormValid()
      // ) {
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  isFormSubmitted(): void {
    this[
      `is${
        this.stepsTitle[this.currentStep - 1].charAt(0).toUpperCase() +
        this.stepsTitle[this.currentStep - 1].slice(1)
      }FormSubmitted`
    ] = true;
  }

  isFormValid(): boolean {
    return this[`${this.stepsTitle[this.currentStep - 1]}FormGroup`].valid;
  }

  openFileInput() {
    document.getElementById('appLogoInput').click();
  }

  viewImage() {
    Swal.fire({
      imageUrl: this.generalFormGroup.value.logoUrl,
      showConfirmButton: false,
      showCloseButton: true,
      // confirmButtonText: 'Save'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveAppConfig();
      }
    });
  }

  //   getImageDetails(url:string) {
  //     return {
  //         name: url.slice(url.lastIndexOf('/')+1),
  //         type: url.slice(url.lastIndexOf('.')+1)
  //     }
  // }

  onUploadAppLogo(event, documentType: string): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.fileUploadService
        .uploadFile(
          file,
          documentType,
          '/ticket-management/api/upload/document',
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (documentType === 'app_logo') {
              this.generalFormGroup.patchValue({
                ...this.generalFormGroup.value,
                logoUrl: response?.responseObject?.documentUrl,
              });
            }

            if (this.isNotificationFormSubmitted) {
              this.saveAppConfig();
            }
          },
          error: (error) => {
            console.error('File upload error', error);
          },
        });
    } else {
      this.toastr.warning('Please select a file to upload.');
    }
  }

  onDeleteAppLogo(fileInput): void {
    this.sweetAlertService
      .showDeletePopUp(
        this.commonService.viewPage('Admin Settings', 'App Settings')
          ?.allowEdit,
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.fileUploadService
            .deleteFile(
              this.generalFormGroup.value.logoUrl,
              '/ticket-management/api/delete/document',
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.generalFormGroup.patchValue({
                  ...this.generalFormGroup.value,
                  logoUrl: '',
                });
                fileInput.value = '';
                this.saveAppConfig();
              },
              error: (error) => {
                console.error('Delete failed', error);
              },
            });
        }
      });
  }

  saveAppConfig() {
    this.isGeneralFormSubmitted = true;
    if (this.generalFormGroup.valid) {
      let configDetails = {
        // ...this.generalFormGroup.value,
        ...this.emailFormGroup.value,
        // ...this.ticketFormGroup.value,
        // ...this.notificationFormGroup.value,
        expensePushN: this.notificationFormGroup.value?.expensePushN
          ? 'on'
          : 'off',
        reminderEmailN: this.notificationFormGroup.value?.reminderEmailN
          ? 'on'
          : 'off',
        company_id: 1,
      };
      console.log(configDetails);

      this.apiService
        .commonPostMethod(
          '/api/admin/admin-setting/app-setting/createOrUpdate',
          configDetails,
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status && response.status_code == 200) {
              // this.fetchAppConfig();
              this.toastr.success(response.message);
              if (
                this.currentConfigStatus != true &&
                this.currentStep == this.stepsTitle.length
              ) {
                this.authService.setConfigStatus(true);
                this.currentConfigStatus = true;
                this.router.navigate(['/admin/dashboard']);
              } else if (
                this.currentConfigStatus != true &&
                this.currentStep != this.stepsTitle.length
              ) {
                this.currentStep++;
              }
            } else {
              this.toastr.error(response?.message);
            }
          },
          error: (err) => {
            this.toastr.error(err.error.message);
          },
        });
    } else {
      this.currentStep = 1;
    }
  }

  fetchAppConfig() {
    this.apiService
      .commonGetMethod(`/secure/ticket-management/api/v1/fetch/app/config`, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.status && response.statusCode == 200) {
          this.appConfigData = response?.responseObject.appConfigDetails;
          this.store.dispatch(
            saveStoreData({
              key: SELECTOR.APP_CONFIG,
              data: this.appConfigData,
            }),
          );
          this.updateFormGroups();
        }
      });
  }

  updateFormGroups() {
    this.generalFormGroup.patchValue({
      appName: this.appConfigData.appName,
      email: this.appConfigData.email,
      logoUrl: this.appConfigData.logoUrl,
      dateFormat: this.appConfigData.dateFormat,
      timeFormat: this.appConfigData.timeFormat,
      mainColor: this.appConfigData.mainColor,
      headerColor: this.appConfigData.headerColor,
    });
    this.emailFormGroup.patchValue({
      outEmailName: this.appConfigData.outEmailName,
      outEmailFrom: this.appConfigData.outEmailFrom,
      outReplyToEmail: this.appConfigData.outReplyToEmail,
      outMailByDriverType: this.appConfigData.outMailByDriverType,
      smtpHost: this.appConfigData.smtpHost,
      smtpPort: this.appConfigData.smtpPort,
      smtpSecureType: this.appConfigData.smtpSecureType,
      smtpUserName: this.appConfigData.smtpUserName,
      smtpUserPassword: this.appConfigData.smtpUserPassword,
    });
    this.ticketFormGroup.patchValue({
      enableHtmlInput: this.appConfigData.enableHtmlInput,
      enableAutoClose: this.appConfigData.enableAutoClose,
      interval: this.appConfigData.interval ?? 0,
      intervalUnit: this.appConfigData.intervalUnit || 'hrs',
      autoCloserStatus: this.appConfigData.autoCloserStatus,
      closingMessage: this.appConfigData.closingMessage,
      ticketPrefix: this.appConfigData.ticketPrefix,
      userReopen: this.appConfigData.userReopen,
      reopenTime: this.appConfigData.reopenTime ?? 0,
      reopenTimeUnit: this.appConfigData.reopenTimeUnit || 'hrs',
    });
    if (this.appConfigData?.autoCloserStatus) {
      this.selectedStatuses = this.appConfigData.autoCloserStatus
        ?.split(',')
        .map((val) => {
          return {
            itemId: val,
            itemName: val,
          };
        });
    } else {
      this.selectedStatuses = [];
    }
    this.notificationFormGroup.patchValue({
      reminderEmailN:
        this.appConfigData.reminderEmailN?.toLowerCase() == 'on' ? true : false,
      expensePushN:
        this.appConfigData.expensePushN?.toLowerCase() == 'on' ? true : false,
      // emailTriggerOnTicketReopen: this.appConfigData.emailTriggerOnTicketReopen,
      // emailTriggerOnTicketClosed: this.appConfigData.emailTriggerOnTicketClosed,
      // pushTriggerOnTicketReopen: this.appConfigData.pushTriggerOnTicketReopen,
      // pushTriggerOnTicketClosed: this.appConfigData.pushTriggerOnTicketClosed,
    });
  }
}
