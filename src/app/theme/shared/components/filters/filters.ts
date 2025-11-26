import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, ViewChild, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { getStoreData, SELECTOR } from 'src/app/store/common/common.selectors';
import { takeUntil } from 'rxjs';
import { UnsubscribeBase } from 'src/app/demo/unsubscribe-base';
import { ApiService } from '../../service/api.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-filters',
  imports: [SharedModule],
  templateUrl: './filters.html',
  styleUrls: ['./filters.scss'],
})
export class Filters extends UnsubscribeBase implements OnInit, OnChanges {
  @ViewChild('filterBtn') filterBtn;
  isMobileView = window.innerWidth < 768;
  @Input() filterApply: any = {};

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.isMobileView = window.innerWidth < 768;
    }
  @Input() filterType: string = '';
  @Input() module: string = '';
  @Input() filterId: any = [];
  @Input() customFilters: any = [];

  @Output() applyFilter = new EventEmitter<any>();
  @Output() changeChartType = new EventEmitter<any>();
  filterOptions = {
    businessUnitId: '',
    binId: '',
    buId: '',
    categoryId: '',
    subCategoryId: '',
    status: '',
    severityId: '',
    ticketNo: '',
    orgId: '',
    ticketCreator: '',
    ticketResolver: '',
    fromDate: '',
    toDate: '',
    filterType: 1,
    slaFilter: 'ALL',
    calenderType: 'Monthly',
    chartType: 'line',
    customFieldKey: [],
    customFieldValue: [],
    requestType: 'INCIDENT'
  };

  filterFields = {}

  selectedFilter: string = '';
  selectedChart: string = '';
  isFilterFetched: boolean = false;
  isInvalidToDate: boolean = false;
  requestTypes: any = [];

  filterConfig = {
    'incident-list': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        bu: true,
        category: true,
        subCategory: true,
        status: true,
        severityId: true,
        ticketNo: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
      },
    },
    'historical-list': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        bu: true,
        category: true,
        subCategory: true,
        status: true,
        severityId: true,
        ticketNo: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
        requestType: true
      },
    },
    'all-tickets': {
      'tabs': {
        businessUnit: true,
        bin: true,
        category: true,
        subCategory: true,
        status: true,
        severityId: true,
        ticketNo: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        customDateRange: true,
        requestType: true,
        bu: true
      },
    },
    'service-request-list': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        bu: true,
        category: true,
        subCategory: true,
        status: true,
        severityId: true,
        ticketNo: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
        // serviceCategory: true,
        // serviceSubCategory: true,
      },
    },
    'custom-reports': {
      'tabs': {
        filterType: false,
        slaFilter: true,
        businessUnit: true,
        bin: true,
        bu: true,
        category: true,
        subCategory: true,
        status: true,
        severityId: true,
        ticketNo: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
      },
    },
    'custom-reports-complete': {
      'tabs': {
        filterType: false,
        slaFilter: true,
        businessUnit: true,
        bin: true,
        bu: true,
        category: true,
        subCategory: true,
        status: true,
        severityId: true,
        ticketNo: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
        requestType: true,
      },
    },
    'admin-dashboard': {
      'popup': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: false,
        category: false,
        subCategory: false,
        status: false,
        customDateRange: true,
        duration: true,
        calenderType: false,
        chartType: false,
      },
      'chartTabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: false,
        category: false,
        subCategory: false,
        status: false,
        customDateRange: false,
        duration: true,
        calenderType: false,
        chartType: true,
        requestType: true,
      },
    },
    'sla-reports': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        category: true,
        subCategory: true,
        status: true,
        customDateRange: false,
        duration: true,
        calenderType: false,
        chartType: false,
        ticketNo: true,
        bu: true,
        orgId: true,
        ticketCreator: true,
        ticketResolver: true,
        severityId: true,
        requestType: true
      },
      'chartTabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: false,
        category: false,
        subCategory: false,
        status: false,
        customDateRange: false,
        duration: false,
        calenderType: false,
        chartType: true, 
      },
    },
    'ticket-analysis': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        category: true,
        subCategory: true,
        status: true,
        customDateRange: false,
        duration: true,
        calenderType: false,
        chartType: false,
        requestType: true
      },
    },
    'agent-performance': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        category: true,
        subCategory: true,
        status: true,
        customDateRange: false,
        duration: true,
        calenderType: false,
        chartType: false,
      },
    },
    'bin-category-analysis': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: true,
        category: false,
        subCategory: false,
        status: true,
        customDateRange: false,
        duration: true,
        calenderType: false,
        chartType: false,
        requestType: true
      },
    },
    'inflow-closure': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: true,
        category: true,
        subCategory: false,
        status: false,
        customDateRange: false,
        duration: false,
        calenderType: true,
        chartType: false,
        requestType: true
      },
    },
    'feedback-list': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: false,
        category: false,
        subCategory: false,
        status: false,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false
      },
    },
    'issue-type-report': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: false,
        bin: false,
        category: false,
        subCategory: false,
        status: false,
        customDateRange: true,
        duration: true,
        calenderType: false,
        chartType: false,
        requestType: true
      },
    },
    'bin-wise-sla': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        category: true,
        subCategory: true,
        status: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
        ticketNo: true,
        bu: true,
        requestType: true
      },
    },
    'category-wise-sla': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: true,
        category: true,
        subCategory: true,
        status: true,
        customDateRange: true,
        duration: false,
        calenderType: false,
        chartType: false,
        ticketNo: true,
        bu: true,
        requestType: true
      },
    },
    'category-list': {
      'tabs': {
        filterType: false,
        slaFilter: false,
        businessUnit: true,
        bin: false,
        category: false,
        subCategory: false,
        status: false,
        severityId: false,
        ticketNo: false,
        orgId: false,
        ticketCreator: false,
        ticketResolver: false,
        customDateRange: false,
        duration: false,
        calenderType: false,
        chartType: false,
        // serviceCategory: false,
        // serviceSubCategory: false,
      },
    },
    'vendor-wise-report' : {
      'tabs': {
        requestType: true,
        bin: true,
      }
    }
  };

  durationOptions = ['Today', 'This Month', 'This Year', 'Custom Date'];
  monthMap = {
    'Jan': ['01', 31],
    'Feb': ['02', (new Date().getFullYear() % 4 === 0 && (new Date().getFullYear() % 100 !== 0 || new Date().getFullYear() % 400 === 0)) ? 29 : 28],
    'Mar': ['03', 31],
    'Apr': ['04', 30],
    'May': ['05', 31],
    'Jun': ['06', 30],
    'Jul': ['07', 31],
    'Aug': ['08', 31],
    'Sep': ['09', 30],
    'Oct': ['10', 31],
    'Nov': ['11', 30],
    'Dec': ['12', 31]
  };
  chartTypes = ['line', 'bar', 'pie', 'doughnut'];


  monthNames = Object.keys(this.monthMap);

  statusData: any[] = [];
  severityData: any[] = [];
  businessDetails: any[] = [];
  bins: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  organizations: any[] = [];
  ticketCreators: any[] = [];
  ticketResolvers: any[] = []; 

  categoriesService: any = [];
  subCategoriesService: any[] = [];

  buDetails: any = [];

  currentDate = new Date().toISOString().split('T')[0];

  constructor(private apiService: ApiService, private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.setFilterVisibility();
    this.fetchFilters();
    // this.fetchRequestTypeConstants();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterOptions']) {
      this.filterOptions.fromDate = this.filterOptions?.fromDate?.split(' ')[0];
      this.filterOptions.toDate = this.filterOptions?.toDate?.split(' ')[0];
    }

    if(changes['filterId']) {
      this.resetFilters();
    }
  }

  setFilterVisibility() {
    const config = this.filterConfig[this.module]?.[this.filterType];
    if (config) {
      this.filterFields = { ...config };
    }

    if(this.module == 'ticket-analysis') {
      this.durationOptions = ['Yesterday', 'Last 7 days', 'Last 15 days', 'Last 30 days'];
      this.selectedFilter = 'Last 7 days';
      setTimeout(() => {
        this.applyDurationFilter('Last 7 days')
      }, 600);
    } else if(this.module == 'admin-dashboard' && this.filterType == 'chartTabs') {
      this.chartTypes = ['line', 'bar'];
      this.selectedChart = 'bar';
      this.selectedFilter = 'Today';
      this.changeChartType.emit('bar');
    } else if(this.module == 'sla-reports') {
      this.chartTypes = ['line', 'bar', 'pie', 'doughnut'];
      this.selectedChart = 'pie';
      this.changeChartType.emit('pie');
    } else if(this.module == 'inflow-closure') {
      this.fetchBinDetails();
      this.applySingleMonthFilter(this.currentDate.split('-')[0]+'-'+this.currentDate.split('-')[1]);
    } else if(this.module == 'bin-category-analysis' || this.module == 'vendor-wise-report') {
      this.fetchBinDetails()
    } else if(this.module == 'all-tickets') {
      this.filterOptions.requestType = null;
    }
  }

  isFieldVisible(field): boolean {
    return this.filterFields[field];
  }

  fetchFilters() {
    if((!this.isFilterFetched && this.module !== 'admin-dashboard') || (this.filterType == 'tabs' && !this.isMobileView)) {
      // this.fetchBinDetails();
      // this.fetchOrganizations();
      this.fetchBusinessDetails();
      // this.fetchCreators();
      // this.fetchResolvers();
      // this.fetchCategoryDetails();
      // this.fetchStatus();
      // this.fetchSeverity();
      this.isFilterFetched = true;
    }
  }

  applyFilters() {
    if(this.filterOptions.businessUnitId == '' && (this.isFieldVisible('businessUnit'))) {
      this.filterOptions.binId = '';
    }
    if(this.filterOptions.categoryId == '') {
      this.filterOptions.subCategoryId = '';
    }
    let filters = {
      ...this.filterOptions,
      fromDate: this.filterOptions.fromDate ? this.filterOptions.fromDate + ' 00:00:00' : '',
      toDate: this.filterOptions.toDate ? this.filterOptions.toDate + ' 23:59:59' : '',
    };
    this.applyFilter.emit(filters);
  }

  applyDurationFilter(duration) {
    this.selectedFilter = duration;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    if (duration === 'All') {
      this.filterOptions.fromDate = '';
      this.filterOptions.toDate = '';
    } else if (duration === 'Yesterday') {
      this.filterOptions.fromDate = yesterday.toISOString().split('T')[0];
      this.filterOptions.toDate = yesterday.toISOString().split('T')[0];
    } else if (duration === 'Last 7 days') {
      let last7days = new Date(new Date().setDate(new Date().getDate() - 7));
      this.filterOptions.fromDate = last7days.toISOString().split('T')[0];
      this.filterOptions.toDate = yesterday.toISOString().split('T')[0];
    } else if (duration === 'Last 15 days') {
      let last7days = new Date(new Date().setDate(new Date().getDate() - 15));
      this.filterOptions.fromDate = last7days.toISOString().split('T')[0];
      this.filterOptions.toDate = yesterday.toISOString().split('T')[0];
    } else if (duration === 'Last 30 days') {
      let last30days = new Date(new Date().setDate(new Date().getDate() - 30));
      this.filterOptions.fromDate = last30days.toISOString().split('T')[0];
      this.filterOptions.toDate = yesterday.toISOString().split('T')[0];
    } else if (duration === 'Today') {
      this.filterOptions.fromDate = this.currentDate;
      this.filterOptions.toDate = this.currentDate;
    } else if (duration === 'This Month') {
      let currentDate = new Date();
      this.filterOptions.fromDate =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') +
        '-01';
      this.filterOptions.toDate = this.currentDate;
    } else if (duration === 'This Year') {
      let currentDate = new Date();
      this.filterOptions.fromDate = currentDate.getFullYear() + '-01-01';
      this.filterOptions.toDate = this.currentDate;
    }

    let filters = {
      ...this.filterOptions,
      fromDate: this.filterOptions.fromDate ? this.filterOptions.fromDate + ' 00:00:00' : '',
      toDate: this.filterOptions.toDate ? this.filterOptions.toDate + ' 23:59:59' : '',
      durationType: duration,
    };
    this.applyFilter.emit(filters);
  }

  applySingleMonthFilter(duration) {
    this.filterOptions.fromDate = `${duration}-01`;
    this.filterOptions.toDate =  this.getLastDayOfMonth(duration);

    let filters = {
      calenderType: this.filterOptions.calenderType,
      fromDate: this.filterOptions.fromDate,
      toDate: this.filterOptions.toDate,
    };
    this.applyFilter.emit(filters);
  }

  applyMonthRangeFilters() {
    let filters = {
      calenderType: this.filterOptions.calenderType,
      fromDate: this.filterOptions.fromDate+'-01',
      toDate: this.getLastDayOfMonth(this.filterOptions.toDate),
    };
    this.applyFilter.emit(filters);
  }

  getLastDayOfMonth(duration) {
    const [year, month] = duration.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return `${duration}-${String(lastDay).padStart(2, '0')}`;
  }

  resetFilters() {
    this.filterOptions = {
      businessUnitId: '',
      binId: '',
      buId: '',
      categoryId: '',
      subCategoryId: '',
      status: '',
      severityId: '',
      ticketNo: '',
      orgId: '',
      ticketCreator: '',
      ticketResolver: '',
      fromDate: '',
      toDate: '',
      filterType: 1,
      slaFilter: 'ALL',
      calenderType: 'Monthly',
      chartType: 'line',
      customFieldKey: [],
      customFieldValue: [],
      requestType: 'INCIDENT'
    };
    this.selectedFilter = "";
    this.applyFilter.emit(this.filterOptions);
    this.setFilterVisibility();
  }

  fetchStatus() {
    this.store.select(getStoreData(SELECTOR.STATUS)).subscribe((data) => {
      this.statusData = data;
    });
  }

  fetchSeverity() {
    this.store.select(getStoreData(SELECTOR.SEVERITY)).subscribe((data) => {
      this.severityData = data;
    });
  }

  fetchBusinessDetails() {
    this.store.select(getStoreData(SELECTOR.BUSINESS_UNITS)).subscribe((data) => {
      this.businessDetails = data;
    });
  }

  fetchBinDetails() {
    let selectedBUId = this.filterOptions.businessUnitId;
    if(selectedBUId || this.module == 'bin-category-analysis' || this.module == 'vendor-wise-report' || this.module == 'inflow-closure') {
      this.apiService
      .commonPostMethod('/secure/ticket-management/api/fetch/app/dropdown', { type: 'BIN', searchValue: selectedBUId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.bins = response.responseObject.dropdownDetails;
            if(this.module == 'vendor-wise-report' && this.bins.length) {
              this.filterOptions.binId = this.bins[0].id;
              this.applyFilters();
            }
          } else {
            this.bins = [];
            this.filterOptions.binId = '';
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
    }
  }

  fetchBUDetails() {
    this.apiService
    .commonGetMethod('/secure/user-management/api/fetch/bu', {})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.status == true && response.statusCode == 200) {
          this.buDetails = response.responseObject.buDTOs;
        } else {
          this.buDetails = [];
          console.error(response.message);
        }
      },
      error: (err) => {
        console.error(err.error.message);
      },
    });
  }

  fetchOrganizations() {
    this.apiService
    .commonPostMethod('/secure/ticket-management/api/fetch/app/dropdown', { type: 'ORGANIZATION', searchValue: "" })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.status == true && response.statusCode == 200) {
          this.organizations = response.responseObject.dropdownDetails;
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

  fetchCreators() {
    if(this.ticketCreators.length == 0) {
      this.apiService
    .commonPostMethod('/secure/ticket-management/api/fetch/app/dropdown', { type: 'TICKET_CREATOR', searchValue: "" })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.status == true && response.statusCode == 200) {
          this.ticketCreators = response.responseObject.dropdownDetails;
        } else {
          this.ticketCreators = [];
          console.error(response.message);
        }
      },
      error: (err) => {
        console.error(err.error.message);
      },
    });
    }
  }
  fetchResolvers() {
    if(this.ticketResolvers.length == 0) {
      this.apiService
    .commonPostMethod('/secure/ticket-management/api/fetch/app/dropdown', { type: 'TICKET_ASSIGNED_TO', searchValue: "" })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.status == true && response.statusCode == 200) {
          this.ticketResolvers = response.responseObject.dropdownDetails;
        } else {
          this.ticketResolvers = [];
          console.error(response.message);
        }
      },
      error: (err) => {
        console.error(err.error.message);
      },
    });
    }
  }

  fetchCategoryDetails() {
    if(this.module == 'service-request-list-test') {
      this.apiService
      .commonGetMethod(
        '/secure/ticket-management/api/fetch/category/service',
        {}
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.categoriesService = response.responseObject.categoryServices;
          } else {
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
    });
    } else {
      if(this.categories.length == 0) {
        this.apiService
      .commonPostMethod('/secure/ticket-management/api/fetch/app/dropdown', { type: 'CATEGORY', searchValue: '' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.categories = response.responseObject.dropdownDetails;
          } else {
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
      }
    }
  }

  fetchSubCategoryDetails() {
    this.filterOptions.subCategoryId = '';
    let selectedCategoryId = this.filterOptions.categoryId;
    if(this.module == 'service-request-list-test') {
      this.apiService
      .commonPostMethod(
        '/secure/ticket-management/api/fetch/sub/category/service',
        { categoryId: selectedCategoryId }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.subCategoriesService = response.responseObject.subCategoryService;
          } else {
            this.subCategoriesService = [];
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
    } else {
      this.apiService
      .commonPostMethod('/secure/ticket-management/api/fetch/app/dropdown', { type: 'SUB_CATEGORY', searchValue: selectedCategoryId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.subCategories = response.responseObject.dropdownDetails;
          } else {
            this.subCategories = [];
            this.filterOptions.subCategoryId = '';
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
    }
  }

  closeDropdown() {
    this.filterBtn.nativeElement.click();
  }

  checkValidDate() {
    if (this.filterOptions.fromDate && this.filterOptions.toDate) {
      let fromDate = new Date(this.filterOptions.fromDate);
      let toDate = new Date(this.filterOptions.toDate);
      if (fromDate > toDate) {
        this.isInvalidToDate = true;
        this.filterOptions.toDate = '';
      } else {
        this.isInvalidToDate = false;
      }
    }
  }  

  checkValidDateRange() {
    if (this.filterOptions.fromDate && this.filterOptions.toDate) {
      let fromDate = new Date(this.filterOptions.fromDate);
      let toDate = new Date(this.filterOptions.toDate);
      if (fromDate > toDate) {
        this.isInvalidToDate = true;
        this.filterOptions.toDate = '';
      } else {
        this.applyFilters();
        this.isInvalidToDate = false;
      }
    }
  }  

  customSearch(term: string, item: any) {
		term = term.toLowerCase();
		return item.value1.toLowerCase().indexOf(term) > -1 || item.value2.toLowerCase().indexOf(term) > -1;
	}

  fetchRequestTypeConstants() {
    if(this.requestTypes.length == 0) {
      this.apiService
      .commonPostMethod('/secure/ticket-management/api/v1/fetch/app/constant', {
        codeId: 'F_REQUEST_TYPE',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.status == true && res.statusCode === 200) {
            this.requestTypes = res.responseObject.appConstants;       
          } else {
            console.error(res.message);
          }
        },
        error: (err) => {
          console.error(err.error.error);
        },
      });
    }
  }
}