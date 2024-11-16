export interface CustomerReview {
    id: number; // Primary key
    email: string; // Required and max length 50
    reviewDescription: string; // Required and max length 300
    reviewTime: Date; // Date of review
    photo?: string; // Optional photo URL
    name?: string; // Optional name
    quotation?: string; // Optional quotation
    designation?: string; // Optional designation
    address?: string; // Optional address
  }
  
