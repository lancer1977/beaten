import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
  standalone:true,
  imports:[MenuComponent],
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
