import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { NavigationService } from '../../app/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage = '';
  returnUrl = '/perfil';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Obtener URL de retorno de los query params
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  onFormSubmit(credentials: { email: string; password: string }) {
    this.loading = true;
    this.errorMessage = '';

    // El backend espera username, pero el formulario puede enviar email
    // Usamos el campo email como username para compatibilidad
    this.authService.login({ username: credentials.email, password: credentials.password }).subscribe({
      next: (response) => {
        this.loading = false;
        // AuthResponse tiene token cuando es exitoso
        if (response.token) {
          // Navegación programática con estado
          this.navigationService.navigateWithState([this.returnUrl], {
            fromLogin: true,
            user: {
              id: response.userId,
              username: response.username,
              email: response.email,
              role: response.role
            }
          });
        } else {
          this.errorMessage = 'Error al iniciar sesión';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || error?.message || 'Credenciales inválidas. Verifica tu usuario y contraseña.';
        console.error('Login error:', error);
      }
    });
  }
}
