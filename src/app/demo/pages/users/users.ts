import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, takeUntil } from 'rxjs';
import { saveStoreData } from 'src/app/store/common/common.actions';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { FileUploadService } from 'src/app/theme/shared/service/file-upload.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { passwordMatchValidator } from 'src/app/theme/shared/_helpers/customValidator';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-users',
  imports: [SharedModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users extends UnsubscribeBase
{
  @ViewChild('addModal') addModal: ElementRef;
  columns: any[] = [
    { key: 'name', label: 'User Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile_number', label: 'Mobile No.' },
    {
      key: 'department_id',
      label: 'Department',
      pipe: (val:any) => this.businessList?.find((b) => b?.id == val)?.title || '',
    },
    {
      key: 'role_id',
      label: 'Role',
      pipe: (val:any) => this.roles?.find((b) => b?.id == val)?.title || '',
    },
    { key: 'user_type', label: 'Role Type' },
    { key: 'status', label: 'Status' },
    // { key: 'accountStatus', label: 'Account Status', format: 'switch', hasEditAccess: this.commonService.viewPage('User Settings', 'Users')?.allowEdit },
  ];

  userList: any[] = [];
  totalUsers: number = 0;
  params = {
    limit: 10,
    pageNo: 0,
  };
  editingUser;
  userForm: FormGroup;
  isUserFormSubmitted: boolean = false;
  roles: any[] = [];
  businessList: any[] = [];
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  formSections: any = [];
  customFieldData: any = [];
  linkedFields = [];
  businessDetails: any = [];
  organizations: any = [];
  selectedOrganization: any = {};
  showOrgTooltip: boolean = false;
  currentDate = new Date().toISOString().split('T')[0];

  actions: any[] = [
    { type: 'Edit', label: 'Edit User', icon: 'bi-pencil' },
    { type: 'Delete', label: 'Edit User', icon: 'bi-trash' },
  ];
  list: any = {};
  genderList = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private store: Store,
    public commonService: CommonService,
    private sweetAlertService: SweetAlertService,
    private fileUploadService: FileUploadService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        name: [null, Validators.required],
        mobile_number: [
          null,
          [Validators.pattern('^\\d{10}$'), Validators.required],
        ],
        email: [null, [Validators.email, Validators.required]],
        user_type: [null, Validators.required],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
        gender: [null, Validators.required],
        department_id: [null, Validators.required],
        role_id: [null, Validators.required],
        category_id: [null, Validators.required],
        status: ['Active', Validators.required],
        address: [null],
        // managerName: [null],
        dob: [null, Validators.required],

        // customFields: this.fb.array([]),
      },
      {
        validators: passwordMatchValidator, //custom validator to check if password and confirm password field are same
      }
    );
    // this.store
    //   .select(getStoreData(SELECTOR.CREATED_USERS))
    //   .subscribe((data) => {
    //     this.userList = data;
    //   });
    // this.fetchBusinessDetails();
    // this.fetchOrganisations();
    // this.fetchRoles();
    // this.fetchFormList();
    this.store.select(getStoreData(SELECTOR.ROLES)).subscribe((data) => {
      this.roles = data;
    });
    this.store.select(getStoreData(SELECTOR.DEPARTMENT)).subscribe((data) => {
      this.businessList = data;
    });
    this.fetchUserList();
    this.getData();
  }

  getData() {
    forkJoin({
      department: this.apiService.commonGetMethod(
        '/api/admin/masters/department',
        {}
      ),
      category: this.apiService.commonGetMethod(
        '/api/admin/masters/category',
        {}
      ),
      role: this.apiService.commonGetMethod('/api/admin/masters/role', {}),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.list.departmentList =
            res?.department?.status_code == 200
              ? res?.department?.data?.data
              : [];
          this.list.categoryList =
            res?.category?.status_code == 200 ? res?.category?.data?.data : [];
          this.list.roleList =
            res?.role?.status_code == 200 ? res?.role?.data?.data : [];
        },
        error: (err) => {
          this.list.assetTypeList = [];
          this.list.categoryList = [];
          this.list.roleList = [];
        },
      });
  }

  get f() {
    return this.userForm.controls;
  }

  get department(): FormControl {
    return this.userForm.get('department') as FormControl;
  }

  get organizationId(): FormControl {
    return this.userForm.get('organizationId') as FormControl;
  }

  get customFields(): FormArray {
    return this.userForm.get('customFields') as FormArray;
  }

  addCustomField(fields) {
    const customFieldGroup = this.fb.group({
      attributeSection: [fields.formSectionName],
      fieldId: [fields.fieldId],
      attributeKey: [fields.fieldName],
      attributeType: [fields.fieldType],
      attributeLabel: [fields.fieldName],
      attributeValue: ['', fields.required ? Validators.required : ''],
      helpText: [fields.helpText],
      required: [fields.required],
      options: [
        fields.options?.split(',').map((o) => {
          return { attribute_key: o, attribute_value: o };
        }),
      ],
    });
    this.customFields.push(customFieldGroup);
  }

  fetchUserList() {
    this.apiService
      .commonGetMethod('/api/admin/agent/list', {
        show_row: this.params.limit,
        page: this.params.pageNo + 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.status_code === 200) {
            this.userList = res.data.data;
            this.totalUsers = res.data.total;
            
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
    this.fetchUserList();
  }

  fetchAssignUserList() {
    this.apiService
      .commonGetMethod(
        '/secure/ticket-management/api/fetch/assign/user/list',
        {}
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            let users = res?.responseObject?.userData;
            this.store.dispatch(
              saveStoreData({ key: SELECTOR.ASSIGN_USERS, data: users })
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

  fetchRoles() {
    this.apiService
      .commonGetMethod('/secure/user-management/api/fetch/dropdown/roles', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            this.roles = res.responseObject.roles;
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  editModalOpen(user) {
    this.addModal.nativeElement.click();
    this.editingUser = user;
    this.isUserFormSubmitted = false;

    if (this.editingUser) {
      this.userForm.patchValue({
        name: user?.name,
        mobile_number: user?.mobile_number,
        email: user?.email,
        user_type: user?.user_type,
        gender: user?.gender,
        department_id: parseInt(user?.department_id),
        role_id: parseInt(user?.role_id),
        category_id: parseInt(user?.category_id),
        status: user?.status,
        address: user?.address,
        dob: user?.dob,
      });
      // this.userForm.get('mobile_number').disable();
      // this.userForm.get('email').disable();
      // this.userForm.get('personType').disable();
      // this.userForm.get('roleType').disable();
      // this.userForm.controls['password'].clearValidators();
      // this.selectOrg();
    } else {
      // this.userForm.get('mobile_number').enable();
      // this.userForm.get('email').enable();
      // this.userForm.get('user_type').enable();
      // this.userForm.controls['password'].addValidators([
      //   Validators.required,
      //   Validators.minLength(8),
      // ]);
      // this.selectedOrganization = {}
    }
    // this.userForm.controls['password'].updateValueAndValidity();
  }

  onSubmit(type:string) {
    this.isUserFormSubmitted = true;
    const newUser = {
      ...this.userForm.value,
      // customFields: this.customFields.value.map((val) => {
      //   return {
      //     attributeKey: val.attributeKey,
      //     attributeValue: val.attributeValue,
      //     formSectionName: val.attributeSection,
      //   };
      // }),
    };
    console.log(newUser,this.userForm);

    if (this.userForm.valid) {
      const api = type === 'create' ? this.apiService
        .commonPostMethod(`/api/admin/agent/store`, newUser) : this.apiService
        .commonPutMethod(
          `/api/admin/agent/update/${this.editingUser?.id}`,
          newUser
        );

      api
      // this.apiService
      //   .commonPostMethod(`/api/admin/agent/store`, newUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.status == true && res.status_code == 200) {
              this.toastr.success(res.message);
              this.fetchUserList();
              this.close();
              // this.fetchAssignUserList();
              this.userForm.reset();
              
              this.isUserFormSubmitted = false;
              this.customFields ? this.customFields?.clear() : "";
              // this.fetchFormList();
            } else {
              const error = Object.values(res.message)[0][0];
              this.toastr.error(error || 'Something wrong');
            }
          },
          error: (err) => {
            // this.toastr.error(err.error.message);
            const error = Object.values(err.error.message)[0][0];
            this.toastr.error(error || 'Something wrong');
          },
          complete: () => {
            this.userForm.reset();
          },
        });
    }
  }

  close(){
    const closeModalBtn = document.getElementById('closeModel');
    closeModalBtn?.click();
  }

  togglePasswordIcon() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordIcon() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
  mobileValidation(e) {
    if (e.target.value.toString().length > 9) {
      e.preventDefault();
    }
  }

  onDeleteUser(user: any) {
    this.sweetAlertService
      .showDeletePopUp(
        this.commonService.viewPage('User Settings', 'Users')?.allowEdit
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.apiService
            .commonDeleteMethod(
              `/api/admin/agent/delete/${user.id}`,
              {}
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                if (res.status == true && res.status_code === 200) {
                  this.toastr.success(res.message);
                  this.fetchUserList();
                } else {
                  this.toastr.error(res.message);
                }
              },
              error: (err) => {
                this.toastr.error(err.error.error);
              },
            });
        }
      });
  }

  fetchFormList() {
    this.apiService
      .commonGetMethod('/secure/ticket-management/api/fetch/forms', {
        formType: 'USER',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            const formList = res.responseObject.forms;
            const formId = formList.find((val) => val.default).formId;
            this.fetchCustomFields(formId);
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.error);
        },
      });
  }

  fetchCustomFields(selectedFormId: string) {
    let fieldInfo = {
      formId: selectedFormId,
    };

    this.apiService
      .commonPostMethod('/secure/ticket-management/api/form/fields', fieldInfo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            this.customFieldData = [];
            this.formSections = Object.keys(res.data);
            this.customFields ? this.customFields?.clear() : "";
            this.customFieldData = res.data;
            this.formSections.forEach((section) => {
              this.customFieldData[section]
                .sort((a, b) => a.fieldOrder - b.fieldOrder)
                .forEach((field) => {
                  field.defaultField ? '' : this.addCustomField(field);
                });
            });
          } else {
            this.customFieldData = [];
            this.customFields ? this.customFields?.clear() : "";
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.error);
        },
      });
  }

  onCheckboxChange(event: Event, i: number, option: string) {
    const customFieldGroup = this.userForm
      .get('customFields')
      .get(i.toString()) as FormGroup;
    const attributeValueControl = customFieldGroup.get(
      'attributeValue'
    ) as FormControl;

    let currentValue = attributeValueControl.value;
    const selectedValues = currentValue ? currentValue.split(',') : [];

    if ((event.target as HTMLInputElement).checked) {
      if (!selectedValues.includes(option)) {
        selectedValues.push(option);
      }
    } else {
      const index = selectedValues.indexOf(option);
      if (index > -1) {
        selectedValues.splice(index, 1);
      }
    }
    attributeValueControl.setValue(selectedValues.join(','));
  }

  onUploadAttachments(event, index, documentType: string): void {
    const customFieldGroup = this.userForm
      .get('customFields')
      .get(index.toString()) as FormGroup;
    const attributeValueControl = customFieldGroup.get(
      'attributeValue'
    ) as FormControl;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.fileUploadService
        .uploadFile(
          file,
          documentType,
          '/ticket-management/api/upload/document'
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (documentType === 'attachments') {
              attributeValueControl.patchValue(
                response?.responseObject?.documentUrl
              );
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

  fetchBusinessDetails() {
    this.store
      .select(getStoreData(SELECTOR.BUSINESS_UNITS))
      .subscribe((data) => {
        this.businessDetails = data;
      });
  }
  fetchOrganisations() {
    this.apiService
      .commonGetMethod(
        '/secure/user-management/api/fetch/organization/details',
        {}
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.organizations = response.responseObject.organizations;
          } else {
            this.organizations = [];
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  selectOrg() {
    this.selectedOrganization = this.organizations.find(
      (org) => org.organizationId == this.userForm.value.organizationId
    );
  }

  toggleAccountStatus(user) {
    this.userForm.patchValue({
      ...user,
    });
    const { customFields, ...updatedUser } = this.userForm.value;
    const payload = {
      ...updatedUser,
      mobileNo: this.userForm.get('mobileNo')?.value,
      email: this.userForm.get('email')?.value,
      personType: this.userForm.get('personType')?.value,
      roleType: this.userForm.get('roleType')?.value,
      accountStatus: user.accountStatus == true ? 'In-active' : 'Active',
    };
    this.apiService
      .commonPutMethod(
        `/secure/user-management/api/v1/update/user/profile/${user.personId}`,
        payload
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode == 200) {
            this.toastr.success(res.message);
            this.fetchUserList();
            this.fetchAssignUserList();
            this.isUserFormSubmitted = false;
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
        complete: () => {
          this.userForm.reset();
        },
      });
  }
}
