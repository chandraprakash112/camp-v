import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
// import { IActions, ITableColumn } from 'src/app/_helpers/_models/common.interface';
import { takeUntil } from 'rxjs';
import { UnsubscribeBase } from '../../unsubscribe-base';
import { getBaseUrl } from 'src/app/theme/shared/_helpers/base-url.util';
import { ApiService } from 'src/app/theme/shared/service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationPipe } from 'src/app/theme/shared/pipes/pagination.pipe';
import { TableSortPipe } from 'src/app/theme/shared/pipes/table-sort.pipe';
import {
  TimeConverterPipe,
  TimeOrDatePipe,
} from 'src/app/theme/shared/pipes/time-converter.pipe';
@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    FormsModule,
    PaginationPipe,
    TableSortPipe,
    TimeConverterPipe,
    TimeOrDatePipe,
  ],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
})
export class TableComponent
  extends UnsubscribeBase
  implements OnInit, OnChanges
{
  private baseUrl = getBaseUrl();

  @Input() columns: any[] = [];
  @Input() rows: any[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() actions?: any[] = [];
  @Input() showCheckBox: boolean = false;
  @Input() useApiPagination: boolean = false;
  @Input() showSLAFor: string = null;

  @Output() edit = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<any>();
  @Output() copy = new EventEmitter<any>();
  @Output() multiselect = new EventEmitter<any>();
  @Output() updatePagination = new EventEmitter<any>();

  isMobile = window.innerWidth <= 768;

  searchText: string = '';
  selectedColumn: string = '';
  sortDirection: string = 'desc';
  filteredRows: any[] = [];
  totalPages: number = 0;
  selectedRows = [];
  slaDetails: any;
  selectedSLA = '';

  incidentCustomFields: any = [];

  constructor(private apiService: ApiService) {
    super();
  }

  ngOnInit(): void {
    if (this.rows == undefined) {
      this.rows = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rows']) {
      this.updateTable();
      this.selectedRows = [];
    }
  }

  updateTable() {
    //updating rows everytime searchbar is ised
    if (!this.searchText) {
      this.filteredRows = [...this.rows];
    } else {
      this.filteredRows = this.rows?.filter((item) => {
        return Object.keys(item).some((key) =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(this.searchText.toLowerCase()),
        );
      });
    }
    if (this.useApiPagination) {
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    } else {
      this.totalPages = Math.ceil(this.filteredRows.length / this.pageSize);
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  onColumnClick(columnKey: string) {
    if (this.selectedColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.selectedColumn = columnKey;
      this.sortDirection = 'asc';
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.useApiPagination) {
        this.updatePagination.emit({
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
        });
      }
    }
  }

  actionCallback(action: string, row) {
    this[action.toLowerCase()].emit(row);
  }

  isSelected(row) {
    return this.selectedRows.includes(row);
  }

  toggleSelection(row) {
    const index = this.selectedRows.indexOf(row);
    if (index > -1) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }

    this.multiselect.emit(this.selectedRows);
  }

  selectAllRows(event) {
    if (event.target.checked) {
      this.selectedRows = [...this.filteredRows];
    } else {
      this.selectedRows = [];
    }
    this.multiselect.emit(this.selectedRows);
  }

  getDisplayedPages(): number[] {
    let pages: number[] = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages = [1, 2, 3, 4];
      } else if (this.currentPage >= this.totalPages - 2) {
        pages = [
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
      } else {
        pages = [this.currentPage - 1, this.currentPage, this.currentPage + 1];
      }
    }
    return pages;
  }

  updatePageSize() {
    this.updatePagination.emit({
      currentPage: 0,
      pageSize: this.pageSize,
    });
  }

  //Fetching SLA Details for info popup inside table in SLA Reports
  fetchSLADetails(ticket: any) {
    this.selectedSLA = ticket.ticketNo;
    this.slaDetails = {};
    const endPoint = this.showSLAFor
      ? '/secure/ticket-management/api/ticket/sla/details'
      : '/secure/ticket-management/api/ticket/sla/details';
    const payload = this.showSLAFor
      ? {
          ticketNo: ticket.ticketNo,
          requestType: ticket.ticketType,
          slaOn: this.showSLAFor,
        }
      : {
          ticketNo: ticket.ticketNo,
          requestType: ticket.ticketType,
        };
    this.apiService
      .commonPostMethod(endPoint, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status == true && response.statusCode == 200) {
            this.slaDetails = response.data;
          } else {
            console.error(response.message);
          }
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
  }

  //filtering custom fields for info popup in ticket details
  fetchIncidentCustomFields(ticketId, filterFor) {
    if (filterFor == 'incident') {
      this.incidentCustomFields = this.rows.filter((row) => {
        return row.ticketNo == ticketId;
      })[0]['customFields'];
    } else {
      this.incidentCustomFields = this.rows.filter((row) => {
        return row.requestId == ticketId;
      })[0]['customFields'];
    }
  }

  viewAttachment(url: string) {
    const path = url?.split('public/');
    let a: any = `${this.baseUrl}/public/storage/${path?.[1]}`;
    // this.apiService.downloadFile(a);

    fetch(a)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Attachment_${new Date().toISOString().split('T')[0]}`;
        link.click();
        URL.revokeObjectURL(blobUrl);
      });
  }

  getFileType(url: string) {
    if (!url) return 'file';
    const lowerUrl = url.toLowerCase();

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (imageExtensions.some((ext) => lowerUrl.endsWith(ext))) {
      return 'image';
    }

    if (lowerUrl.endsWith('.pdf')) {
      return 'pdf';
    } else if (lowerUrl.endsWith('.xlsx')) {
      return 'xlsx';
    }

    return 'file';
  }
}
