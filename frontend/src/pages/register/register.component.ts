import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 import { AuthService } from '../../app/services/auth.service';
import { NavigationService } from '../../app/services/navigation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;
  errorMessage = '';
  isDarkMode = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Detectar modo oscuro
    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  }

  onFormSubmit(credentials: { username: string; email: string; password: string; passwordConfirm: string }) {
    this.loading = true;
    this.errorMessage = '';

    // Validar que las contraseñas coincidan
    if (credentials.password !== credentials.passwordConfirm) {
      this.loading = false;
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        // AuthResponse tiene token cuando es exitoso (después del login automático)
        if (response && response.token) {
          // Navegación programática con estado
          this.navigationService.navigateWithState(['/perfil'], {
            fromRegister: true,
            user: {
              id: response.userId,
              username: response.username,
              email: response.email,
              role: response.role
            }
          });
        } else {
          // Si no hay token pero tampoco error, el registro fue exitoso pero sin login automático
          this.navigationService.navigateWithState(['/login'], {
            message: 'Cuenta creada exitosamente. Por favor inicia sesión.'
          });
        }
      },
      error: (error) => {
        this.loading = false;
        // Extraer mensaje de error específico del backend
        this.errorMessage = error?.error?.message || error?.message || 'Error al crear la cuenta. Intenta de nuevo.';
        console.error('Register error:', error);
      }
    });
  }
}
