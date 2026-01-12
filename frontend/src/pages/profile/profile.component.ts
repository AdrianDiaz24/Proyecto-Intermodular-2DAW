import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // Información del usuario (esto vendrá de un servicio en el futuro)
  user = {
    username: 'juan_perez',
    email: 'juan@example.com',
    phone: '+34 612 345 678',
    joinDate: '2026-01-10',
    profileImage: 'assets/icons/UsuarioBlanco.png'
  };

  editMode = false;
  formData = { ...this.user };
  isCardExpanded = false;
  isSecurityCardExpanded = false;
  isIncidenciesCardExpanded = false;
  newPassword = '';
  confirmPassword = '';
  passwordChangeMessage = '';
  passwordChangeError = false;

  // Incidencias creadas
  incidencies = [
    {
      id: 1,
      appliance: 'Lavadora Samsung',
      title: 'Motor hace ruido extraño',
      date: '2026-01-10'
    },
    {
      id: 2,
      appliance: 'Refrigerador LG',
      title: 'No enfría correctamente',
      date: '2026-01-08'
    },
    {
      id: 3,
      appliance: 'Horno Bosch',
      title: 'Puerta atascada',
      date: '2026-01-05'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    // Si no, redirigir a login
  }

  toggleEditMode(): void {
    if (this.editMode) {
      // Guardar cambios
      this.user = { ...this.formData };
      console.log('Perfil actualizado:', this.user);
    }
    this.editMode = !this.editMode;
  }

  cancelEdit(): void {
    this.formData = { ...this.user };
    this.editMode = false;
  }

  logout(): void {
    // Aquí se puede agregar la lógica de logout
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  updateField(field: string, value: string): void {
    this.formData[field as keyof typeof this.formData] = value;
  }

  toggleCardExpanded(): void {
    this.isCardExpanded = !this.isCardExpanded;
  }

  toggleSecurityCardExpanded(): void {
    this.isSecurityCardExpanded = !this.isSecurityCardExpanded;
  }

  toggleIncidenciesCardExpanded(): void {
    this.isIncidenciesCardExpanded = !this.isIncidenciesCardExpanded;
  }

  goToIncidency(incidencyId: number): void {
    // Navegar a la página de detalles de la incidencia
    console.log('Ir a la incidencia:', incidencyId);
    // this.router.navigate(['/incidencia', incidencyId]);
  }

  changePassword(): void {
    this.passwordChangeError = false;
    this.passwordChangeMessage = '';

    // Validar que las contraseñas no estén vacías
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'Por favor, completa todos los campos';
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.newPassword !== this.confirmPassword) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validar la longitud mínima
    if (this.newPassword.length < 6) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // Si todas las validaciones pasaron
    this.passwordChangeError = false;
    this.passwordChangeMessage = 'Contraseña cambiada correctamente';
    console.log('Contraseña actualizada');

    // Limpiar los campos después de 2 segundos
    setTimeout(() => {
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordChangeMessage = '';
    }, 2000);
  }
}

