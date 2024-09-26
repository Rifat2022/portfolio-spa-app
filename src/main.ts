import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import function to register Swiper custom elements
import { register as registerSwiperElements } from 'swiper/element/bundle';
// register Swiper custom elements
registerSwiperElements();
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
