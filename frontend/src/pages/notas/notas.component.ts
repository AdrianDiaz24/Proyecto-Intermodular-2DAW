import {Component, input} from '@angular/core';
import {InputNotasComponent} from "../../app/components/shared/input-notas/input-notas.component";

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [
    InputNotasComponent
  ],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.scss'
})
export class NotasComponent {

}
