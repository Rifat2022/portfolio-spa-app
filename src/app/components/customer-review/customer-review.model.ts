export interface FileDetails {
    fileDetailsId?: number | undefined;
    fileName: string;
    contentType: string;
    path?: string;
    data?: any; 
  }
  
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