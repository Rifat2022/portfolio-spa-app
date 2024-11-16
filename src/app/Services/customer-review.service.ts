import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Testimonial } from '../Models/testimonial.model';
import { CustomerReview } from '../Models/customer-review.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

export class CustomerReviewService {
  private apiUrl = 'http://localhost:7000/api/CustomerReview';
  constructor(private http: HttpClient) { }
  customerReview!: CustomerReview[];
  // Get all reviews
  getReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(this.apiUrl);
  }

  // Create a new review
  createReview(review: CustomerReview): Observable<CustomerReview> {
    return this.http.post<CustomerReview>(this.apiUrl, review);
  }

  // Update an existing review
  updateReview(id: number, review: CustomerReview): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, review);
  }

  // Delete a review
  deleteReview(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
