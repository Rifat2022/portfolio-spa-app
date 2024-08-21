import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home/home.component';
import { PageNotFoundComponent } from './NotFound/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'index', component: HomeComponent },
    { path: '', redirectTo: '/index', pathMatch: 'full' }, // Default route
    { path: '**', component: PageNotFoundComponent }  // Wildcard route for a 404 page
];
