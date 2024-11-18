import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { Testimonial } from '../Models/testimonial.model';
import { CustomerReviewService } from '../Services/customer-review.service';
import { CustomerReview } from '../Models/customer-review.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../Services/file.service';
interface Testimonial {
  imageSrc: string;
  author: string;
  description: string;
}
@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CustomerReviewService],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent {
  testimonials = [
    {
      imageSrc: 'assets/img/testimonial-2.jpg',
      author: 'Xavi Alonso',
      description: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      imageSrc: 'assets/img/testimonial-4.jpg',
      author: 'Marta Socrate',
      description: 'Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  headers = Object.keys(this.testimonials[0]) as (keyof Testimonial)[];
  newTestimonial = { imageSrc: '', author: '', description: '' };

  CustomerReviewData!: any[];
  customerReviewHeaders!: any[];
  // Form Inputs
  editingIndex: number | null = null;
  selectedSection = {
    customerReview: 'clientsReview'
  }
  selectedFile!: File | null;
  newCustomerReview = {
    id: 0, // Default or placeholder for primary key
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
  constructor(private route: ActivatedRoute, private customerReviewService: CustomerReviewService, private fileService: FileService) {
    this.route.paramMap.subscribe((params) => {
      let componentName = params.get('clientsReview') || ''; // Retrieve the 'name' parameter
      this.getComponentData(componentName);
    });
  }

  getComponentData(name: string) {
    switch (name) {
      case this.selectedSection.customerReview:
        this.customerReviewService.getReviews().subscribe((CustomerReviewData: CustomerReview[]) => {
          this.customerReviewHeaders = Object.keys(this.CustomerReviewData[0]) as (keyof CustomerReview)[];
          this.CustomerReviewData = CustomerReviewData;
        }, (error)=> {
          console.log("Failed to fetch error && ", error)
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
        })
          .catch(error => {
            throw new Error(error);
          })
      }
      this.CustomerReviewData.push({ ...this.newCustomerReview });
      this.resetForm();
    }
  }




  editCustomerReview(index: number) {
    this.editingIndex = index;
    this.newCustomerReview = { ...this.CustomerReviewData[index] };
  }


  updateCustomerReview() {
    if (this.editingIndex !== null) {
      this.CustomerReviewData[this.editingIndex] = { ...this.newCustomerReview };
      this.resetForm();
    }
  }



  deleteCustomerReview(index: number) {
    this.CustomerReviewData.splice(index, 1);
    this.resetForm();
  }


  resetForm() {
    this.newTestimonial = { imageSrc: '', author: '', description: '' };
    this.editingIndex = null;
  }
  resetCustomerReviewForm() {
    this.newCustomerReview = {
      id: 0,
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
  onFileSelected(event: Event) {
    this.selectedFile = this.fileService.onOneFileSelected(event); 
  }

  addTestimonial() {
    if (this.newTestimonial.imageSrc && this.newTestimonial.author && this.newTestimonial.description) {
      this.testimonials.push({ ...this.newTestimonial });
      this.resetForm();
    } else {
      alert('All fields are required.');
    }
  }
  deleteTestimonial(index: number) {
    this.testimonials.splice(index, 1);
    this.resetForm();
  }
  // Edit an existing testimonial
  editTestimonial(index: number) {
    this.editingIndex = index;
    this.newTestimonial = { ...this.testimonials[index] };
  }
  // Update the edited testimonial
  updateTestimonial() {
    if (this.editingIndex !== null) {
      this.testimonials[this.editingIndex] = { ...this.newTestimonial };
      this.resetForm();
    }
  }

}
