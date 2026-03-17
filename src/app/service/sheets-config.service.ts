import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, BehaviorSubject } from 'rxjs';

export interface ColumnMapping {
  title: string;
  platform: string;
  genre: string;
  status: string;
}

export interface SheetConfig {
  sheetId: string;
  name?: string;
  columnMapping: ColumnMapping;
  lastFetched?: number;
}

export interface SheetsConfigState {
  configs: { [streamerName: string]: SheetConfig };
  activeStreamer: string | null;
}

// Storage keys
const STORAGE_KEY = 'cc-beaten-sheets-config';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

@Injectable({
  providedIn: 'root'
})
export class SheetsConfigService {
  private state$ = new BehaviorSubject<SheetsConfigState>({
    configs: {},
    activeStreamer: null
  });

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  /**
   * Load configuration from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored) as SheetsConfigState;
        this.state$.next(state);
      }
    } catch (e) {
      console.warn('Failed to load sheets config', e);
    }
  }

  /**
   * Save configuration to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state$.value));
    } catch (e) {
      console.error('Failed to save sheets config', e);
    }
  }

  /**
   * Get current state
   */
  getState(): SheetsConfigState {
    return this.state$.value;
  }

  /**
   * Add or update a sheet configuration
   */
  setSheetConfig(streamerName: string, config: SheetConfig): void {
    const state = this.state$.value;
    state.configs[streamerName.toLowerCase()] = {
      ...config,
      sheetId: config.sheetId,
      name: streamerName,
      lastFetched: Date.now()
    };
    this.state$.next(state);
    this.saveToStorage();
  }

  /**
   * Get configuration for a specific streamer
   */
  getConfigForStreamer(streamerName: string): SheetConfig | null {
    return this.state$.value.configs[streamerName.toLowerCase()] || null;
  }

  /**
   * Remove a sheet configuration
   */
  removeConfig(streamerName: string): void {
    const state = this.state$.value;
    delete state.configs[streamerName.toLowerCase()];
    this.state$.next(state);
    this.saveToStorage();
  }

  /**
   * Set the active streamer
   */
  setActiveStreamer(streamerName: string): void {
    const state = this.state$.value;
    state.activeStreamer = streamerName.toLowerCase();
    this.state$.next(state);
    this.saveToStorage();
  }

  /**
   * Get all configured streamers
   */
  getAllStreamers(): string[] {
    return Object.keys(this.state$.value.configs);
  }

  /**
   * Validate that a Google Sheet is publicly readable
   * Returns the sheet title if valid, null otherwise
   */
  validateSheetAccess(sheetId: string): Observable<{ valid: boolean; title?: string; error?: string }> {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=1`;
    
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(csvData => {
        if (!csvData || csvData.trim().length === 0) {
          return { valid: false, error: 'Empty response from sheet' };
        }
        // Extract sheet title from CSV response (first line contains sheet name)
        const lines = csvData.split('\n');
        if (lines.length === 0) {
          return { valid: false, error: 'No data in sheet' };
        }
        // The response format is: /*O_o*/\nGoogleVisualization...SheetName\n"col1","col2",...
        // Try to extract meaningful column headers
        const headers = lines[0]?.replace(/^.*\n/, '').replace(/"/g, '').split(',') || [];
        
        return { 
          valid: true, 
          title: `Sheet with columns: ${headers.slice(0, 5).join(', ')}${headers.length > 5 ? '...' : ''}` 
        };
      }),
      catchError(error => {
        console.error('Sheet validation failed:', error);
        return of({ 
          valid: false, 
          error: error.status === 404 ? 'Sheet not found (check ID)' 
            : error.status === 403 ? 'Sheet is not publicly readable - go to File > Share > Publish to web'
            : error.status === 0 ? 'Network error - check URL'
            : `Error: ${error.message}` 
        });
      })
    );
  }

  /**
   * Parse CSV with column mapping
   */
  parseCSVWithMapping(csvData: string, mapping: ColumnMapping): string[][] {
    const lines = csvData.split('\n').slice(1); // Skip header
    const headers = csvData.split('\n')[0]?.replace(/"/g, '').split(',').map(h => h.trim().toLowerCase()) || [];
    
    // Find column indices
    const getColIndex = (field: string): number => {
      const idx = headers.findIndex(h => h.includes(field.toLowerCase()) || field.toLowerCase().includes(h));
      return idx >= 0 ? idx : -1;
    };
    
    const titleIdx = getColIndex(mapping.title);
    const platformIdx = getColIndex(mapping.platform);
    const genreIdx = getColIndex(mapping.genre);
    const statusIdx = getColIndex(mapping.status);

    return lines
      .filter(line => line.trim().length > 0)
      .map(line => {
        const cols = line.replace(/"/g, '').split(',').map(c => c.trim());
        return [
          titleIdx >= 0 ? cols[titleIdx] || '' : cols[0] || '',
          platformIdx >= 0 ? cols[platformIdx] || '' : cols[1] || '',
          genreIdx >= 0 ? cols[genreIdx] || '' : '',
          statusIdx >= 0 ? cols[statusIdx] || '' : ''
        ];
      });
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid(streamerName: string): boolean {
    const config = this.getConfigForStreamer(streamerName);
    if (!config?.lastFetched) return false;
    return Date.now() - config.lastFetched < CACHE_DURATION_MS;
  }

  /**
   * Clear all configuration
   */
  clearAll(): void {
    this.state$.next({ configs: {}, activeStreamer: null });
    localStorage.removeItem(STORAGE_KEY);
  }
}