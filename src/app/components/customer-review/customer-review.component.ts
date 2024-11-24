import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerReviewService } from './customer-review.service';
import { CustomerReview } from './customer-review.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-review',
  standalone: true,
  imports: [CommonModule],
  providers: [HttpClient, CustomerReviewService],
  templateUrl: './customer-review.component.html',
  styleUrl: './customer-review.component.scss'
})
export class CustomerReviewComponent {
  reviews: CustomerReview[] = [];
  apiUrl = "http://localhost:5001/api/customerreview"
  constructor(private reviewService: CustomerReviewService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getReviews();
  }
  createCustomerReviewWithFile(formData: FormData): Observable<CustomerReview> {
    return this.http.post<CustomerReview>(this.apiUrl, formData);
  }
  getReviews(): void {
    this.reviewService.getAllCustomerReviews().subscribe(
      (reviews) => {
        this.reviews = reviews;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  deleteReview(id: number): void {
    this.reviewService.deleteCustomerReview(id).subscribe(() => {
      this.reviews = this.reviews.filter(review => review.id !== id);
    });
  }
}
