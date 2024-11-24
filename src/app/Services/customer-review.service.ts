import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CustomerReview } from '../components/customer-review/customer-review.model';

@Injectable({
  providedIn: 'root'
})

export class CustomerReviewService {
  private apiUrl = 'http://localhost:5001/api/CustomerReview';
  constructor(private http: HttpClient) { }
  customerReview!: CustomerReview[];
  // Get all reviews
  getAllReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(this.apiUrl);
  }

  // Create a new review
  createReview(formData: FormData): Observable<CustomerReview> {
    let customerReviewJson = JSON.stringify(formData);
    return this.http.post<CustomerReview>(this.apiUrl, customerReviewJson, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // createReview(review: CustomerReview, file: File): Observable<CustomerReview> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   // formData.append('review', JSON.stringify(review)); 
  //   Object.keys(review).forEach(key => {
  //     formData.append(key, (review as any)[key]);
  //   });
  //   return this.http.post<CustomerReview>(this.apiUrl, formData);
  // }


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
  createCustomerReviewWithFile(formData: FormData): Observable<CustomerReview> {
    return this.http.post<CustomerReview>(this.apiUrl, formData);
  }
}
