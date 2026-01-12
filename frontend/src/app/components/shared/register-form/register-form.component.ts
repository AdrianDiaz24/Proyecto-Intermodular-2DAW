import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  @Input() title: string = 'Crea tu cuenta';
  @Input() subtitle: string = 'Únete a la comunidad de ReparaFácil';
  @Input() submitButtonText: string = 'Registrarse';
  @Input() loginLinkText: string = '¿Ya tienes cuenta? Inicia sesión aquí';
  @Output() formSubmit = new EventEmitter<any>();

  registerForm: FormGroup;
  submitted = false;
  passwordVisible = false;
  passwordConfirmVisible = false;
  loading = false;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (!password || !passwordConfirm) {
      return null;
    }

    return password.value === passwordConfirm.value ? null : { passwordMismatch: true };
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get passwordConfirm() {
    return this.registerForm.get('passwordConfirm');
  }

  get terms() {
    return this.registerForm.get('terms');
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePasswordConfirmVisibility() {
    this.passwordConfirmVisible = !this.passwordConfirmVisible;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.loading = true;
      const credentials = this.registerForm.value;

      this.formSubmit.emit(credentials);

      setTimeout(() => {
        this.loading = false;
      }, 1500);
    }
  }

  resetForm() {
    this.submitted = false;
    this.passwordVisible = false;
    this.passwordConfirmVisible = false;
    this.registerForm.reset();
  }
}
