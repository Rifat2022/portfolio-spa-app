import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { PageNotFoundComponent } from './NotFound/page-not-found.component';
import { PortfolioDetailsComponent } from './Portfolio-Details/portfolio-details.component';
import { BlogComponent } from './Blog/blog/blog.component';
import { TestComponent } from './test/test.component';
import { ModifyComponent } from './modify/modify.component';
import { CustomerReviewComponent } from './components/customer-review/customer-review.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: 'modify/:clientsReview', // Corrected path
        loadComponent: () =>
            import('./modify/modify.component').then(m =>
                m.ModifyComponent
            )
    },
    { path: 'portfolio-details', component: PortfolioDetailsComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'test', component: TestComponent },
    { path: 'cutomer-reviews', component: CustomerReviewComponent },

    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
    { path: '**', component: PageNotFoundComponent }  // Wildcard route for a 404 page
];

