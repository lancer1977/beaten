export interface SheetConfig {
    sheetId: string;
    name?: string;
}

export interface GoogleKeysConfig {
    sheets: { [streamerName: string]: string };
    defaultSheetId?: string;
}

// Configuration that can be overridden at runtime via localStorage
let runtimeConfig: GoogleKeysConfig | null = null;

/**
 * Load config from localStorage if available
 */
function getRuntimeConfig(): GoogleKeysConfig | null {
    if (runtimeConfig === null) {
        try {
            const stored = localStorage.getItem('cc-beaten-googlekeys');
            if (stored) {
                runtimeConfig = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load runtime config', e);
        }
    }
    return runtimeConfig;
}

/**
 * Save config to localStorage for runtime overrides
 */
export function setRuntimeConfig(config: GoogleKeysConfig): void {
    try {
        localStorage.setItem('cc-beaten-googlekeys', JSON.stringify(config));
        runtimeConfig = config;
    } catch (e) {
        console.error('Failed to save runtime config', e);
    }
}

/**
 * Get all configured sheet IDs (from runtime config + defaults)
 */
export function getAllSheetIds(): SheetConfig[] {
    const runtime = getRuntimeConfig();
    const configs: SheetConfig[] = [];
    
    // Add runtime configs first (higher priority)
    if (runtime?.sheets) {
        for (const [name, sheetId] of Object.entries(runtime.sheets)) {
            configs.push({ sheetId, name });
        }
    }
    
    // Add default configs (if not already present)
    for (const [name, sheetId] of Object.entries(GoogleKeys.nameToKey)) {
        if (!configs.some(c => c.sheetId === sheetId)) {
            configs.push({ sheetId, name });
        }
    }
    
    return configs;
}

// Default sheet IDs - can be overridden at runtime
export const DEFAULT_SHEET_ID = '1midxH6qx0J6i9OqxNsdQA9M8Y_aInugXNk5lFQ0tDIE';

export   class GoogleKeys {
   // Default sheet mappings - used as fallback when no runtime config
   static nameToKey: { [name: string]: string } = { 
        dreadbreadcrumb: '10Hu_5R8jtQRNUHp7dk47c7Tm9atCEJcdJbQYPN1AOoE',
        segafan001: '1midxH6qx0J6i9OqxNsdQA9M8Y_aInugXNk5lFQ0tDIE'
    };

   /**
    * Get sheet ID for a given streamer name
    * Priority: 1. Runtime config (localStorage), 2. Default mappings
    */
   static  getKeyByName(name: string): string { 
        // Check runtime config first
        const runtime = getRuntimeConfig();
        if (runtime?.sheets?.[name.toLowerCase()]) {
            return runtime.sheets[name.toLowerCase()];
        }
        
        // Fall back to default mappings
        return this.nameToKey[name.toLowerCase()] || DEFAULT_SHEET_ID;
   };

   /**
    * Check if a custom config is active
    */
   static hasCustomConfig(): boolean {
        return getRuntimeConfig() !== null;
   }

   /**
    * Clear runtime config (reset to defaults)
    */
   static clearRuntimeConfig(): void {
        try {
            localStorage.removeItem('cc-beaten-googlekeys');
            runtimeConfig = null;
        } catch (e) {
            console.error('Failed to clear runtime config', e);
        }
   }

   /**
    * Validate a sheet ID format (basic format check, no network call)
    * Google Sheets IDs are typically 44 characters alphanumeric with dashes/underscores
    * @returns true if the sheet ID appears valid
    */
   static validateSheetId(sheetId: string | undefined | null): boolean {
        if (!sheetId || typeof sheetId !== 'string') {
            return false;
        }
        // Google Sheets IDs are typically 44 characters, alphanumeric with dashes/underscores
        const validLength = sheetId.length >= 30 && sheetId.length <= 60;
        const validChars = /^[a-zA-Z0-9_-]+$/.test(sheetId);
        return validLength && validChars;
   }

   /**
    * Check if a sheet ID is configured (has valid format)
    * @param name optional streamer name to get and validate specific sheet
    * @returns true if the configured sheet ID passes basic format validation
   */
   static isConfigured(name?: string): boolean {
        const sheetId = name ? this.getKeyByName(name) : DEFAULT_SHEET_ID;
        return this.validateSheetId(sheetId);
   }
}
