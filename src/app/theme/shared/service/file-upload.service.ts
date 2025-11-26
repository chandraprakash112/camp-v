import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuid } from 'uuid';
import { getBaseUrl } from '../_helpers/base-url.util';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = getBaseUrl();
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  uploadFile(
    file: File,
    identifier: string = '',
    uploadUrl: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if(identifier) {
      formData.append('type', identifier);
    // formData.append('documentType', identifier);
    // formData.append('documentId', uuid());
    }

    return this.http
      .post(this.baseUrl + uploadUrl, formData, {
        headers: new HttpHeaders(),
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              if (event.total) {
                this.toastr.clear();
                this.toastr.info(`In Progress...`, 'Uploading...', {
                  progressBar: true,
                  timeOut: 0,
                  closeButton: true,
                });
              }
              break;

            case HttpEventType.Response:
              if (event instanceof HttpResponse && event.status === 200) {
                this.toastr.clear();
                this.toastr.success(
                  'File uploaded successfully!',
                  'Upload Complete'
                );
                return event.body;
              }
              break;
          }
          return null;
        }),
        catchError((error) => {
          this.toastr.clear();
          this.toastr.error(error.error.message || 'File upload failed.');
          throw error;
        })
      );
  }
  deleteFile(documentUrl: string, deleteUrl: string): Observable<any> {
    const formData = new FormData();
    formData.append('documentUrl', documentUrl);
    return this.http.post(this.baseUrl + deleteUrl, formData).pipe(
      map((response) => {
        this.toastr.success('File deleted successfully!', 'Delete Complete');
        return response;
      }),
      catchError((error) => {
        this.toastr.error(error.error.message || 'File deletion failed.');
        throw error;
      })
    );
  }
}
