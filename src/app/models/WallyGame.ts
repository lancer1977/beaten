export interface Game {
    game: string;
    console: string;
    url: string;
    /** Row index from source data (proxy for date-added: higher = more recent) */
    rowIndex?: number;
    /** Completion status: not-started, in-progress, completed, abandoned */
    status?: string;
    /** Game genre */
    genre?: string;
    /** Game region: usa, europe, japan, etc. */
    region?: string;
  }