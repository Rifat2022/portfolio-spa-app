import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerReview } from './customer-review.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerReviewService {

  environment = {
    apiUrl : 'http://localhost:5001/'
  }
  private apiUrl = `${this.environment.apiUrl}/api/customerreview`;

  constructor(private http: HttpClient) { }

  // Get all customer reviews
  getAllCustomerReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(this.apiUrl);
  }

  // Get a single customer review by ID
  getCustomerReviewById(id: number): Observable<CustomerReview> {
    return this.http.get<CustomerReview>(`${this.apiUrl}/${id}`);
  }

  // Create a new customer review
  createCustomerReview(customerReview: CustomerReview): Observable<CustomerReview> {
    return this.http.post<CustomerReview>(this.apiUrl, customerReview);
  }

  // Update an existing customer review
  updateCustomerReview(id: number, customerReview: CustomerReview): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, customerReview);
  }

  // Delete a customer review by ID
  deleteCustomerReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
