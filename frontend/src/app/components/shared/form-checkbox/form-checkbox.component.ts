import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckboxComponent),
      multi: true
    }
  ]
})
export class FormCheckboxComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';

  isChecked: boolean = false;

  ngOnInit(): void {
    // Si no se proporciona ID, generarlo automáticamente
    if (!this.id) {
      this.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.isChecked = this.checked;
  }

  // Implementar ControlValueAccessor
  writeValue(value: any): void {
    this.isChecked = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  onCheckboxChange(event: any): void {
    this.isChecked = event.target.checked;
    this.onChange(this.isChecked);
  }

  onBlur(): void {
    this.onTouched();
  }
}

