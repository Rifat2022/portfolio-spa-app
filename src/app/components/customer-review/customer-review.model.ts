import { FileDetails } from "../../Shared/models/FileDetails.model";

  
  export interface CustomerReview {
    id: number | undefined;
    email: string;
    reviewDescription: string;
    reviewTime: string;
    fileDetailsId: number | undefined;
    fileDetails: FileDetails;
    name?: string;
    quotation?: string;
    designation?: string;
    address?: string;
  }