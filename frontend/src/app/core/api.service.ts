import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare global { interface Window { __HRMS_CONFIG__?: { apiBase?: string }; } }
@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly base = (window.__HRMS_CONFIG__?.apiBase || '/api').replace(/\/$/, '');
  constructor(private http: HttpClient) {}
  get<T>(path: string): Observable<T> { return this.http.get<T>(this.base + path); }
  post<T>(path: string, data: unknown = {}): Observable<T> { return this.http.post<T>(this.base + path, data); }
  put<T>(path: string, data: unknown): Observable<T> { return this.http.put<T>(this.base + path, data); }
  patch<T>(path: string, data: unknown = {}): Observable<T> { return this.http.patch<T>(this.base + path, data); }
  delete<T>(path: string): Observable<T> { return this.http.delete<T>(this.base + path); }
  upload<T>(path: string, file: File): Observable<T> {
    const body = new FormData(); body.append('file', file);
    return this.http.post<T>(this.base + path, body);
  }
  uploadDocument<T>(file: File, employeeId: number, category: string, expiry: string): Observable<T> {
    const body = new FormData(); body.append('file', file);
    body.append('employeeId', String(employeeId)); body.append('category', category);
    if (expiry) body.append('expiry', expiry);
    return this.http.post<T>(this.base + '/documents', body);
  }
  blob(path: string): Observable<Blob> { return this.http.get(this.base + path, { responseType: 'blob' }); }
  static errorMessage(error: any): string {
    if (error.status === 0) return 'Cannot connect to the API server. Check backend and API URL.';
    if (error.status === 401) return 'Your session expired. Please sign in again.';
    if (error.status === 403) return 'You do not have permission for this action.';
    return error.error?.message || error.message || 'Request failed';
  }
}
