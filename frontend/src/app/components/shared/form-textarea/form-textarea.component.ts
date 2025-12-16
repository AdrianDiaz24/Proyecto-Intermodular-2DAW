import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() id: string = '';
  @Input() rows: number = 4;
  @Input() cols: number = 50;
  @Input() maxLength: number = 0;

  value: string = '';

  ngOnInit(): void {
    // Si no se proporciona ID, generarlo automáticamente
    if (!this.id) {
      this.id = `textarea-${Math.random().toString(36).substr(2, 9)}`;
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
    // Aquí se podría agregar lógica para deshabilitar el textarea
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

  get characterCount(): number {
    return this.value ? this.value.length : 0;
  }
}

