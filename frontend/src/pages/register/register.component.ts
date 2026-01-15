import { Component } from '@angular/core';
import { Router } from '@angular/router';
 import { AuthService } from '../../app/services/auth.service';
import { NavigationService } from '../../app/services/navigation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  onFormSubmit(credentials: { username: string; email: string; password: string; passwordConfirm: string }) {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(credentials.username, credentials.email, credentials.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          // Navegación programática con estado
          this.navigationService.navigateWithState(['/perfil'], {
            fromRegister: true,
            user: response.user
          });
        } else {
          this.errorMessage = response.error || 'Error al registrar';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error de conexión. Intenta de nuevo.';
        console.error('Register error:', error);
      }
    });
  }
}
