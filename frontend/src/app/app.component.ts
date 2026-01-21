import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proyecto-intermodular-2daw';

  // Inyectamos el ThemeService para que se inicialice al cargar la aplicación
  constructor(private themeService: ThemeService) {}
}

