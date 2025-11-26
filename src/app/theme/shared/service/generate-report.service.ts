import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SweetAlertService } from './sweet-alert.service';
import { getBaseUrl } from '../_helpers/base-url.util';

@Injectable({
  providedIn: 'root'
})
export class GenerateReportService {

  private baseURL = getBaseUrl()+'/secure/report-management/api/';

  constructor(private httpClient: HttpClient, private sweetAlertService: SweetAlertService) { }

  successPopUp(name) {
    const title = ``;
    const subTitle = `${name} Exported successfully!`;
    const confirmText = 'Close';
    this.sweetAlertService
      .showSuccessPopUp(title, subTitle, confirmText)
      .then((result) => {
        if (result.isConfirmed) {
        } else {
        }
      });
  }

  generateCustomReport(endpoint, body, name) {
    const url = this.baseURL + endpoint;

    this.httpClient.post(url, body, { responseType: 'blob' }).subscribe({
      next: (res: Blob) => {
        if(res) {
          const downloadUrl = window.URL.createObjectURL(res);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${name} ${new Date().toISOString().split('T')[0]}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(downloadUrl);
          this.successPopUp(name);
        } else {
          this.sweetAlertService.showWarningPopup('', 'No Data Available!')
        }
      },
      error: (err) => {
        console.error('Error downloading file:', err);
      },
    });
  }
}
