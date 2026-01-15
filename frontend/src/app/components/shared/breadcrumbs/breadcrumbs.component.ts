import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService, Breadcrumb } from '../../../services/navigation.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.subscription = this.navigationService.breadcrumbs$.subscribe(
      (breadcrumbs: Breadcrumb[]) => {
        // Siempre añadir "Inicio" como primer elemento
        this.breadcrumbs = [
          { label: 'Inicio', url: '/' },
          ...breadcrumbs
        ];
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateTo(url: string): void {
    this.navigationService.navigateTo(url);
  }

  isLastBreadcrumb(index: number): boolean {
    return index === this.breadcrumbs.length - 1;
  }
}

