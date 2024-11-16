import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { PageNotFoundComponent } from './NotFound/page-not-found.component';
import { PortfolioDetailsComponent } from './Portfolio-Details/portfolio-details.component';
import { BlogComponent } from './Blog/blog/blog.component';
import { TestComponent } from './test/test.component';
import { ModifyComponent } from './modify/modify.component';

export const routes: Routes = [
    { path: 'index', component: HomeComponent },
    { path: 'portfolio-details', component: PortfolioDetailsComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'modify', component: ModifyComponent },
    { path: 'test', component: TestComponent },
    { path: '', redirectTo: '/index', pathMatch: 'full' }, // Default route
    { path: '**', component: PageNotFoundComponent }  // Wildcard route for a 404 page
];
