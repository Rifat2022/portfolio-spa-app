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
  customerReviews: CustomerReview[] = []
  files: FileDetails[] = []
  selectedFile!: File;
  selectedSection = 'clientsReview';
  editingIndex!: any;
  previewKey: string = "fileDetails"
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
          let ncr = this.setFilePath(customerReview)
          this.customerReviews.push(ncr);
          this.resetForm();
        },
        error: (err: any) => {
          console.log(err.message);
        }
      })

  }

  getComponentData(name: string) {
    if (name == this.selectedSection) {
      this.customerReviewService.getAllReviews().subscribe({
        next: (reviews: CustomerReview[]) => {
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


  editCustomerReview(index: number) {
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
        next: (ucr: CustomerReview) => {
          let nucr = this.setFilePath(ucr); 
          //update the customerReviews
          this.customerReviews[this.editingIndex] = nucr;
        },
        error: (err: any) => {
          console.log("updated request failed!" + err.message);
        },
        complete: () => {
          console.log("updated request completed")
        }
      })
    }

  }

  setFilePath(cr: CustomerReview):CustomerReview {
    //make the file renderable
    const blobUrl = this.fileService.createBlobUrlFromByteArr(cr.fileDetails.data, cr.fileDetails.contentType);
    cr.fileDetails.path = blobUrl ? blobUrl : '';
    return cr; 
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
