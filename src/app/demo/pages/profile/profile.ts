import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { saveStoreData } from 'src/app/store/common/common.actions';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { passwordMatchValidator } from 'src/app/theme/shared/_helpers/customValidator';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { FileUploadService } from 'src/app/theme/shared/service/file-upload.service';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [SharedModule,RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile extends UnsubscribeBase {
  profileDetails: any;
  profileAdditionalDetails: [];
  roles: any[] = [];
  userForm: FormGroup;
  passwordForm: FormGroup;
  isPasswordFormSubmitted: boolean = false;
  isUserFormSubmitted: boolean = false;
  isOldPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  sections: any = [];
  personalInfo: any = {};
  accountInfo: any = {};
  additionalInfo: any = {};
  userId = '';
  navigationItems:any[] = [
    {
      title: 'Profile',
      type: 'item',
      classes: 'nav-item',
      url: '/prfile',
      icon: 'bi bi-columns-gap',
    },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService,
    private store: Store,
    private fileUploadService: FileUploadService,
    public commonService: CommonService,
  ) {
    super();
    const user = this.commonService.getLocalStorageData('userDetails');
    this.userId = user?.id;
    this.userForm = this._formBuilder.group({
      id: [],
      role_id: [],
      department_id: [],
      category_id: [],
      name: ['', Validators.required],
      mobile_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user_type: ['', Validators.required],
      dob: [''],
      doj: [''],
      // organizationName: [''],
      status: [''],
      profileUrl: [''],
      addressLine1: [''],
      addressLine2: [''],
      country: [''],
      state: [''],
      city: [''],
      zip: [''],
    });
    this.passwordForm = this._formBuilder.group(
      {
        oldPassword: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: passwordMatchValidator, //custom validator to check if password and confirm password field are same
      },
    );
  }

  ngOnInit(): void {
    this.fetchProfile();
    this.store.select(getStoreData(SELECTOR.ROLES)).subscribe((data) => {
      this.roles = data;
    });
  }

  fetchProfile() {
    this.apiService
      .commonGetMethod(`/api/admin/agent/view/${this.userId}`, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.profileDetails = res.data;
            this.store.dispatch(
              saveStoreData({
                key: SELECTOR.PROFILE,
                data: this.profileDetails,
              }),
            );

            // let response = res.responseObject.dataHelper;
            // this.personalInfo = response.responseMap['Personal Information'];
            // this.accountInfo = response.responseMap['Account Information'];
            // this.additionalInfo = response.responseMap['Additional Information'];

            // this.sections = [];
            // Object.keys(response.responseMap).forEach((key) => {
            //   if (key !== 'Custom Fields') {
            //     this.sections.push({
            //       sectionName: key,
            //       sectionData: []
            //     });
            //   }
            // });
            // const customFields = response.responseMap['Custom Fields'] || [];
            // customFields.forEach((field) => {
            //   const existingSection = this.sections.find(section => section.sectionName === field.sectionName);
            //   if (existingSection) {
            //     existingSection.sectionData.push(field);
            //   } else {
            //     this.sections.push({
            //       sectionName: field.sectionName,
            //       sectionData: [field]
            //     });
            //   }
            // });

            this.userForm.patchValue({
              role_id: this.profileDetails?.role_id,
              department_id: this.profileDetails?.department_id,
              category_id: this.profileDetails?.category_id,
              name: this.profileDetails?.name,
              mobile_number: this.profileDetails?.mobile_number,
              email: this.profileDetails?.email,
              user_type: this.profileDetails?.user_type,
              dob: this.profileDetails?.dob,
              status: this.profileDetails?.status,
              profileUrl: this.profileDetails?.profileUrl,
              addressLine1: this.profileDetails?.addressLine1,
              addressLine2: this.profileDetails?.addressLine2,
              country: this.profileDetails?.country,
              state: this.profileDetails?.state,
              city: this.profileDetails?.city,
              zip: this.profileDetails?.zip,
              // ...this.profileDetails,
              // ...this.personalInfo,
              // ...this.accountInfo,
              // ...this.additionalInfo
            });
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  onUpdateUser() {
    const updatedUser = this.userForm.value;
    this.apiService
      .commonPutMethod(`/api/admin/agent/update/${this.userId}`, updatedUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code == 200) {
            this.toastr.success(res.message);
            this.fetchProfile();
          } else {
            this.errorTostr(res);
          }
        },
        error: (err) => {
          // this.toastr.error(err.error.message);
          this.errorTostr(err.error);
        },
      });
  }

  errorTostr(error: any) {
    const msg = Object.values(error.message)[0][0];
    this.toastr.error(msg || 'Something wrong');
  }

  changePassword() {
    this.isPasswordFormSubmitted = true;
    const updatedPassword = {
      ...this.profileDetails,
      oldPassword: this.passwordForm.value.oldPassword,
      password: this.passwordForm.value.password,
    };
    if (this.passwordForm.valid) {
      this.apiService
        .commonPutMethod(
          `/api/admin/agent/update/${this.userId}`,
          updatedPassword,
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.status == true && res.status_code == 200) {
              this.toastr.success(res.message);
            } else {
              this.toastr.error(res.message);
              this.errorTostr(res);
            }
          },
          error: (err) => {
            // this.toastr.error(err.error.message);
            this.errorTostr(err.error);
          },
        });
    }
  }

  updateProfilePic() {
    document.getElementById('profilePicInputBtn').click();
  }

  onUploadProfilePic(event, documentType: string): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.fileUploadService
        .uploadFile(
          file,
          documentType,
          '/user-management/api/v1/change/profile',
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (documentType === 'profile_pic') {
              this.userForm.patchValue({
                ...this.userForm.value,
                profileUrl: response?.responseObject?.documentUrl,
              });
              this.fetchProfile();
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

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'oldPassword':
        this.isOldPasswordVisible = !this.isOldPasswordVisible;
        break;
      case 'newPassword':
        this.isNewPasswordVisible = !this.isNewPasswordVisible;
        break;
      case 'confirmPassword':
        this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
        break;
    }
  }

  viewAttachment(url: string) {
    window.open(url, '_blank');
  }
}

