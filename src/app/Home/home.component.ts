import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, ContentChild, ElementRef, effect, AfterViewInit, ViewChild, } from "@angular/core";
import { ContactComponent } from "../Contact/contact.component";
import { NavLink } from "../Models/navLinks.model";
import { Services } from "../Models/services.model";
import { Counter } from "../Models/counter.model";
import { Portfolio } from "../Models/portfolio.model";
import { Testimonial } from "../Models/testimonial.model";
import { BlogPost } from "../Models/blog-post.model";
import { DataService } from "../Services/data.service";
import { SwiperContainer } from 'swiper/element/bundle';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit {
  navLinks!: NavLink[] 
  services!: Services[] 
  counters!: Counter[] 
  workItems !: Portfolio[] 
  testimonials!: Testimonial[] 
  blogPosts!: BlogPost[] 

  constructor(private dataService: DataService) {}
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    const Data: any = JSON.parse(JSON.stringify(this.dataService.getData())); 
    this.navLinks= Data.navLinks ; 
    this.services= Data.services ; 
    this.counters= Data.counters ; 
    this.workItems= Data.workItems ; 
    this.testimonials= Data.testimonials ; 
    this.blogPosts= Data.blogPosts ;     
  }
  
  
}
