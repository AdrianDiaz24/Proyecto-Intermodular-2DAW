import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() id: string = '';
  @Input() showPasswordToggle: boolean = false;

  value: string = '';
  passwordVisible: boolean = false;
  currentType: string = 'text';

  ngOnInit(): void {
    // Si no se proporciona ID, generarlo automáticamente
    if (!this.id) {
      this.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.currentType = this.type;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.currentType = this.passwordVisible ? 'text' : 'password';
  }

  // Implementar ControlValueAccessor
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Aquí se podría agregar lógica para deshabilitar el input
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  onInput(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}

