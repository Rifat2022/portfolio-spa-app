import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ContactComponent } from "../Contact/contact.component";
import { NavLink } from "../Models/navLinks.model";
import { Services } from "../Models/services.model";
import { Counter } from "../Models/counter.model";
import { Portfolio } from "../Models/portfolio.model";
import { Testimonial } from "../Models/testimonial.model";
import { BlogPost } from "../Models/blog-post.model";
import { DataService } from "../Services/data.service";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  /**
   *
   */
  constructor(private dataService: DataService) {
    // super();    
  }
  navLinks: NavLink[] = this.dataService.getData().counter;
  services: Services[] = this.dataService.getData().counter.service;
  counters: Counter[] = this.dataService.getData().counter.counter; 
  workItems : Portfolio[] = this.dataService.getData().counter.portfolio;
  testimonials: Testimonial[] = this.dataService.getData().counter.testimonial; 
  blogPosts: BlogPost[] = this.dataService.getData().counter.blog_posts;
}
