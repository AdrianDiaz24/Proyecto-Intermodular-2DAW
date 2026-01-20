import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit(): void {
    this.loadThemePreference();
  }

  /**
   * Cargar preferencia de tema
   * Prioridad: 1. localStorage  2. Sistema  3. Claro por defecto
   */
  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      // Prioridad 1: Tema guardado
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Prioridad 2: Preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = prefersDark;
    }

    this.applyTheme();
  }

  /**
   * Alternar entre tema claro y oscuro
   */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  /**
   * Aplicar tema al documento y guardar en localStorage
   */
  private applyTheme(): void {
    const html = document.documentElement;

    if (this.isDarkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}

