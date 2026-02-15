import { Component } from '@angular/core';
import { GalleryImage } from '../../app/components/shared/image-gallery/image-gallery.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Equipo ReparaFácil',
      role: 'Desarrollo',
      description: 'Apasionados por ayudar a la comunidad a resolver problemas técnicos.'
    }
  ];

  features = [
    {
      icon: 'assets/icons/mas.avif',
      title: 'Comunidad Activa',
      description: 'Miles de usuarios compartiendo soluciones y experiencias.'
    },
    {
      icon: 'assets/icons/mas.avif',
      title: 'Base de Conocimiento',
      description: 'Amplia colección de incidencias resueltas y guías de reparación.'
    },
    {
      icon: 'assets/icons/mas.avif',
      title: 'Soporte Gratuito',
      description: 'Ayuda de la comunidad sin costo alguno.'
    }
  ];

  /** Imágenes para la galería accesible */
  galleryImages: GalleryImage[] = [
    {
      src: 'assets/images/hero-taller.avif',
      alt: 'Taller de reparaciones con herramientas organizadas sobre un banco de trabajo de madera',
      caption: 'Nuestro taller cuenta con todas las herramientas necesarias para reparaciones profesionales'
    },
    {
      src: 'assets/images/hero-taller_large.avif',
      alt: 'Vista ampliada del espacio de trabajo mostrando equipos de diagnóstico electrónico',
      caption: 'Equipos de diagnóstico de última generación para identificar problemas rápidamente'
    },
    {
      src: 'assets/images/hero-taller_small.avif',
      alt: 'Detalle de herramientas de precisión utilizadas en reparaciones de electrodomésticos',
      caption: 'Herramientas de precisión para trabajos delicados'
    },
    {
      src: 'assets/images/hero-taller.avif',
      alt: 'Técnico realizando el diagnóstico de un electrodoméstico con multímetro digital',
      caption: 'Diagnóstico profesional de electrodomésticos por expertos certificados'
    },
    {
      src: 'assets/images/hero-taller_large.avif',
      alt: 'Comunidad de reparadores colaborando en la resolución de un problema técnico complejo',
      caption: 'Nuestra comunidad trabaja junta para resolver los problemas más difíciles'
    },
    {
      src: 'assets/images/hero-taller_small.avif',
      alt: 'Usuario aprendiendo técnicas de reparación básica en nuestro taller colaborativo',
      caption: 'Aprende de la comunidad y comparte tus conocimientos'
    }
  ];
}

