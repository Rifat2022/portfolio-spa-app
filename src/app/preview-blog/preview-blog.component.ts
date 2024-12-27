import { Component, OnInit } from '@angular/core';
import { Blog } from '../components/blog/blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-blog.component.html',
  styleUrl: './preview-blog.component.scss'
})
export class PreviewBlogComponent implements OnInit {
  blog!: Blog; 
  constructor(private router: Router, private route: ActivatedRoute){

  }
  ngOnInit() {
    // Retrieve blog data from router state
    const navigation = this.router.getCurrentNavigation();
    this.blog = navigation?.extras.state?.['blog'];
    if (!this.blog) {
      // If no blog data, navigate back or show an error
      this.router.navigate(['/modify/blog']);
    }
  }
}
