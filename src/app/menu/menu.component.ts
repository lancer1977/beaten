import { Component } from '@angular/core'; 
import { RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  standalone:true,
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
 
  

}