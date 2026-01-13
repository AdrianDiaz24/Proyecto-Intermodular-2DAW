import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-incidence',
  templateUrl: './report-incidence.component.html',
  styleUrls: ['./report-incidence.component.scss']
})
export class ReportIncidenceComponent {
  @Input() productName: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  reportForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder) {
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', [Validators.required]],
      severity: ['medium', [Validators.required]]
    });
  }

  get title() {
    return this.reportForm.get('title');
  }

  get description() {
    return this.reportForm.get('description');
  }

  get category() {
    return this.reportForm.get('category');
  }

  get severity() {
    return this.reportForm.get('severity');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reportForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = {
      ...this.reportForm.value,
      productName: this.productName
    };

    this.formSubmit.emit(formData);

    // Simular envío (en producción sería una llamada HTTP)
    setTimeout(() => {
      this.loading = false;
      this.closeModal();
    }, 1500);
  }

  closeModal(): void {
    this.close.emit();
  }
}

