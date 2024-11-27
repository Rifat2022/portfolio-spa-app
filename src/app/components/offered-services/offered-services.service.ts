import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferedServices } from './offered-services.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OfferedServicesService {
  private readonly apiUrl:string = 'http://localhost:5001/api/OfferedServices';

  constructor(private http: HttpClient) { }
  getAllOfferedServices(): Observable<OfferedServices[]> {
    return this.http.get<OfferedServices[]>(this.apiUrl);
  }

  createOfferedService(formData: FormData): Observable<OfferedServices> {
    return this.http.post<OfferedServices>(this.apiUrl, formData);
  }
  // Update an existing review
  updateOfferedService(id: number, updatedFormData: FormData): Observable<OfferedServices> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<OfferedServices>(url, updatedFormData);
  }
  // Delete a review
  deleteOfferedService(id: number): Observable<string> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(url);
  }
}
