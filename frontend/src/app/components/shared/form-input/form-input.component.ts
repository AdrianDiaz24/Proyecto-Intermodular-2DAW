import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

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
export class FormInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() id: string = '';

  value: string = '';

  constructor(public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    // Si no se proporciona ID, generarlo automáticamente
    if (!this.id) {
      this.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
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

