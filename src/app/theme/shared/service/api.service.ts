import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getBaseUrl } from '../_helpers/base-url.util';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = getBaseUrl();
  constructor(private http: HttpClient) {}
  commonPostMethod(url: string, data: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.post(endPoint, data);
  }
  commonGetMethod(url: string, param: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.get(endPoint, { params: param });
  }
  commonDeleteMethod(url: string, data: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.delete(endPoint, {
      body: data,
    });
  }
  commonPutMethod(url: string, data: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.put(endPoint, data);
  }
  commonPatchMethod(url: string, data: any): Observable<any> {
    const endPoint = this.baseUrl + url;
    return this.http.patch(endPoint, data);
  }
}
