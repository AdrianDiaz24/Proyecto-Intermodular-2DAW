import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../app/services';
import { User } from '../../app/models';
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

  // Tema
  isDarkMode = false;

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
    // Detectar tema actual
    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    // Observar cambios de tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Obtener datos del resolver o del servicio
    this.route.data.subscribe(data => {
      console.log('Profile route data:', data);
      if (data['user'] && data['user'].id) {
        this.user = data['user'];
        this.formData = { ...this.user };
        console.log('User loaded from resolver:', this.user);
      }
    });

    // Si no hay datos del resolver, obtener del servicio
    if (!this.user) {
      this.authService.currentUser$.subscribe(user => {
        console.log('Current user from service:', user);
        if (user) {
          this.user = user;
          this.formData = { ...user };
        }
      });
    }

    // Si no hay usuario después de resolver, redirigir a login
    setTimeout(() => {
      if (!this.user) {
        console.warn('No user found, redirecting to login');
        this.router.navigate(['/login']);
      }
    }, 100);

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
    this.router.navigate(['/incidencia', incidencyId]);
  }

  changePassword(): void {
    this.passwordChangeError = false;
    this.passwordChangeMessage = '';

    // Validar que los campos estén completos
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'Por favor, completa todos los campos';
      return;
    }

    // Validar que coincidan
    if (this.newPassword !== this.confirmPassword) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validar longitud mínima
    if (this.newPassword.length < 6) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.passwordChangeError = false;
    this.passwordChangeMessage = 'Contraseña cambiada correctamente';

    // Limpiar campos
    setTimeout(() => {
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordChangeMessage = '';
    }, 2000);
  }
}

