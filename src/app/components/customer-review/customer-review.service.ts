import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerReview } from './customer-review.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerReviewService {

  private readonly apiUrl:string = 'http://localhost:5001/api/CustomerReview';
  constructor(private http: HttpClient) { }
  // Get all reviews
  getAllReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(this.apiUrl);
  }

  createCustomerReviewWithFile(formData: FormData): Observable<CustomerReview> {
    return this.http.post<CustomerReview>(this.apiUrl, formData);
  }
  // Update an existing review
  updateCustomerReviewWithFile(id: number, updatedFormData: FormData): Observable<CustomerReview> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<CustomerReview>(url, updatedFormData);
  }
  // Delete a review
  deleteReview(id: number): Observable<string> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(url);
  }

}
