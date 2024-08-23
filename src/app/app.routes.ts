import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home/home.component';
import { PageNotFoundComponent } from './NotFound/page-not-found/page-not-found.component';
import { PortfolioDetailsComponent } from './Portfolio-Details/portfolio-details/portfolio-details.component';
import { SingleBlogComponent } from './Blog/single-blog/single-blog.component';

export const routes: Routes = [
    { path: 'index', component: HomeComponent },
    { path: 'portfolio-details', component: PortfolioDetailsComponent },
    { path: 'blog-single', component: SingleBlogComponent },
    { path: '', redirectTo: '/index', pathMatch: 'full' }, // Default route
    { path: '**', component: PageNotFoundComponent }  // Wildcard route for a 404 page
];
