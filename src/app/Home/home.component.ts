import { CommonModule, isPlatformBrowser } from "@angular/common";
import { 
  Component, 
  Input, 
  OnInit, 
  CUSTOM_ELEMENTS_SCHEMA, 
  ContentChild, 
  ElementRef, 
  effect, 
  AfterViewInit, 
  ViewChild, 
  ViewContainerRef,
   PLATFORM_ID,
   Inject, 
} from "@angular/core";
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
  host: {ngSkipHydration: 'true'},
})
export class HomeComponent implements OnInit, AfterViewInit {
  navLinks!: NavLink[] 
  services!: Services[] 
  counters!: Counter[] 
  workItems !: Portfolio[] 
  testimonials!: Testimonial[] 
  blogPosts!: BlogPost[] 
  @ViewChild("testimonialSwiperContainer", {static: false}) testimonialSwiperContainerRef!: ElementRef;

  constructor(private dataService: DataService, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    this.setDataToComponent(JSON.parse(JSON.stringify(this.dataService.getData())));          
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setHomeComponentEvents();
    }
  }
  private setDataToComponent(Data: any){
    this.navLinks= Data.navLinks ; 
    this.services= Data.services ; 
    this.counters= Data.counters ; 
    this.workItems= Data.workItems ; 
    this.testimonials= Data.testimonials ; 
    this.blogPosts= Data.blogPosts ;
  }
  private triggerslideNext(container: any){
    if(container){
      setInterval(()=> {
        container.swiper.slideNext(); 
      },5000); 
    }else{
      throw new Error("swiper-container error!"); 
    }
  }
  private setHomeComponentEvents() {
    this.triggerslideNext(this.testimonialSwiperContainerRef.nativeElement);    
  }  
  
}
