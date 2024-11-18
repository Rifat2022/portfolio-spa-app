import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  AfterViewInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
  HostListener,
  Renderer2,
  OnDestroy,
} from "@angular/core";
import { ContactComponent } from "../Contact/contact.component";
import { NavLink } from "../Models/navLinks.model";
import { Services } from "../Models/services.model";
import { Counter } from "../Models/counter.model";
import { Portfolio } from "../Models/portfolio.model";
import { Testimonial } from "../Models/testimonial.model";
import { BlogPost } from "../Models/blog-post.model";
import { DataService } from "../Services/data.service";
import Typed from 'typed.js';
import GLightbox from 'glightbox';
import { ROUTER_CONFIGURATION, Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
declare var _: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ContactComponent, RouterModule, RouterOutlet, RouterLink],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { ngSkipHydration: 'true' },
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  navLinks!: NavLink[]
  services!: Services[]
  counters!: Counter[]
  workItems !: Portfolio[]
  testimonials!: Testimonial[]
  blogPosts!: BlogPost[]
  isDrawerOpen: boolean = false;

  @ViewChild("testimonialSwiperContainer", { static: false }) testimonialSwiperContainerRef!: ElementRef;
  @ViewChild("header", { static: false }) headerElemRef!: ElementRef;
  @ViewChild("backToTop", { static: false }) backToTopRef!: ElementRef;
  @ViewChild("offcanvas", { static: false }) offcanvas!: ElementRef;

  offcanvasLabel: string = '';
  private typed: Typed | null = null;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer2: Renderer2,
    private elRef: ElementRef,
    private router: Router
  ) {

  }


  ngOnInit(): void {
    var me = this;
    me.setDataToComponent(JSON.parse(JSON.stringify(this.dataService.getData())));
  }

  ngAfterViewInit(): void {
    var me = this;
    if (isPlatformBrowser(me.platformId)) {
      me.setHomeComponentEvents();
    }
    // let canvasElem = this.offcanvas.nativeElement ;
  }
  ngOnDestroy(): void {
    var me = this;
    me.stop();
  }
  @HostListener('window:scroll', []) onWindowScroll() {
    var me = this;
    me.toggleHeaderScrolled();
    me.toggleBackToTopActiveClass();
  }
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.closeDrawer();
  }
  navigateToModifyComponent(event: any) {
    const editSection: string = event.currentTarget.parentElement.attributes.id.value;
    this.router.navigate(['modify', editSection]);
  }

  openOffcanvas(): void {
    this.renderer2.addClass(this.offcanvas.nativeElement, 'show');
  }

  closeOffcanvas(): void {
    this.renderer2.removeClass(this.offcanvas.nativeElement, 'show');
  }
  openDrawer(): void {
    this.isDrawerOpen = true;
  }
  closeDrawer(): void {
    this.isDrawerOpen = false;
  }
  private setHomeComponentEvents() {
    var me = this;
    me.triggerslideNext();
    me.setScrollToHashElement();
    me.scrollToHeaderElementFromTopButton();
    me.startIntroTypedEffect();
    // me.initializeGlightBox();
  }
  private initializeGlightBox() {
    const GLightbox = require('glightbox'); // Loads GLightbox only in the browser
    const lightbox = GLightbox({
      selector: '.glightbox'
    });
  }
  private start(element: HTMLElement, options: any) {
    var me = this;
    me.typed = new Typed(element, options);
  }

  private stop() {
    var me = this;
    if (me.typed) {
      me.typed.destroy();
      me.typed = null;
    }
  }
  private startIntroTypedEffect() {
    var me = this;
    const typedElement = me.elRef.nativeElement.querySelector('.typed');
    if (typedElement) {

      let typed_strings = "Web Developer , Freelancer, Entrepreneur, Blogger";
      // let typed_strings = typedElement.getAttribute('data-typed-items')
      const role: string[] = (typed_strings) ? typed_strings.split(',') : [];
      if (role.length > 0) {
        const options: any = {
          strings: role,
          loop: true,
          typeSpeed: 120,
          backSpeed: 70,
          backDelay: 2500
        }
        me.start(typedElement, options);
      }
    }
  }
  private scrollToHeaderElementFromTopButton() {
    var me = this;
    const backToTopElementRef: HTMLElement = me.backToTopRef.nativeElement as HTMLElement;
    me.renderer2.listen(backToTopElementRef, "click", () => {
      me.scrollToHeaderElement(backToTopElementRef)
    })
  }
  private toggleBackToTopActiveClass() {
    var me = this;
    const backToTop = me.backToTopRef.nativeElement;
    if (window.scrollY > 100) {
      backToTop.classList.add('active')
    } else {
      backToTop.classList.remove('active')
    }
  }
  private toggleHeaderScrolled() {
    var me = this;
    const header = me.headerElemRef.nativeElement;
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
  private scrollToHeaderElement(el: HTMLElement): void {
    // const header = document.querySelector('#header') as HTMLElement;
    var me = this;
    const header = me.headerElemRef.nativeElement as HTMLElement;
    let offset = header.offsetHeight;

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16;
    }

    // const elementPos = element.offsetTop;

    window.scrollTo({
      top: el.offsetTop - offset,
      behavior: 'smooth'
    });
  }
  private on(type: string, el: string, callback: any,
    all: boolean = false): void {
    var me = this;
    let selectEl!: any;
    if (all) {
      selectEl = me.renderer2.selectRootElement(el, true).querySelectorAll(el) as NodeListOf<Element>
      selectEl.forEach((e: Element) => me.renderer2.listen(e, type, callback));
    } else {
      selectEl = me.renderer2.selectRootElement(el, true).querySelector(el) as Element;
      me.renderer2.listen(selectEl, type, callback);
    }

  }


  private setDataToComponent(Data: any) {
    var me = this;
    me.navLinks = Data.navLinks;
    me.services = Data.services;
    me.counters = Data.counters;
    me.workItems = Data.workItems;
    me.testimonials = Data.testimonials;
    me.blogPosts = Data.blogPosts;
  }
  private triggerslideNext() {
    var me = this;
    if (me.testimonialSwiperContainerRef.nativeElement) {
      setTimeout(() => { me.testimonialSwiperContainerRef.nativeElement.swiper.slideNext() }, 5000);
    }
  }

  private setScrollToHashElement() {
    var me = this;
    const hash = window.location.hash; // Still use window to get the hash
    if (hash) {
      const elementId = hash.substring(1); // Remove the '#' character
      const element = me.renderer2.selectRootElement(`#${elementId}`, true); // Use Renderer2
      if (element) me.scrollToHeaderElement(element);
    }
  }
  private addClassToElements(elementRef: any[], cssClassName: string) {
    elementRef.forEach(element => {
      element.classList.classList.add(cssClassName)
    });
  }
  private removeClassFromElements(elementRef: any[], cssClassName: string) {
    elementRef.forEach(element => {
      element.classList.remove(cssClassName)
    });

  }


}
