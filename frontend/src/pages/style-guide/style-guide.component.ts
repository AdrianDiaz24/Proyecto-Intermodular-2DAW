import { Component } from '@angular/core';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent {
  selectOptions: SelectOption[] = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' }
  ];

  closedAlerts: Set<string> = new Set();

  onAlertClose(alertId: string): void {
    this.closedAlerts.add(alertId);
  }

  isAlertVisible(alertId: string): boolean {
    return !this.closedAlerts.has(alertId);
  }
}

