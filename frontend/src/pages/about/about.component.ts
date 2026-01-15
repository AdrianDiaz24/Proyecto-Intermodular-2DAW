import { Component } from '@angular/core';

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
      icon: 'assets/icons/mas.png',
      title: 'Comunidad Activa',
      description: 'Miles de usuarios compartiendo soluciones y experiencias.'
    },
    {
      icon: 'assets/icons/mas.png',
      title: 'Base de Conocimiento',
      description: 'Amplia colección de incidencias resueltas y guías de reparación.'
    },
    {
      icon: 'assets/icons/mas.png',
      title: 'Soporte Gratuito',
      description: 'Ayuda de la comunidad sin costo alguno.'
    }
  ];
}

