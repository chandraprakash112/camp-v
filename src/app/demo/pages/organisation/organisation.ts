import { Component, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SweetAlertService } from 'src/app/theme/shared/service/sweet-alert.service';
import { UnsubscribeBase } from '../../unsubscribe-base';

@Component({
  selector: 'app-organisation',
  imports: [SharedModule, QuillModule],
  templateUrl: './organisation.html',
  styleUrl: './organisation.scss'
})
export class Organisation extends UnsubscribeBase {
@ViewChild('addModal') addModal: ElementRef;
  businessUnits: any = [];
  subBusinessUnits: any = [];
  organisationList: any[] = [];
  continents: any = [
    {
      continentId: 'CO25066719',
      continentName: 'Asia',
    },
    {
      continentId: 'CO25068243',
      continentName: 'Africa',
    },
    {
      continentId: 'CO25069597',
      continentName: 'Europe',
    },
  ];
  regions: any = [
    {
      regionId: 'R250684107',
      regionName: 'East',
    },
    {
      regionId: 'R250669963',
      regionName: 'West',
    },
    {
      regionId: 'R250649506',
      regionName: 'North',
    },
    {
      regionId: 'R250686078',
      regionName: 'South',
    },
  ];
  countries: any = ['India'];
  states: any = ['Haryana', 'Chhattisgarh', 'Bihar', 'Jharkhand'];
  cities: any = ['Gurugram', 'Raigarh', 'Raipur', 'Bilaspur'];
  organisationTypes = [
    'Private Limited',
    'Public Limited',
    'Government',
    'NGO / Non-Profit',
    'Partnership Firm',
    'Sole Proprietorship',
    'Startup',
    'Others',
  ];

  customFields: any = [];
  tableColumns: any[] = [
    {
      key: 'title',
      label: 'Organization Name',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'type_of_org',
      label: 'Type of Organisation',
    },
    {
      key: 'country',
      label: 'Country',
    },
    {
      key: 'state',
      label: 'State',
    },
    {
      key: 'city',
      label: 'City',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];
  actions: any[] = [
    { type: 'Edit', label: 'Edit Bin', icon: 'bi-pencil' },
    { type: 'Delete', label: 'Delete Bin', icon: 'bi-trash' },
  ];
  orgForm: FormGroup;
  editingOrg;
  params = {
    limit: 10,
    pageNo: 0,
  };

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    public commonService: CommonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.orgForm = this._formBuilder.group({
      title: ['', Validators.required],
      email: [null, [Validators.email, Validators.required]],
      phone: [''],
      type_of_org: [''],
      status: ['Active'],
      // unit: [''],
      // regionId: [''],
      // buId: [''],
      // subBusinessUnitId: [''],
      // continentId: [''],
      country: [''],
      state: [''],
      city: [''],
      address: [''],
      another_address: [''],
    });
    this.fetchOrganisations();
    // this.fetchContinents();
    // this.fetchRegions();
    // this.fetchBusinessUnits();
  }

  get f() {
    return this.orgForm.controls;
  }
  fetchOrganisations() {
    this.apiService
      .commonGetMethod('/api/admin/masters/business-unit', {
        show_row: this.params.limit,
        page: this.params.pageNo + 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.status_code == 200) {
            this.organisationList = response.data?.data;
          } else {
            this.organisationList = [];
            console.error(response.message);
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
    this.fetchOrganisations();
  }

  fetchBusinessUnits() {
    this.apiService
      .commonGetMethod('/secure/user-management/api/fetch/bu', {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.businessUnits = response.responseObject.buDTOs;
          } else {
            this.businessUnits = [];
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  fetchSubBusinessUnits() {
    this.orgForm.patchValue({
      subBusinessUnitId: this.editingOrg?.subBuId || '',
    });
    this.apiService
      .commonPostMethod('/secure/user-management/api/fetch/sub/business/unit', {
        buId: this.orgForm.value.buId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.subBusinessUnits = response.responseObject.subBusinessUnitDTOs;
          } else {
            this.subBusinessUnits = [];
            this.orgForm.patchValue({
              subBusinessUnitId: '',
            });
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  editModalOpen(data: any) {
    const modelId = document.getElementById('addModal');
    modelId?.click();
    // this.addModal?.nativeElement?.click();

    this.editingOrg = data;
    this.orgForm.patchValue({
      title: this.editingOrg.title || '',
      state: this.editingOrg.state || '',
      city: this.editingOrg.city || '',
      country: this.editingOrg.country || '',
      status: this.editingOrg.status || 'Active',
      email: this.editingOrg.email || '',
      phone: this.editingOrg.phone || '',
      type_of_org: this.editingOrg.type_of_org || '',
      address: this.editingOrg.address || '',
      another_address: this.editingOrg.another_address || '',
    });
  }

  onSubmit(type: string) {
    const payload = { ...this.orgForm.value };
    console.log(payload);
    if (this.orgForm.valid) {
      const api =
        type === 'create'
          ? this.apiService.commonPostMethod(
              `/api/admin/masters/business-unit`,
              payload
            )
          : this.apiService.commonPutMethod(
              `/api/admin/masters/business-unit/${this.editingOrg?.id}`,
              payload
            );

      api.pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.status == true && response.status_code == 200) {
            this.toastr.success(response.message);
            this.fetchOrganisations();
            this.orgForm.reset();
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
    }
  }

  onDeleteOrganisation(org: any) {
    this.sweetAlertService
      .showDeletePopUp(
        this.commonService.viewPage('Organization Hierarchy', 'Organization')
          ?.allowEdit
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.apiService
            .commonDeleteMethod(
              `/api/admin/masters/business-unit/${org?.id}`,
              {}
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                if (res.status == true && res.status_code == 200) {
                  this.toastr.success(res.message);
                  this.fetchOrganisations();
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
