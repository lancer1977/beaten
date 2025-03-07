import { Component } from '@angular/core'; 
import { WallyComponent } from '../component/wally/wally.component';

@Component({
  standalone:true,
  imports:[WallyComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
