import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';

// Layout Components
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

// Shared Components
import { FormInputComponent } from './components/shared/form-input/form-input.component';
import { LoginFormComponent } from './components/shared/login-form/login-form.component';
import { RegisterFormComponent } from './components/shared/register-form/register-form.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { CardComponent } from './components/shared/card/card.component';
import { FormTextareaComponent } from './components/shared/form-textarea/form-textarea.component';
import { FormSelectComponent } from './components/shared/form-select/form-select.component';
import { FormCheckboxComponent } from './components/shared/form-checkbox/form-checkbox.component';
import { AlertComponent } from './components/shared/alert/alert.component';

// Pages
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { StyleGuideComponent } from '../pages/style-guide/style-guide.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { SearchResultsComponent } from '../pages/search-results/search-results.component';
import { AddProductComponent } from '../pages/search-results/add-product/add-product.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        FormInputComponent,
        LoginFormComponent,
        RegisterFormComponent,
        ButtonComponent,
        CardComponent,
        FormTextareaComponent,
        FormSelectComponent,
        FormCheckboxComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        StyleGuideComponent,
        ProfileComponent,
        SearchResultsComponent,
        AddProductComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot(appRoutes),
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }