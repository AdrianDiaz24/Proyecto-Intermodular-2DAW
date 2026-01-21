import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode: boolean = false;

  constructor() {
    this.loadThemePreference();
  }

  /**
   * Cargar preferencia de tema
   * Prioridad: 1. localStorage  2. Sistema  3. Claro por defecto
   */
  loadThemePreference(): void {
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
   * Obtener el estado actual del tema
   */
  getIsDarkMode(): boolean {
    return this.isDarkMode;
  }

  /**
   * Establecer el modo oscuro
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkMode = isDark;
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

