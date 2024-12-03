import { FileDetails } from "../../Shared/models/FileDetails.model";

export interface Blog {
    blogId:any; 
    title:string; 
    coverPhoto: FileDetails; 
    heading: string; 
    slug: string; 
    metaTitle: string; 
    metaDescription: string[]; 
    blogContent: { serial: number; content: string } []; 
    contentPhotos?: {  serial: number; file: File } [];
    contentVideo?: FileDetails;

    creationTime?: string; 
    editTime?: string; 
    publishTime?:string; 
}

export interface BlogCategory {
    categoryId: any; 
    name: string; 
    blogId:any; 
    blog: Blog
}
