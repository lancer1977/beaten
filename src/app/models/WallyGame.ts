export interface Game {
    game: string;
    console: string;
    url: string;
    /** Row index from source data (proxy for date-added: higher = more recent) */
    rowIndex?: number;
  }