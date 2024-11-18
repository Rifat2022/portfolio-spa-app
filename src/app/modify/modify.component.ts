import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerReviewService } from '../Services/customer-review.service';
import { CustomerReview } from '../Models/customer-review.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { FileService } from '../Services/file.service';
import { filter } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CustomerReviewService, ],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent {

  CustomerReviewData!: any[];
  customerReviewHeaders!: any[];
  // Form Inputs
  editingIndex: number | null = null;
  selectedSection = {
    customerReview: 'clientsReview'
  }
  selectedFile!: File | null;
  newCustomerReview : CustomerReview = {
    email: '', // Empty string as it's required
    reviewDescription: '', // Empty string as it's required
    reviewTime: new Date(), // Current date as a placeholder
    photo: '', // Optional property
    name: undefined, // Optional property
    quotation: undefined, // Optional property
    designation: undefined, // Optional property
    address: undefined // Optional property
  };

  /**Constructor*/
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerReviewService: CustomerReviewService,
    private fileService: FileService) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.route.paramMap.subscribe((params) => {
        const componentName = params.get('clientsReview') || ''; // Retrieve the 'name' parameter
        this.getComponentData(componentName);
      });
    });

  }

  getComponentData(name: string) {
    this.CustomerReviewData = []; 
    switch (name) {
      case this.selectedSection.customerReview:
        this.customerReviewService.getReviews().subscribe((CustomerReviewData: CustomerReview[]) => {
          this.customerReviewHeaders = Object.keys(CustomerReviewData[0]) as (keyof CustomerReview)[];
          this.CustomerReviewData = CustomerReviewData;
        }, (error) => {
          console.log("Failed to fetch error && ", error)
          // setTimeout(() => {
          //   this.router.navigate(['home'])
          // }, 1000);
        })
        break;
      default:
        break;
    }
  }
  // Add a new testimonial

  addCustomerReview() {
    if (this.newCustomerReview.email && this.newCustomerReview.reviewDescription && this.newCustomerReview.reviewTime) {
      /** If there is an image selected then the image will also be added or not */
      if (this.selectedFile) {
        this.fileService.fileToBase64String(this.selectedFile).then((base64String: string) => {
          this.newCustomerReview.photo = base64String;
          this.customerReviewService.createReview(this.newCustomerReview).
          subscribe((data: any) => {
            console.log("Data save successfull!")
          }, 
          (error: any) => {
            console.log("Failed! " + error);
          });
        })
        .catch(error => {
          console.log(error)
        })
      }
      this.CustomerReviewData.push({ ...this.newCustomerReview });
      this.resetNewCustomerReviewObject();
    }
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


  editCustomerReview(index: number) {
    this.editingIndex = index;
    this.newCustomerReview = { ...this.CustomerReviewData[index] };
  }


  updateCustomerReview() {
    if (this.editingIndex !== null) {
      this.CustomerReviewData[this.editingIndex] = { ...this.newCustomerReview };
      this.resetNewCustomerReviewObject();
    }
  }



  deleteCustomerReview(index: number) {
    this.CustomerReviewData.splice(index, 1);
    this.resetNewCustomerReviewObject();
  }
  resetNewCustomerReviewObject() {
    this.newCustomerReview = {
      email: '',
      reviewDescription: '',
      reviewTime: new Date(),
      photo: '',
      name: undefined,
      quotation: undefined,
      designation: undefined,
      address: undefined
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
