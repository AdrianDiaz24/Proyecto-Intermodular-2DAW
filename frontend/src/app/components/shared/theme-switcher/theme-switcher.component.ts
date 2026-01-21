import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.getIsDarkMode();
  }

  /**
   * Alternar entre tema claro y oscuro
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.getIsDarkMode();
  }
}

