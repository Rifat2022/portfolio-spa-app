import { Component } from '@angular/core';
import { BlogPostComponent } from "../single-blog/blog-post.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BlogPostComponent, CommonModule, SidebarComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  posts = [
    {
      title: 'Lorem ipsum dolor sit amet consec tetur adipisicing',
      author: 'Jason London',
      category: 'Web Design',
      imageUrl: 'assets/img/post-1.jpg',
      content: [
        'Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.',
        'Cras ultricies ligula sed magna dictum porta.',
        // More content paragraphs
      ],
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
      comments: 14
    },
    // More posts
  ];

  comments = [
    {
      author: 'Oliver Colmenares',
      date: '18 Sep 2017',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores reprehenderit...',
      avatar: 'assets/img/testimonial-2.jpg'
    },
    // More comments
    {
      author: 'Oliver Colmenares',
      date: '18 Sep 2017',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores reprehenderit...',
      avatar: 'assets/img/testimonial-4.jpg'
    },
    // More comments
    {
      author: 'Oliver Colmenares',
      date: '18 Sep 2017',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores reprehenderit...',
      avatar: 'assets/img/testimonial-2.jpg'
    },
    // More comments
    {
      author: 'Oliver Colmenares',
      date: '18 Sep 2017',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores reprehenderit...',
      avatar: 'assets/img/testimonial-4.jpg'
    },
    // More comments
  ];
}
