import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  onFormSubmit(credentials: { email: string; password: string }) {
    console.log('Login credentials:', credentials);
    // Aquí se puede agregar la lógica de autenticación
  }
}

