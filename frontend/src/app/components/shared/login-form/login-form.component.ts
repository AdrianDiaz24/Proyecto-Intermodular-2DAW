import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() title: string = 'Inicia sesión';
  @Input() subtitle: string = 'Accede a tu cuenta de ReparaFácil';
  @Input() submitButtonText: string = 'Inicia sesión';
  @Input() registerLinkText: string = '¿No tienes cuenta? Regístrate aquí';
  @Output() formSubmit = new EventEmitter<any>();

  loginForm: FormGroup;
  submitted = false;
  passwordVisible = false;
  loading = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.value;

      // Emitir el evento con los datos del formulario
      this.formSubmit.emit(credentials);

      // Simular delay
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    }
  }

  resetForm() {
    this.submitted = false;
    this.passwordVisible = false;
    this.loginForm.reset();
  }
}

