import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { PageNotFoundComponent } from './NotFound/page-not-found.component';
import { PortfolioDetailsComponent } from './Portfolio-Details/portfolio-details.component';
import { BlogComponent } from './Blog/blog/blog.component';
import { TestComponent } from './test/test.component';
import { CustomerReviewComponent } from './components/customer-review/customer-review.component';
import { ModifyComponent } from './Modify/parent/modify.component';
import { OfferedServicesComponent } from './components/offered-services/offered-services.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: 'modify', 
        component: ModifyComponent, 
        children: [
            {
                path: 'clientsReview',
                loadComponent: () =>
                    import('./Modify/CustomerReviewModify/customer-review-modify.component').then(m =>
                        m.CustomerReviewModifyComponent
                    )
            },
            {
                path: 'offeredServices',
                loadComponent: () =>
                    import('./Modify/OfferedServicesModify/offered-services-modify.component').then(m =>
                        m.OfferedServicesModifyComponent
                    )
            },
            {
                path: 'blog',
                loadComponent: () =>
                    import('./Modify/BlogModify/blog-modify.component').then(m =>
                        m.BlogModifyComponent
                    )
            }
        ]
    },
    
    { path: 'portfolio-details', component: PortfolioDetailsComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'test', component: TestComponent },
    { path: 'customer-reviews', component: CustomerReviewComponent },
    { path: 'offered-services', component: OfferedServicesComponent },

    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
    { path: '**', component: PageNotFoundComponent }  // Wildcard route for a 404 page
];

