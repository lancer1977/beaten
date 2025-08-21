import { Component } from '@angular/core'; 
import { WallyComponent } from '../component/wally/beatengames.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  standalone:true,
  imports: [WallyComponent, FooterComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
