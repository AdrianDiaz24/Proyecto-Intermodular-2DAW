/**
 * @fileoverview Tests unitarios para LoginFormComponent
 * Verifica formulario de login, validaciones y emisión de eventos
 */

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación del componente', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería tener un formulario de login', () => {
      expect(component.loginForm).toBeTruthy();
    });

    it('debería tener valores por defecto para inputs', () => {
      expect(component.title).toBe('Inicia sesión');
      expect(component.subtitle).toBe('Accede a tu cuenta de ReparaFácil');
      expect(component.submitButtonText).toBe('Inicia sesión');
    });
  });

  describe('Formulario reactivo', () => {
    it('debería tener campos email y password', () => {
      expect(component.loginForm.contains('email')).toBeTrue();
      expect(component.loginForm.contains('password')).toBeTrue();
    });

    it('debería requerir el campo email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('debería validar formato de email', () => {
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('invalidemail');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors).toBeNull();
    });

    it('debería requerir el campo password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalse();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('debería validar longitud mínima de password', () => {
      const passwordControl = component.loginForm.get('password');

      passwordControl?.setValue('12345'); // 5 caracteres
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();

      passwordControl?.setValue('123456'); // 6 caracteres
      expect(passwordControl?.errors).toBeNull();
    });

    it('debería ser inválido si ambos campos están vacíos', () => {
      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('');
      expect(component.loginForm.valid).toBeFalse();
    });

    it('debería ser válido con datos correctos', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('Getters de formulario', () => {
    it('debería tener getter para email', () => {
      expect(component.email).toBe(component.loginForm.get('email'));
    });

    it('debería tener getter para password', () => {
      expect(component.password).toBe(component.loginForm.get('password'));
    });
  });

  describe('Visibilidad de contraseña', () => {
    it('debería tener contraseña oculta por defecto', () => {
      expect(component.passwordVisible).toBeFalse();
    });

    it('debería alternar visibilidad de contraseña', () => {
      expect(component.passwordVisible).toBeFalse();

      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeTrue();

      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeFalse();
    });
  });

  describe('Envío del formulario', () => {
    it('no debería emitir evento si el formulario es inválido', () => {
      spyOn(component.formSubmit, 'emit');

      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('');
      component.onSubmit();

      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });

    it('debería emitir evento con credenciales si el formulario es válido', fakeAsync(() => {
      spyOn(component.formSubmit, 'emit');

      const testCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      component.loginForm.get('email')?.setValue(testCredentials.email);
      component.loginForm.get('password')?.setValue(testCredentials.password);
      component.onSubmit();

      expect(component.formSubmit.emit).toHaveBeenCalledWith(testCredentials);
    }));

    it('debería marcar submitted como true al enviar', () => {
      expect(component.submitted).toBeFalse();

      component.onSubmit();

      expect(component.submitted).toBeTrue();
    });

    it('debería activar loading durante el envío', fakeAsync(() => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');

      component.onSubmit();
      expect(component.loading).toBeTrue();

      tick(1500);
      expect(component.loading).toBeFalse();
    }));
  });

  describe('Reset del formulario', () => {
    it('debería resetear el formulario completamente', () => {
      // Configurar estado previo
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('password123');
      component.submitted = true;
      component.passwordVisible = true;

      // Resetear
      component.resetForm();

      // Verificar estado reseteado
      expect(component.submitted).toBeFalse();
      expect(component.passwordVisible).toBeFalse();
      expect(component.loginForm.get('email')?.value).toBeNull();
      expect(component.loginForm.get('password')?.value).toBeNull();
    });
  });

  describe('Inputs configurables', () => {
    it('debería permitir personalizar el título', () => {
      component.title = 'Título personalizado';
      fixture.detectChanges();
      expect(component.title).toBe('Título personalizado');
    });

    it('debería permitir personalizar el subtítulo', () => {
      component.subtitle = 'Subtítulo personalizado';
      fixture.detectChanges();
      expect(component.subtitle).toBe('Subtítulo personalizado');
    });

    it('debería permitir personalizar el texto del botón', () => {
      component.submitButtonText = 'Entrar';
      fixture.detectChanges();
      expect(component.submitButtonText).toBe('Entrar');
    });
  });
});

