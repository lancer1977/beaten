import { WallyService } from '../../service/wally.service';
import { Game } from '../../models/WallyGame';
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
export class GamesBeatenComponent implements OnInit {

  onImageError($event: any) {
    console.log($event);
    $event.target.src = "https://static-cdn.jtvnw.net/jtv_user_pictures/083b767b-bb5b-47c5-8e20-4e406e55e63d-profile_image-70x70.png"
  }

  launch(search: string) {
    var url = "https://howlongtobeat.com/?q=" + search;
    console.log("Opening " + url);
    window.open(url);
  }
  howLongToBeat() {
    this.launch(this.search);
  }
  games: Game[] = [];
  visibleGames: Game[] = [];
  consoles: string[] = ['All'];
  selectedConsole: string = 'All';
  selectedImageType: string = 'boxart-small'
  search: string = '';

  constructor(private wallyService: WallyService) { }

  ngOnInit() {
    console.log('on Init');
    this.updateBaseGames();
  }

  updateBaseGames() {
    this.wallyService.getGames(this.selectedImageType).subscribe((games) => {
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
    ).sort((a, b) =>
      a.console.localeCompare(b.console) || a.game.localeCompare(b.game)
    );;
  }
}
