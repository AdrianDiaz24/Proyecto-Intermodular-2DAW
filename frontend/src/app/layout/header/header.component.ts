import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  isSearchPage = false;
  searchQuery: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Detectar si estamos en la página de búsqueda
    this.router.events.subscribe(() => {
      this.isSearchPage = this.router.url.includes('/buscar');
    });

    // Obtener el parámetro de búsqueda si existe
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: this.searchQuery } });
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}

