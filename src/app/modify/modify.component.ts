import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { Testimonial } from '../Models/testimonial.model';
import { CustomerReviewService } from '../Services/customer-review.service';
import { CustomerReview } from '../Models/customer-review.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  CustomerReviewData!: any[];
  CustomerReviewHeaders = Object.keys(this.CustomerReviewData[0]) as (keyof CustomerReview)[];
  // Form Inputs
  newTestimonial = { imageSrc: '', author: '', description: '' };
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
  editingIndex: number | null = null;
  headers = Object.keys(this.testimonials[0]) as (keyof Testimonial)[];
  section: any;
  selectedFile!: File;

  getComponentData(name: string) {
    switch (name) {
      case this.section.customerReview.name:
        this.customerReviewService.getReviews().subscribe((CustomerReviewData: CustomerReview[]) => {
          this.CustomerReviewData = CustomerReviewData;
          // this.CustomerReviewHeaders = Object.keys(this.CustomerReviewData[0]) as (keyof any)[];
          this.CustomerReviewHeaders = Object.keys(this.CustomerReviewData[0]) as (keyof CustomerReview)[];

        })
        break;
      default:
        alert("unknow modification selection")
    }
  }
  constructor(private route: ActivatedRoute, private customerReviewService: CustomerReviewService) {
    this.route.paramMap.subscribe((params) => {
      let componentName = params.get('clientsReview') || ''; // Retrieve the 'name' parameter
      this.getComponentData(componentName);
    });
  }






  // Add a new testimonial
  addTestimonial() {
    if (this.newTestimonial.imageSrc && this.newTestimonial.author && this.newTestimonial.description) {
      this.testimonials.push({ ...this.newTestimonial });
      this.resetForm();
    } else {
      alert('All fields are required.');
    }
  }
  addCustomerReview() {
    if (this.newCustomerReview.email && this.newCustomerReview.reviewDescription && this.newCustomerReview.reviewTime) {
      // Ensure required fields are filled
      this.CustomerReviewData.push({ ...this.newCustomerReview }); // Push a new CustomerReview object to the array
      this.resetForm(); // Reset the form after adding
    } else {
      alert('Email, Review Description, and Review Time are required.');
    }
  }

  // Edit an existing testimonial
  editTestimonial(index: number) {
    this.editingIndex = index;
    this.newTestimonial = { ...this.testimonials[index] };
  }

  editCustomerReview(index: number) {
    this.editingIndex = index;
    this.newCustomerReview = { ...this.CustomerReviewData[index] };
  }

  // Update the edited testimonial
  updateTestimonial() {
    if (this.editingIndex !== null) {
      this.testimonials[this.editingIndex] = { ...this.newTestimonial };
      this.resetForm();
    }
  }
  updateCustomerReview() {
    if (this.editingIndex !== null) {
      this.CustomerReviewData[this.editingIndex] = { ...this.newCustomerReview };
      this.resetForm();
    }
  }

  // Delete a testimonial
  deleteTestimonial(index: number) {
    this.testimonials.splice(index, 1);
    this.resetForm();
  }
  deleteCustomerReview(index: number) {
    this.CustomerReviewData.splice(index, 1);
    this.resetForm();
  }

  // Reset the form
  resetForm() {
    this.newTestimonial = { imageSrc: '', author: '', description: '' };
    this.editingIndex = null;
  }
  resetCustomerReviewForm() {
    this.newCustomerReview = {
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
    this.editingIndex = null;
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }
  

}
