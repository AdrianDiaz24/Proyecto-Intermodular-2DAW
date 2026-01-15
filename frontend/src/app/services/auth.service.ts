import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  memberSince: Date;
  phone?: string;
  profileImage?: string;
  joinDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
    // Verificar si hay usuario en localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  /**
   * Simula el login de un usuario
   */
  login(email: string, password: string): Observable<{ success: boolean; user?: User; error?: string }> {
    // Simulación de autenticación
    return new Observable(observer => {
      setTimeout(() => {
        // Simular validación básica
        if (email && password.length >= 6) {
          const user: User = {
            id: 1,
            username: email.split('@')[0],
            email: email,
            memberSince: new Date('2026-01-10'),
            phone: '+34 612 345 678',
            profileImage: 'assets/icons/UsuarioBlanco.png',
            joinDate: '2026-01-10'
          };

          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
          localStorage.setItem('currentUser', JSON.stringify(user));

          observer.next({ success: true, user });
        } else {
          observer.next({ success: false, error: 'Credenciales inválidas' });
        }
        observer.complete();
      }, 1000); // Simular delay de red
    });
  }

  /**
   * Simula el registro de un usuario
   */
  register(username: string, email: string, password: string): Observable<{ success: boolean; user?: User; error?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        if (username && email && password.length >= 6) {
          const user: User = {
            id: Math.floor(Math.random() * 1000),
            username: username,
            email: email,
            memberSince: new Date(),
            phone: '',
            profileImage: 'assets/icons/UsuarioBlanco.png',
            joinDate: new Date().toISOString().split('T')[0]
          };

          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
          localStorage.setItem('currentUser', JSON.stringify(user));

          observer.next({ success: true, user });
        } else {
          observer.next({ success: false, error: 'Datos de registro inválidos' });
        }
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  /**
   * Obtiene el usuario actual de forma síncrona
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado de forma síncrona
   */
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Actualiza los datos del usuario
   */
  updateUser(userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          this.currentUserSubject.next(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          observer.next(updatedUser);
        }
        observer.complete();
      }, 500);
    });
  }
}

