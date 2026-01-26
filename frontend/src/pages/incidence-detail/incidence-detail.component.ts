import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Incidence } from '../../app/services/product.service';

interface IncidenceResponse {
  id: number;
  author: string;
  avatar: string;
  date: Date;
  message: string;
}

@Component({
  selector: 'app-incidence-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidence-detail.component.html',
  styleUrls: ['./incidence-detail.component.scss']
})
export class IncidenceDetailComponent implements OnInit {
  incidence: Incidence | null = null;
  responses: IncidenceResponse[] = [];
  isLoading = true;
  newResponseText = '';
  userAvatar = 'https://ui-avatars.com/api/?name=User';

  // ...existing code...
  private mockResponses: IncidenceResponse[] = [
    {
      id: 1,
      author: 'Juan Carlos M.',
      avatar: 'https://ui-avatars.com/api/?name=JuanCarlos&background=4CAF50&color=fff',
      date: new Date('2026-01-13'),
      message: 'A mí me pasaba lo mismo. Resulta que tenía la ropa demasiado apelmazada. Traté de separar mejor las prendas y desde entonces funciona perfecto. Intenta no meter tanta ropa de una vez.'
    },
    {
      id: 2,
      author: 'María López',
      avatar: 'https://ui-avatars.com/api/?name=MariaLopez&background=2196F3&color=fff',
      date: new Date('2026-01-13T14:30:00'),
      message: 'Yo tuve el mismo ruido. Descubrí que había una moneda atrapada en el tambor. Abrí la puerta de acceso (generalmente en la parte inferior) y encontré varias cosas. ¡Vale la pena revisar!'
    },
    {
      id: 3,
      author: 'Roberto Díaz',
      avatar: 'https://ui-avatars.com/api/?name=RobertoDiaz&background=FF9800&color=fff',
      date: new Date('2026-01-14'),
      message: 'Prueba con el programa de centrifugado solo sin ropa. Si el ruido sigue, podría ser un problema del motor. Pero si desaparece, es seguro que algo está dentro.'
    },
    {
      id: 4,
      author: 'Sandra García',
      avatar: 'https://ui-avatars.com/api/?name=SandraGarcia&background=9C27B0&color=fff',
      date: new Date('2026-01-14T10:15:00'),
      message: 'También revisé el manguito de goma (la goma que cierra el tambor). En mi caso, una costura se había descosido y rozaba. Podría ser eso. Mira bien las gomas y los sellos.'
    },
    {
      id: 5,
      author: 'Andrés Moreno',
      avatar: 'https://ui-avatars.com/api/?name=AndresMoreno&background=E91E63&color=fff',
      date: new Date('2026-01-14T15:45:00'),
      message: '¡Solución definitiva! Limpiar el filtro de la bomba. Está en la parte frontal inferior. Acumula pelusas y objetos que causan ruidos extraños. Abre, saca el filtro y límpialo.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('IncidenceDetailComponent cargado');
    this.route.params.subscribe(params => {
      const incidenceId = Number(params['id']);
      console.log('Incidence ID:', incidenceId);
      this.loadIncidence(incidenceId);
      this.loadResponses(incidenceId);
    });
  }

  loadIncidence(incidenceId: number): void {
    this.productService.getIncidenceById(incidenceId).subscribe({
      next: (incidence) => {
        this.incidence = incidence || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando incidencia:', error);
        this.isLoading = false;
      }
    });
  }

  loadResponses(incidenceId: number): void {
    // En una aplicación real, esto vendría de un servicio
    // Por ahora usamos mock data
    this.responses = this.mockResponses;
  }

  postResponse(): void {
    if (!this.newResponseText.trim() || !this.incidence) {
      return;
    }

    const newResponse: IncidenceResponse = {
      id: this.responses.length + 1,
      author: 'Usuario Actual',
      avatar: this.userAvatar,
      date: new Date(),
      message: this.newResponseText
    };

    this.responses.push(newResponse);
    this.newResponseText = '';

    // Scroll automático a la última respuesta
    setTimeout(() => {
      const responsesList = document.querySelector('.incidence-responses');
      if (responsesList) {
        responsesList.scrollTop = responsesList.scrollHeight;
      }
    }, 100);
  }

  getStatusLabel(): string {
    switch (this.incidence?.estado) {
      case 'ABIERTA':
        return 'Pendiente';
      case 'EN_PROGRESO':
        return 'En Progreso';
      case 'CERRADA':
        return 'Resuelta';
      default:
        return 'Desconocido';
    }
  }

  getStatusClass(): string {
    const statusMap: { [key: string]: string } = {
      'ABIERTA': 'pending',
      'EN_PROGRESO': 'in-progress',
      'CERRADA': 'resolved'
    };
    return `status-${statusMap[this.incidence?.estado || ''] || 'pending'}`;
  }

  getSeverityLabel(): string {
    switch (this.incidence?.severidad) {
      case 'BAJO':
        return 'Baja';
      case 'MEDIO':
        return 'Media';
      case 'ALTO':
        return 'Alta';
      default:
        return 'Desconocida';
    }
  }

  getSeverityClass(): string {
    const severityMap: { [key: string]: string } = {
      'BAJO': 'low',
      'MEDIO': 'medium',
      'ALTO': 'high'
    };
    return `severity-${severityMap[this.incidence?.severidad || ''] || 'low'}`;
  }

  getCategoryLabel(): string {
    switch (this.incidence?.categoria) {
      case 'FUNCIONALIDAD':
        return 'Funcionalidad';
      case 'APARIENCIA':
        return 'Apariencia';
      case 'RENDIMIENTO':
        return 'Rendimiento';
      case 'OTRO':
        return 'Otra';
      default:
        return 'Otra';
    }
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${day}/${month}/${year} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
}
