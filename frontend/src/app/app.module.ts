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

// Pages
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        FormInputComponent,
        LoginFormComponent,
        HomeComponent,
        LoginComponent
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