import { CustomerReview, FileDetails } from '../components/customer-review/customer-review.model';
import { CustomerReviewService } from '../Services/customer-review.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../Services/file.service';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CustomerReviewService],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})

export class ModifyComponent {
  customerReviewHeaders!: (keyof CustomerReview)[]; 
  // excludedKeys: (keyof CustomerReview)[] = ['fileDetailsId', 'fileDetails'];
  customerReviews: CustomerReview[] = []
  files: FileDetails[]= []
  selectedSection = 'clientsReview'; 
  editingIndex: number | null = null
  selectedFile!: File; 
  previewKey : string = "fileDetails"
  // rootDirectory: string = "D:/Personal/Task/Project/Portfolio_web_api_app/Portfolio_backend/Porfolio/wwwroot/";
  // subDirectory: string = "assets/images/";
  newCustomerReview: any = {
    Id: undefined,
    Email: '',
    ReviewDescription: '',
    ReviewTime: '',
    Name: '',
    FileDetailsId: undefined,
    // FileDetails: {
    //   FileDetailsId: undefined,
    //   FileName: '',
    //   ContentType: '',
    //   Path: '',
    //   Data: '',
    // },
    Quotation: '',
    Designation: '',
    Address: '',
  };
  


  /**Constructor*/
  constructor(
    private route: ActivatedRoute,
    private customerReviewService: CustomerReviewService,
    private fileService: FileService) {
      
    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe(() => {
    // });
    this.route.paramMap.subscribe((params) => {
      const componentName = params.get('clientsReview') || '';
      this.getComponentData(componentName);
    });
  }
  onFileSelected(event: any) {
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
    // this.fileService.fileToBase64String(this.selectedFile).then(base64FileString => {
    //   this.newCustomerReview.FileDetails.FileName = this.selectedFile.name; 
    //   this.newCustomerReview.FileDetails.ContentType = this.selectedFile.type; 
    //   this.newCustomerReview.FileDetails.Data= Array.from(this.fileService.base64ToByteArray(base64FileString));
    // });
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
        next: (customerReview : any) => {
          const blobUrl = this.fileService.createBlobUrlFromByteArr(customerReview?.fileDetails.data, customerReview.fileDetails.contentType);
          customerReview.fileDetails.path = blobUrl ?  blobUrl : '';
          this.customerReviews.push(customerReview);
        },
        error: (err: any) => {
          console.log(err.message);
        }
      })
   
  }

  getComponentData(name: string) {
    if (name == this.selectedSection) {
      this.customerReviewService.getAllReviews().subscribe({
        next: (reviews: CustomerReview []) => {
          this.customerReviewHeaders = Object.keys(reviews[0]) as (keyof CustomerReview)[];
          reviews.map((cr: CustomerReview) => {
            const blobUrl = this.fileService.createBlobUrlFromByteArr(cr.fileDetails.data, cr.fileDetails.contentType);
            cr.fileDetails.path = blobUrl ? blobUrl : '';
            this.customerReviews.push(cr)
          })
        },
        error: ((error: any) => {
          console.log("Request failed!" + error);
        }), 
        complete: () => { 

        }
      })
    }
  }


  // submitCustomerReview(): void {
  //   const formData = new FormData();

  //   // Append file if selected
  //   if (this.selectedFile) {
  //     formData.append('file', this.selectedFile, this.selectedFile.name);
  //   }

  //   // Append CustomerReview properties as form data
  //   Object.entries(this.newCustomerReview).forEach(([key, value]) => {
  //     if (value !== undefined && value !== null) {
  //       formData.append(key, value instanceof Object ? JSON.stringify(value) : value.toString());
  //     }
  //   });

  //   // Use the service to send the data
  //   this.customerReviewService.createCustomerReviewWithFile(formData).subscribe(
  //     (response) => {
  //       console.log('Review created successfully:', response);
  //     },
  //     (error) => {
  //       console.error('Error creating review:', error);
  //     }
  //   );
  // }


  UpdateCustomerReview() {
    if (this.editingIndex === null || !this.selectedFile) {
      alert('Cannot update review. Please select a review and file.');
      return;
    }
    const idx = this.editingIndex;
    // this.reviewService
    //   .updateReview(idx, this.newCustomerReview).subscribe((review: CustomerReview) => {
    //     // console.log("Data save successfull!")
    //     this.customerReviews[idx] = review;
    //     this.resetForm();
    //   },
    //     (error: any) => {
    //       console.log("Failed! " + error);
    //     });
  }


  // modifyFilepath(review: CustomerReview){
  //   try{
  //     let fileDetails : FileDetails = JSON.parse(review.fileDetails)
  //     review.fileDetails = fileDetails.Path;
  //     return review; 
  //   }
  //   catch(ex){
  //     return review; 
  //   }
  // }


  editCustomerReview(index: number) {
    this.editingIndex = index;
    this.newCustomerReview = { ...this.customerReviews[index] };
  }

  // SaveData() {
  //   let idx = 0;
  //   this.CustomerReviewData.forEach(review => {
  //     this.customerReviewService.createReview(review).subscribe((data: any) => {
  //       idx++;
  //       if (idx === this.CustomerReviewData.length) {
  //         console.log("update success")
  //       }
  //     }, (error: any) => {
  //       console.log("Failed & " + error);
  //     });
  //   })
  //   //implement saving all at a time. 
  // }

  deleteCustomerReview(index: number) {
    this.customerReviews.splice(index, 1);
    this.resetForm();
  }

  resetForm() {
    this.newCustomerReview = {
      id: undefined,
      email: '',
      reviewDescription: '',
      reviewTime: '',
      name: '',
      fileDetailsId: undefined,
      fileDetails: {
        FileDetailsId: undefined,
        FileName: '',
        ContentType: '',
        Path: '',
        Data: '',

      },
      quotation: '',
      designation: '',
      address: '',
    };
    this.editingIndex = null;
  }

  // addTestimonial() {
  //   if (this.newTestimonial.imageSrc && this.newTestimonial.author && this.newTestimonial.description) {
  //     this.testimonials.push({ ...this.newTestimonial });
  //     this.resetForm();
  //   } else {
  //     alert('All fields are required.');
  //   }
  // }
  // deleteTestimonial(index: number) {
  //   this.testimonials.splice(index, 1);
  //   this.resetForm();
  // }
  // // Edit an existing testimonial
  // editTestimonial(index: number) {
  //   this.editingIndex = index;
  //   this.newTestimonial = { ...this.testimonials[index] };
  // }
  // // Update the edited testimonial
  // updateTestimonial() {
  //   if (this.editingIndex !== null) {
  //     this.testimonials[this.editingIndex] = { ...this.newTestimonial };
  //     this.resetForm();
  //   }
  // }
  // resetForm() {
  //   this.newTestimonial = { imageSrc: '', author: '', description: '' };
  //   this.editingIndex = null;
  // }

}
