import { WallyService } from '../../service/wally.service';
import { Game } from '../../models/WallyGame';
import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleKeys, SheetConfig, setRuntimeConfig, getAllSheetIds, DEFAULT_SHEET_ID } from '../../service/googlekeys';
import { SheetsConfigService, SheetsConfigState } from '../../service/sheets-config.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-wally',
  templateUrl: './beatengames.component.html',
  imports: [FormsModule],
  styleUrls: ['./beatengames.component.scss'],
  standalone: true
})
export class GamesBeatenComponent implements OnInit, OnDestroy {

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
  @Input() title: string = 'Games Beaten';
  streamerName = '';
  sheetId = '';
  games: Game[] = [];
  visibleGames: Game[] = [];
  consoles: string[] = ['All'];
  selectedConsole: string = 'All';
  selectedImageType: string = 'boxart-small'
  search: string = '';
  
  // Debounced search
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | null = null;
  
  // Sorting
  sortBy: string = 'title-asc';
  sortOptions = [
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'system', label: 'System' },
    { value: 'date-added', label: 'Date Added' }
  ];

  // Additional filters
  selectedStatus: string = 'All';
  selectedGenre: string = 'All';
  selectedRegion: string = 'All';
  statuses: string[] = ['All'];
  genres: string[] = ['All'];
  regions: string[] = ['All'];

  // Sheet configuration
  availableSheets: SheetConfig[] = [];
  selectedSheetId: string = '';

  constructor(private wallyService: WallyService, private router: Router, private sheetsConfig: SheetsConfigService) {
    const url = this.router.url;        // e.g. "/dread"
    this.streamerName = url.split('/')[1];   // "dread"
    if (this.streamerName === 'beaten') {
      this.streamerName = url.split('/')[2];   // "dread"
    }
    
    // Load available sheets and set initial sheet ID
    this.availableSheets = getAllSheetIds();
    this.sheetId = GoogleKeys.getKeyByName(this.streamerName);
    this.selectedSheetId = this.sheetId;
    
    // Load persisted filters from localStorage
    this.loadPersistedFilters();
    
    // Setup debounced search (300ms)
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.filterGames();
      });
  }

  ngOnInit() {
    console.log('on Init');
    
    // Validate sheet accessibility on startup
    if (this.sheetId) {
      console.log(`Validating sheet access for: ${this.streamerName} (${this.sheetId})`);
      this.sheetsConfig.validateSheetAccess(this.sheetId).subscribe(result => {
        if (result.valid) {
          console.log(`✅ Sheet accessible: ${result.title}`);
        } else {
          console.warn(`⚠️ Sheet validation failed for ${this.streamerName}: ${result.error}`);
        }
      });
    }
    
    this.updateBaseGames();
  }
  
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  /**
   * Handle search input with debounce
   */
  onSearchInput(value: string): void {
    this.search = value;
    this.searchSubject.next(value);
  }

  /**
   * Handle sheet selection change
   */
  onSheetChange(newSheetId: string): void {
    if (newSheetId && newSheetId !== this.sheetId) {
      this.sheetId = newSheetId;
      this.updateBaseGames();
    }
  }

  updateBaseGames() {
    var url = this.wallyService.getGoogleDocsUrl(this.sheetId);

    this.wallyService.getGames(this.selectedImageType, url).subscribe((games) => {
      this.games = games;
      this.consoles = ['All', ...Array.from(new Set(games.map(g => g.console))).sort()];
      // Extract unique values for additional filters
      this.statuses = ['All', ...Array.from(new Set(games.map(g => g.status).filter((s): s is string => !!s)))].sort();
      this.genres = ['All', ...Array.from(new Set(games.map(g => g.genre).filter((s): s is string => !!s)))].sort();
      this.regions = ['All', ...Array.from(new Set(games.map(g => g.region).filter((s): s is string => !!s)))].sort();
      this.filterGames();
    });
  }

  loadPersistedFilters() {
    try {
      const saved = localStorage.getItem('cc-beaten-filters');
      if (saved) {
        const filters = JSON.parse(saved);
        this.selectedConsole = filters.selectedConsole || 'All';
        this.selectedImageType = filters.selectedImageType || 'boxart-small';
        this.search = filters.search || '';
        this.sortBy = filters.sortBy || 'title-asc';
        this.selectedStatus = filters.selectedStatus || 'All';
        this.selectedGenre = filters.selectedGenre || 'All';
        this.selectedRegion = filters.selectedRegion || 'All';
      }
    } catch (e) {
      console.warn('Failed to load persisted filters', e);
    }
  }

  persistFilters() {
    try {
      localStorage.setItem('cc-beaten-filters', JSON.stringify({
        selectedConsole: this.selectedConsole,
        selectedImageType: this.selectedImageType,
        search: this.search,
        sortBy: this.sortBy,
        selectedStatus: this.selectedStatus,
        selectedGenre: this.selectedGenre,
        selectedRegion: this.selectedRegion
      }));
    } catch (e) {
      console.warn('Failed to persist filters', e);
    }
  }

  filterGames() {
    console.log('filtering games');
    this.visibleGames = this.games.filter(game =>
      (this.selectedConsole === 'All' || game.console === this.selectedConsole) &&
      (this.selectedStatus === 'All' || game.status === this.selectedStatus) &&
      (this.selectedGenre === 'All' || game.genre === this.selectedGenre) &&
      (this.selectedRegion === 'All' || game.region === this.selectedRegion) &&
      (this.search === '' || game.game.toLowerCase().includes(this.search.toLowerCase()))
    );
    this.sortGames();
    this.persistFilters();
  }

  sortGames() {
    this.visibleGames.sort((a, b) => {
      switch (this.sortBy) {
        case 'title-asc':
          return a.game.localeCompare(b.game);
        case 'title-desc':
          return b.game.localeCompare(a.game);
        case 'system':
          return a.console.localeCompare(b.console) || a.game.localeCompare(b.game);
        case 'date-added':
          // Use rowIndex as proxy for date-added: higher index = more recent = sort first
          const aIndex = a.rowIndex ?? 0;
          const bIndex = b.rowIndex ?? 0;
          return bIndex - aIndex; // Descending (most recent first)
        default:
          return a.console.localeCompare(b.console) || a.game.localeCompare(b.game);
      }
    });
  }

  /**
   * Check if any filters are currently active (not at default values)
   */
  get filtersActive(): boolean {
    return this.selectedConsole !== 'All' || this.search !== '' || this.sortBy !== 'title-asc' 
      || this.selectedStatus !== 'All' || this.selectedGenre !== 'All' || this.selectedRegion !== 'All';
  }

  /**
   * Reset all filters to their default values
   */
  clearFilters(): void {
    this.selectedConsole = 'All';
    this.selectedStatus = 'All';
    this.selectedGenre = 'All';
    this.selectedRegion = 'All';
    this.search = '';
    this.sortBy = 'title-asc';
    this.filterGames();
  }

  /**
   * Clear just the search field
   */
  clearSearch(): void {
    this.search = '';
    this.searchSubject.next('');
    this.filterGames();
  }
}
