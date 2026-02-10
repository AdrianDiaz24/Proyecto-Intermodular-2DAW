import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-input-notas',
  standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './input-notas.component.html',
  styleUrl: './input-notas.component.scss'
})
export class InputNotasComponent {

}
