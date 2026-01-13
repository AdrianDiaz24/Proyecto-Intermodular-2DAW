import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  @Output() close = new EventEmitter<void>();

  productForm = {
    name: '',
    brand: '',
    model: '',
    file: null as File | null,
    fileName: '',
    // Step 2 - Optional fields
    weight: '',
    width: '',
    length: '',
    height: '',
    consumption: '',
    characteristics: ''
  };

  submitted = false;
  currentStep = 1; // 1 = campos obligatorios, 2 = campos opcionales

  onNext(): void {
    this.submitted = true;

    // Validar campos obligatorios
    if (this.productForm.name.trim() && this.productForm.brand.trim()) {
      this.submitted = false;
      this.currentStep = 2;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.productForm.file = file;
      this.productForm.fileName = file.name;
    }
  }

  onBack(): void {
    this.currentStep = 1;
  }

  onSubmit(): void {
    console.log('Producto añadido:', this.productForm);
    // Aquí se enviaría a un servicio
    this.resetForm();
    this.closeModal();
  }

  resetForm(): void {
    this.productForm = {
      name: '',
      brand: '',
      model: '',
      file: null,
      fileName: '',
      weight: '',
      width: '',
      length: '',
      height: '',
      consumption: '',
      characteristics: ''
    };
    this.submitted = false;
    this.currentStep = 1;
  }

  closeModal(): void {
    this.close.emit();
  }
}

