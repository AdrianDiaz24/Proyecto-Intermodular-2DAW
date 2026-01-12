import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router) {}

  onFormSubmit(credentials: { email: string; password: string }) {
    console.log('Login credentials:', credentials);
    // Aquí se puede agregar la lógica de autenticación
    // Por ahora, redirigimos a perfil después de "iniciar sesión"
    setTimeout(() => {
      this.router.navigate(['/perfil']);
    }, 1000);
  }
}

