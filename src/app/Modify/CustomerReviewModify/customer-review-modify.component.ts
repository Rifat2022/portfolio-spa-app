import { CustomerReview} from '../../components/customer-review/customer-review.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerReviewService } from '../../components/customer-review/customer-review.service';
import { FileService } from '../../Shared/Services/file.service';
import { FileDetails } from '../../Shared/models/FileDetails.model';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CustomerReviewService],
  templateUrl: './customer-review-modify.component.html',
  styleUrl: './customer-review-modify.component.scss'
})

export class CustomerReviewModifyComponent {
  customerReviewHeaders!: (keyof CustomerReview)[];
  customerReviews: CustomerReview[] = []
  files: FileDetails[] = []
  selectedFile: File| null = null;
  selectedSection = {ClientReview: 'clientsReview', Services: 'Services'};
  editingIndex: any = null;
  previewKey: string = "fileDetails"; 
  newCustomerReview: any = {
    Id: undefined,
    Email: '',
    ReviewDescription: '',
    ReviewTime: '',
    Name: '',
    FileDetailsId: undefined,
    Quotation: '',
    Designation: '',
    Address: '',
  };

  /**Constructor*/
  constructor (
    private route: ActivatedRoute,
    private customerReviewService: CustomerReviewService,
    private fileService: FileService ) {
    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe(() => {
    // });
    // this.route.paramMap.subscribe((params) => {
    //   const componentName = params.get('clientsReview') || '';
    // });
    this.GetAllCustomerReviews();    
  }


  CreateCustomerReview() {
    if (!this.selectedFile) {
      return;
    }
    this.newCustomerReview.reviewTime = new Date().toLocaleString();
    const customerReviewFormData = new FormData();
    // Append selected multiple files to the FormData
    // this.selectedFiles.forEach((file, index) => {
    //   customerReviewFormData.append(`files`, file, file.name);
    // });
    customerReviewFormData.append(`file`, this.selectedFile, this.selectedFile.name);
    customerReviewFormData.append('CustomerReview', JSON.stringify(this.newCustomerReview));

    this.customerReviewService.createCustomerReviewWithFile(customerReviewFormData)
      .subscribe({
        next: (customerReview: any) => {
          let ncr = this.SetFilePath(customerReview)
          this.customerReviews.push(ncr);
          // this.selectedFile = null; 
        },
        error: (err: any) => {
          console.log(err.message);
        },
        complete: () => {
          // console.log("Request Completed");
          this.ResetForm();
        }
      })
  }

  GetAllCustomerReviews() {
      this.customerReviewService.getAllReviews().subscribe({
        next: (reviews: CustomerReview[]) => {
          if (reviews.length > 0) {
            this.customerReviewHeaders = Object.keys(reviews[0]) as (keyof CustomerReview)[];
            reviews.map((cr: CustomerReview) => {
              const blobUrl = this.fileService.createBlobUrlFromBase64String(cr.fileDetails.data, cr.fileDetails.contentType);
              cr.fileDetails.path = blobUrl ? blobUrl : '';
              this.customerReviews.push(cr);              
            })
          }
        },
        error: ((error: any) => {
          console.log("Request failed!" + error);
        }),
        complete: () => {
          console.log("Request Completed");
        }
      })
  }


  EditCustomerReview(index: number) {
    this.editingIndex = index;
    this.newCustomerReview = { ...this.customerReviews[index] };
  }

  UpdateCustomerReview() {
    if (this.editingIndex !== null) {
      let CustomerReviewId = this.customerReviews[this.editingIndex].id; // get the id of the CustomerReviewId of the selected array index
      if (CustomerReviewId == null) {
        return;
      }
      if (!this.selectedFile) {
        this.customerReviews[this.editingIndex].fileDetails.path = ''; // we don't keep anything in the FileDetails Path in DB
      }
      const updatedCustomerReviewFormData = new FormData();
      if (this.selectedFile) updatedCustomerReviewFormData.append(`file`, this.selectedFile, this.selectedFile.name);
      updatedCustomerReviewFormData.append(`UpdatedCustomerReview`, JSON.stringify(this.newCustomerReview));

      this.customerReviewService.updateCustomerReviewWithFile(CustomerReviewId, updatedCustomerReviewFormData).subscribe({
        next: (updatedCustomerReview: CustomerReview) => {
          let nucr = this.SetFilePath(updatedCustomerReview); 
          //update the customerReviews
          this.customerReviews[this.editingIndex] = nucr;
        },
        error: (err: any) => {
          console.log("updated request failed!" + err.message);
        },
        complete: () => {
          this.ResetForm();
          console.log("updated request completed")
        }
      }); 
    }

  }
  DeleteCustomerReview(index: number) {
    let customerReviewId = this.customerReviews[index].id;
    if (customerReviewId == null)
      return;
    this.customerReviewService.deleteReview(customerReviewId).subscribe({
      next: (isDeleted: any) => {
        this.customerReviews.splice(index, 1); 
      },
      error: (err: any) => {
        console.log("deletion failed!" + err);
      },
      complete: () => {
        console.log('completed!')
      }
    })
  }

  OnFileSelected(event: any) {
    // var me = this; 
    const fileInput = event.target as HTMLInputElement;
    if (!(fileInput.files) || fileInput.files.length == 0) {
      return;
    }
    //multiple files stored in files array
    // if (fileInput?.files) {
    //   this.selectedFiles = Array.from(fileInput.files);
    // }
    this.selectedFile = fileInput.files[0];
  }

  SetFilePath(cr: CustomerReview):CustomerReview {
    const blobUrl = this.fileService.createBlobUrlFromBase64String(cr.fileDetails.data, cr.fileDetails.contentType);
    cr.fileDetails.path = blobUrl ? blobUrl : '';
    return cr; 
  }

  ResetForm() {
    this.newCustomerReview = {};
    this.editingIndex = null;
    this.selectedFile = null; 
  }

}
