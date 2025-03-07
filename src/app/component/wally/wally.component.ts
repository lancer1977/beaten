 import { WallyService } from '../../service/wally.service';
import { WallyGame } from '../../models/WallyGame';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
 
   
@Component({
  selector: 'app-wally',
  templateUrl: './wally.component.html',
  imports: [FormsModule],
  styleUrls: ['./wally.component.scss'],
  standalone: true
})
export class WallyComponent implements OnInit {
  games: WallyGame[] = [];
  visibleGames: WallyGame[] = [];
  consoles: string[] = ['All'];
  selectedConsole: string = 'All';
  search: string = '';

  constructor(private wallyService: WallyService) {}

  ngOnInit() {
    console.log('on Init');
    this.wallyService.getGames().subscribe((games) => {
      this.games = games;
      this.consoles = ['All', ...Array.from(new Set(games.map(g => g.console))).sort()];
      this.filterGames();
    });
  }

  filterGames() {
    console.log('filtering games');
    this.visibleGames = this.games.filter(game =>
      (this.selectedConsole === 'All' || game.console === this.selectedConsole) &&
      (this.search === '' || game.game.toLowerCase().includes(this.search.toLowerCase()))
    
    )  .sort((a,b) => 
      a.console.localeCompare(b.console) || a.game.localeCompare(b.game)
    );;
  }
}
