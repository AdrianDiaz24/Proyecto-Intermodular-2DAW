import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';

// 1. IMPORTA TUS COMPONENTES
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from '../pages/home/home.component';
import { FooterComponent } from './layout/footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        // 2. DECLÁRALOS AQUÍ (Si no están aquí, fallará)
        HeaderComponent,
        HomeComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }