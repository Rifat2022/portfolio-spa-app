import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Testimonial } from '../Models/testimonial.model';
import { CustomerReview } from '../Models/customer-review.model';
import { Observable } from 'rxjs/internal/Observable';
import { FileDetails } from '../Models/FileDetails';

@Injectable({
  providedIn: 'root'
})

export class CustomerReviewService {
  private apiUrl = 'http://localhost:5001/api/CustomerReview';
  constructor(private http: HttpClient) {}
  customerReview!: CustomerReview[];
  // Get all reviews
  getReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(this.apiUrl);
  }

  // Create a new review
  createReview(review: CustomerReview, file: File): Observable<CustomerReview> {
    const formData = new FormData();
    formData.append('file', file);
    // formData.append('review', JSON.stringify(review)); 
    Object.keys(review).forEach(key => {
      formData.append(key, (review as any)[key]);
    });
    return this.http.post<CustomerReview>(this.apiUrl, formData);
  }


  // Update an existing review
  updateReview(id: number, review: CustomerReview): Observable<CustomerReview> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<CustomerReview>(url, review);
  }

  // Delete a review
  deleteReview(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
