import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../app/services/auth.service';
import { NavigationService } from '../../app/services/navigation.service';
import { CanComponentDeactivate } from '../../app/guards/unsaved-changes.guard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {
  // Información del usuario
  user: User | null = null;

  // Estados del formulario
  editMode = false;
  formData: any = {};
  hasUnsavedChanges = false;

  // Estados de las cards
  isCardExpanded = false;
  isSecurityCardExpanded = false;
  isIncidenciesCardExpanded = false;

  // Seguridad
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Obtener datos del resolver o del servicio
    this.route.data.subscribe(data => {
      if (data['user']) {
        this.user = data['user'];
        this.formData = { ...this.user };
      }
    });

    // Si no hay datos del resolver, obtener del servicio
    if (!this.user) {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.user = user;
          this.formData = { ...user };
        }
      });
    }

    // Verificar estado de navegación (mensaje de bienvenida)
    const navState = this.navigationService.getNavigationState();
    if (navState?.fromLogin || navState?.fromRegister) {
      console.log('Bienvenido!', navState.user?.username);
    }
  }

  /**
   * Implementación del guard CanDeactivate
   * Previene navegación si hay cambios sin guardar
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasUnsavedChanges) {
      return confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?');
    }
    return true;
  }

  toggleEditMode(): void {
    if (this.editMode) {
      // Guardar cambios
      this.saveProfile();
    }
    this.editMode = !this.editMode;
  }

  saveProfile(): void {
    if (this.user) {
      this.authService.updateUser(this.formData).subscribe(updatedUser => {
        this.user = updatedUser;
        this.hasUnsavedChanges = false;
        console.log('Perfil actualizado:', this.user);
      });
    }
  }

  cancelEdit(): void {
    this.formData = { ...this.user };
    this.editMode = false;
    this.hasUnsavedChanges = false;
  }

  logout(): void {
    this.authService.logout();
  }

  updateField(field: string, value: string): void {
    this.formData[field as keyof typeof this.formData] = value;
    this.hasUnsavedChanges = true;
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
    // Navegar a la página de detalles de la incidencia con parámetros
    this.navigationService.navigateWithQueryParams(['/producto', '1'], {
      incidenceId: incidencyId,
      highlight: true
    });
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

