import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { AddButtonComponent } from './components/shared/add-button/add-button.component';
import { ReportIncidenceComponent } from './components/shared/report-incidence/report-incidence.component';
import { CloseButtonComponent } from './components/shared/close-button/close-button.component';
import { BreadcrumbsComponent } from './components/shared/breadcrumbs/breadcrumbs.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';

// Pages
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { StyleGuideComponent } from '../pages/style-guide/style-guide.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { SearchResultsComponent } from '../pages/search-results/search-results.component';
import { AddProductComponent } from '../pages/search-results/add-product/add-product.component';
import { ProductComponent } from '../pages/product/product.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { AboutComponent } from '../pages/about/about.component';

// Services
import { AuthService, ProductService, NavigationService, BaseHttpService } from './services';

// Guards
import { AuthGuard, GuestGuard, UnsavedChangesGuard } from './guards';

// Resolvers
import { ProductResolver, UserResolver } from './resolvers';

// Interceptors
import { AuthInterceptor, ErrorInterceptor, LoggingInterceptor } from './interceptors';

@NgModule({
    declarations: [
        AppComponent,
        // Layout
        HeaderComponent,
        FooterComponent,
        // Shared Components
        FormInputComponent,
        LoginFormComponent,
        RegisterFormComponent,
        ButtonComponent,
        CardComponent,
        FormTextareaComponent,
        FormSelectComponent,
        FormCheckboxComponent,
        AlertComponent,
        AddButtonComponent,
        ReportIncidenceComponent,
        CloseButtonComponent,
        BreadcrumbsComponent,
        LoadingSpinnerComponent,
        // Pages
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        StyleGuideComponent,
        ProfileComponent,
        SearchResultsComponent,
        AddProductComponent,
        ProductComponent,
        NotFoundComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            // Estrategia de precarga: cargar todos los módulos lazy después del inicio
            preloadingStrategy: PreloadAllModules,
            // Habilitar scroll hacia arriba en cada navegación
            scrollPositionRestoration: 'enabled',
            // Anchor scrolling para fragments (#section)
            anchorScrolling: 'enabled',
            // Offset para el scroll (útil si hay header fijo)
            scrollOffset: [0, 64],
            // Habilitar tracing en desarrollo (descomentar para debug)
            // enableTracing: true,
            // Usar hash en URLs (descomentar si es necesario para hosting estático)
            // useHash: true,
            // Parsear query params de forma literal
            paramsInheritanceStrategy: 'always'
        }),
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [
        // Services
        AuthService,
        ProductService,
        NavigationService,
        BaseHttpService,
        // Guards
        AuthGuard,
        GuestGuard,
        UnsavedChangesGuard,
        // Resolvers
        ProductResolver,
        UserResolver,
        // HTTP Interceptors (el orden importa)
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoggingInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

