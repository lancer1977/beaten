import { Component } from '@angular/core'; 
import { GamesBeatenComponent } from '../component/wally/beatengames.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  standalone:true,
  imports: [GamesBeatenComponent, FooterComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
