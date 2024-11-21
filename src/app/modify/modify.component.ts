import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerReviewService } from '../Services/customer-review.service';
import { CustomerReview } from '../Models/customer-review.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../Services/file.service';
import { error } from 'console';
import { FileDetails } from '../Models/FileDetails';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CustomerReviewService,],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})

export class ModifyComponent {

  rootDirectory : string = "D:/Personal/Task/Project/Portfolio_web_api_app/Portfolio_backend/Porfolio/wwwroot/"; 
  subDirectory: string = "assets/images/";
  newCustomerReview: CustomerReview = {
    email: '',
    reviewDescription: '',
    reviewTime: new Date(), 
    name: '',
    fileDetails: '',
    quotation: '',
    designation: '',
    address: '',
  };

  reviews: CustomerReview[] = [];
  selectedSection = { customerReview: 'clientsReview' };
  customerReviewHeaders!: (keyof CustomerReview)[];
  editingIndex: number | null = null;
  selectedFile!: File | null;
  /**Constructor*/
  constructor(
    private router: Router,
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

  getComponentData(name: string) {
    this.reviews = [];
    // let newReviews: CustomerReview[]; 
    if (name === this.selectedSection.customerReview) {
      this.customerReviewService.getReviews().subscribe({
        next: (reviews: CustomerReview[]) => {
          if (reviews.length > 0) {
            reviews.map( review => {
              // let fileDetails = JSON.parse(review.fileDetails); 
              // const path = this.rootDirectory + this.subDirectory + fileDetails.path; 
              // review.fileDetails = path;
              let modifiedReview = this.modifyFilepath(review); 
              if(modifiedReview )this.reviews.push(modifiedReview)
                else throw new Error(); 
            })            
            this.customerReviewHeaders = Object.keys(reviews[0]) as (keyof CustomerReview)[];
            // this.reviews = [...reviews];
          }
        }, error: ((error: any) => {
          console.log("Request failed!" + error);
        }), complete: () => {}
      })
    }
  }
  createCustomerReview() {
    if (!this.selectedFile) {
      alert('Please select a file!');
      return;
    }
    let fileDetails = {
      FileName: this.selectedFile.name,
      ContentType: this.selectedFile.type,
      Path: ""
    }
    this.newCustomerReview.fileDetails = JSON.stringify(fileDetails);
    this.customerReviewService.createReview(this.newCustomerReview, this.selectedFile).subscribe({
      next: (response: CustomerReview) => {
        let modifiedResponse = this.modifyFilepath(response); 
        if(modifiedResponse) 
          this.reviews.push(modifiedResponse)
        else 
          throw new Error();
        this.resetForm();
        alert('Customer review added successfully!');
      },
      error: (error: any) => {
        console.error('Error adding review:', error);
        alert('Failed to add review.');
      },
    });
  }
  modifyFilepath(review: CustomerReview){
    try{
      let fileDetails : FileDetails = JSON.parse(review.fileDetails)
      review.fileDetails = fileDetails.Path;
      return review; 
    }
    catch(ex){
      return review; 
    }
  }
  // After clicking the edit button in the table 
  editCustomerReview(index: number) {
    this.editingIndex = index;
    this.newCustomerReview = { ...this.reviews[index] };
  }


  updateCustomerReview() {
    if (this.editingIndex === null || !this.selectedFile) {
      alert('Cannot update review. Please select a review and file.');
      return;
    }
    const idx = this.editingIndex;
    this.customerReviewService
      .updateReview(idx, this.newCustomerReview).subscribe((review: CustomerReview) => {
        // console.log("Data save successfull!")
        this.reviews[idx] = review;
        this.resetForm();
      },
        (error: any) => {
          console.log("Failed! " + error);
        });

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
    this.reviews.splice(index, 1);
    this.resetForm();
  }
  resetForm() {
    this.newCustomerReview = {
      email: '',
      reviewDescription: '',
      reviewTime: new Date(),
      name: '',
      fileDetails: '',
      quotation: '',
      designation: '',
      address: '',
    };
    this.editingIndex = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = this.fileService.onOneFileSelected(event);
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
