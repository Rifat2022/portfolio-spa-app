import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from './blog.model';
export interface BlogDto {
  title: string; // Required
  coverPhoto?: File; // Optional
  slug?: string; // Optional
  metaTitle?: string; // Optional
  metaDescription?: string[]; // Optional
  blogContent: BlogContentDto[]; // Required
  contentPhotos?: ContentPhotoDto[]; // Optional
  contentVideo?: File; // Optional
}

export interface BlogContentDto {
  serial: number; // Required
  UniqueId?: string; // Optional
  content: string; // Required
}

export interface ContentPhotoDto {
  serial: number; // Required
  UniqueId?: string; // Optional
  file?: File; // Optional
}

@Injectable({
  providedIn: 'root'
})

export class BlogService {
  private apiUrl = 'http://localhost:5001/api/Blog';
  constructor(private http : HttpClient) { }
  // Fetch all blogs
  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Fetch a blog by ID
  getBlogById(blogId: number): Observable<Blog> {
    return this.http.get<any>(`${this.apiUrl}/${blogId}`);
  }

  // Create a new blog
  createBlog(blog: FormData ): Observable<Blog> {
    return this.http.post<any>(this.apiUrl, blog);
  }

  // Update an existing blog
  updateBlog(blogId: number, blog: FormData): Observable<Blog> {
    return this.http.put<any>(`${this.apiUrl}/${blogId}`, blog);
  }

  // Delete a blog
  deleteBlog(blogId: number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${blogId}`);
  }
}
