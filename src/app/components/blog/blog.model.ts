import { FileDetails } from "../../Shared/models/FileDetails.model";

export interface    Blog {
    id:any; 
    title:string; 
    authorName:string;
    heading: string; 
    slug: string; 
    metaTitle: string; 
    metaDescription: string[]; 
    createdAt?: string;
    coverPhoto?: FileDetails;
    blogContents?: { 
        serial: number; 
        content: string; 
        uniqueId: string 
    } [];
    contentPhotos?: {  
        serialNo: number; 
        uniqueId:string; 
        file?: FileDetails 
    } [];
    blogVideo?: FileDetails;
}

export interface BlogCategory {
    categoryId: any; 
    name: string; 
    blogId:any; 
    blog: Blog
}
