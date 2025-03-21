import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { WallyGame } from '../models/WallyGame';

@Injectable({
  providedIn: 'root'
})
export class WallyService {
  private sheetId = '10Hu_5R8jtQRNUHp7dk47c7Tm9atCEJcdJbQYPN1AOoE';
  private url = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:csv`;

  constructor(private http: HttpClient) {}

  getGames(art: string): Observable<WallyGame[]> {
    return this.http.get(this.url, { responseType: 'text' }).pipe(
      map(csvData => this.parseCSV(csvData, art)),
      catchError(error => {
        console.error('Error fetching games:', error);
        return of([]);
      })
    );
  }

  private parseCSV(csvData: string,art:string): WallyGame[] {
    return csvData
      .split('\n')
      .slice(1) // Skip the header
      .map(line => line.replace(/"/g, '').split(',').map(col => col.trim()))
      .filter(cols => cols.length >= 2 && cols[0] && cols[1])
      .map(cols => ({
        game: cols[0],
        console: cols[1],
        url: this.getGameImageUrl(cols[0], cols[1],art)
      }));
  }

  private getGameImageUrl(game: string, console: string, art: string): string {
    const formattedGame = game.replace(/ : /g, ' - ').replace(/: /g, ' - ').replace(/ /g, '%20');
    const system = this.getSystem(console);    
    //const art = 'marquee.png'
    return `https://cdn.polyhydragames.com/images/retro_v2/${system}/${formattedGame}/${art}.png`;
  }

  private getSystem(console: string): string {
    const systems: { [key: string]: string } = {
      'Arcade': 'arcade',
      'TurboGrafx-16': 'tg16',
      'TurboGrafx CD': 'tg16cd',
      'PC Engine': 'pcengine',
      'Famicom': 'nes',
      'Super Nintendo Entertainment System': 'snes',
      'Super Famicom': 'snes',
      'Nintendo Entertainment System': 'nes',
      'Gameboy Advance': 'gba',
      'Gameboy': 'gb',      
      'Gameboy Color': 'gbc',
      'Sega Genesis': 'genesis',
      'Sega Mega Drive': 'genesis',
      'Sega Master System': 'mastersystem',
      'Sega Saturn': 'saturn',
      'Sega 32X': 'sega32x',
      'Playstation 1': 'ps1',
      'Playstation 2': 'ps2',
      'Playstation 3': 'ps3',
      'Playstation 4': 'ps4',
      'PC-98': 'pc98',
      'Nintendo 64': 'n64',
      'Sharp X68000': 'x68000',
      'Virtual Boy': 'virtualboy',
    };
    return systems[console] || console.replace(/ /g, '').toLowerCase();
  }
}
