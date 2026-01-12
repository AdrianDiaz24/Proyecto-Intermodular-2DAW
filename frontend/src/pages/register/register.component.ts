import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private router: Router) {}

  onFormSubmit(credentials: { username: string; email: string; password: string; passwordConfirm: string }) {
    console.log('Register credentials:', credentials);
    // Aquí se puede agregar la lógica de registro
    // Por ahora, redirigimos a perfil después de "registrarse"
    setTimeout(() => {
      this.router.navigate(['/perfil']);
    }, 1000);
  }
}

