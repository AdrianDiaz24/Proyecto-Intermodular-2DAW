import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { StyleGuideComponent } from '../pages/style-guide/style-guide.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { SearchResultsComponent } from '../pages/search-results/search-results.component';
import { ProductComponent } from '../pages/product/product.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'perfil', component: ProfileComponent },
    { path: 'buscar', component: SearchResultsComponent },
    { path: 'producto/:id', component: ProductComponent },
    { path: 'style-guide', component: StyleGuideComponent },
    { path: '**', redirectTo: '' }
];
