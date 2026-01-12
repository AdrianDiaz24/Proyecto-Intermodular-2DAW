import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  onFormSubmit(credentials: { username: string; email: string; password: string; passwordConfirm: string }) {
    console.log('Register credentials:', credentials);
    // Aquí se puede agregar la lógica de registro
  }
}

