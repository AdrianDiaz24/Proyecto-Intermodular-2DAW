import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}

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

