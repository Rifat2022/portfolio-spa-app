import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerReviewService } from './customer-review.service';
import { CustomerReview } from './customer-review.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../../Shared/Services/file.service';

@Component({
  selector: 'app-customer-review',
  standalone: true,
  imports: [CommonModule],
  providers: [HttpClient, CustomerReviewService],
  templateUrl: './customer-review.component.html',
  styleUrl: './customer-review.component.scss'
})
export class CustomerReviewComponent {
  customerReviews: CustomerReview[] = []
  customerReviewHeaders!: (keyof CustomerReview)[];
  apiUrl = "http://localhost:5001/api/customerreview"; 
  
  constructor(
      private fileService: FileService,
      private reviewService: CustomerReviewService,
      private toastrService: ToastrService 
    ) {
    this.reviewService.getAllReviews().subscribe({
      next: (reviews: CustomerReview[]) => {
        reviews.map((cr: CustomerReview) => {
          const blobUrl = this.fileService.createBlobUrlFromBase64String(cr.fileDetails.data, cr.fileDetails.contentType);
          cr.fileDetails.path = blobUrl ? blobUrl : '';
          this.customerReviews.push(cr);
        })
      },
      error: (err: any) => {
        this.toastrService.error(err.message, "Getting Customer Review")
      },
      complete: () => { }
    })
  }  
}
