import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { Testimonial } from '../Models/testimonial.model';
import { DataService } from '../Services/data.service';
import { CustomerReviewService } from '../Services/customer-review.service';
import { CustomerReview } from '../Models/customer-review.model';
import { FormsModule } from '@angular/forms';
interface Testimonial {
  imageSrc: string;
  author: string;
  description: string;
}
@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[CustomerReviewService],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent {
  customerReviewBucket!:CustomerReview[];
  // headers!:any; 
  // newTestimonial = { imageSrc: '', author: '', description: '' };
  // editingIndex: number | null = null;
  constructor(){
    // customerReviewService.getReviews().subscribe((reviewArr:CustomerReview[])=> {
    //   this.customerReviewBucket = reviewArr;
    //   this.headers = Object.keys(this.customerReviewBucket[0])
    // })
  }
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

  // Table Headers (Generated Dynamically)
  headers = Object.keys(this.testimonials[0]) as (keyof Testimonial)[];

  // Form Inputs
  newTestimonial = { imageSrc: '', author: '', description: '' };
  editingIndex: number | null = null;

  // Add a new testimonial
  addTestimonial() {
    if (this.newTestimonial.imageSrc && this.newTestimonial.author && this.newTestimonial.description) {
      this.testimonials.push({ ...this.newTestimonial });
      this.resetForm();
    } else {
      alert('All fields are required.');
    }
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

  // Delete a testimonial
  deleteTestimonial(index: number) {
    this.testimonials.splice(index, 1);
    this.resetForm();
  }

  // Reset the form
  resetForm() {
    this.newTestimonial = { imageSrc: '', author: '', description: '' };
    this.editingIndex = null;
  }
}
