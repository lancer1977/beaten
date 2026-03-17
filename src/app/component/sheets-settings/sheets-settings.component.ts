import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SheetsConfigService, SheetConfig, ColumnMapping } from '../../service/sheets-config.service';

@Component({
  selector: 'app-sheets-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sheets-settings.component.html',
  styleUrls: ['./sheets-settings.component.scss']
})
export class SheetsSettingsComponent implements OnInit {
  // Form fields
  streamerName = '';
  sheetId = '';
  isValidating = false;
  validationResult: { valid: boolean; title?: string; error?: string } | null = null;
  
  // Column mapping
  columnMapping: ColumnMapping = {
    title: 'title',
    platform: 'platform', 
    genre: 'genre',
    status: 'status'
  };

  // UI state
  isLoading = false;
  configs: SheetConfig[] = [];
  editingConfig: SheetConfig | null = null;
  showDeleteConfirm = '';

  constructor(private sheetsConfig: SheetsConfigService) {}

  ngOnInit(): void {
    this.loadConfigs();
  }

  loadConfigs(): void {
    this.configs = Object.values(this.sheetsConfig.getState().configs);
  }

  /**
   * Validate a sheet URL/ID
   */
  validateSheet(): void {
    if (!this.sheetId.trim()) {
      this.validationResult = { valid: false, error: 'Please enter a Sheet ID or URL' };
      return;
    }

    // Extract sheet ID from URL if needed
    let sheetId = this.sheetId.trim();
    if (sheetId.includes('docs.google.com/spreadsheets/d/')) {
      const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        sheetId = match[1];
      }
    }

    this.isValidating = true;
    this.validationResult = null;

    this.sheetsConfig.validateSheetAccess(sheetId).subscribe({
      next: (result: { valid: boolean; title?: string; error?: string }) => {
        this.validationResult = result;
        this.isValidating = false;
      },
      error: (err: Error) => {
        this.validationResult = { valid: false, error: 'Validation failed: ' + err.message };
        this.isValidating = false;
      }
    });
  }

  /**
   * Save the current configuration
   */
  saveConfig(): void {
    if (!this.streamerName.trim() || !this.sheetId.trim()) {
      return;
    }

    let sheetId = this.sheetId.trim();
    if (sheetId.includes('docs.google.com/spreadsheets/d/')) {
      const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        sheetId = match[1];
      }
    }

    const config: SheetConfig = {
      sheetId,
      name: this.streamerName.trim(),
      columnMapping: { ...this.columnMapping }
    };

    this.sheetsConfig.setSheetConfig(this.streamerName.trim(), config);
    this.loadConfigs();
    this.resetForm();
  }

  /**
   * Edit an existing config
   */
  editConfig(config: SheetConfig): void {
    this.editingConfig = config;
    this.streamerName = config.name || '';
    this.sheetId = config.sheetId;
    this.columnMapping = { ...config.columnMapping };
    this.validationResult = { valid: true, title: 'Previously validated' };
  }

  /**
   * Delete a configuration
   */
  deleteConfig(streamerName: string): void {
    this.sheetsConfig.removeConfig(streamerName);
    this.loadConfigs();
    this.showDeleteConfirm = '';
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.streamerName = '';
    this.sheetId = '';
    this.columnMapping = {
      title: 'title',
      platform: 'platform',
      genre: 'genre', 
      status: 'status'
    };
    this.validationResult = null;
    this.editingConfig = null;
  }

  /**
   * Clear all configuration
   */
  clearAll(): void {
    if (confirm('Are you sure you want to clear all sheet configurations?')) {
      this.sheetsConfig.clearAll();
      this.loadConfigs();
      this.resetForm();
    }
  }
}