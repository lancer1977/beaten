import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GamesBeatenComponent } from './beatengames.component';

describe('GamesBeatenComponent', () => {
  let component: GamesBeatenComponent;
  let fixture: ComponentFixture<GamesBeatenComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [GamesBeatenComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesBeatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sorting options', () => {
    expect(component.sortOptions.length).toBeGreaterThan(0);
    expect(component.sortOptions.some(opt => opt.value === 'title-asc')).toBeTrue();
    expect(component.sortOptions.some(opt => opt.value === 'title-desc')).toBeTrue();
    expect(component.sortOptions.some(opt => opt.value === 'system')).toBeTrue();
  });

  it('should filter games by console', () => {
    component.games = [
      { game: 'Super Mario Bros', console: 'NES', url: '' },
      { game: 'Sonic', console: 'Genesis', url: '' }
    ];
    component.selectedConsole = 'NES';
    component.search = '';
    component.filterGames();
    
    expect(component.visibleGames.length).toBe(1);
    expect(component.visibleGames[0].console).toBe('NES');
  });

  it('should filter games by search term', () => {
    component.games = [
      { game: 'Super Mario Bros', console: 'NES', url: '' },
      { game: 'Sonic the Hedgehog', console: 'Genesis', url: '' }
    ];
    component.selectedConsole = 'All';
    component.search = 'Sonic';
    component.filterGames();
    
    expect(component.visibleGames.length).toBe(1);
    expect(component.visibleGames[0].game).toBe('Sonic the Hedgehog');
  });

  it('should sort games by title ascending', () => {
    component.visibleGames = [
      { game: 'Zelda', console: 'NES', url: '' },
      { game: 'Mario', console: 'NES', url: '' }
    ];
    component.sortBy = 'title-asc';
    component.sortGames();
    
    expect(component.visibleGames[0].game).toBe('Mario');
    expect(component.visibleGames[1].game).toBe('Zelda');
  });

  it('should sort games by title descending', () => {
    component.visibleGames = [
      { game: 'Mario', console: 'NES', url: '' },
      { game: 'Zelda', console: 'NES', url: '' }
    ];
    component.sortBy = 'title-desc';
    component.sortGames();
    
    expect(component.visibleGames[0].game).toBe('Zelda');
    expect(component.visibleGames[1].game).toBe('Mario');
  });

  it('should sort games by date-added (rowIndex descending)', () => {
    component.visibleGames = [
      { game: 'Mario', console: 'NES', url: '', rowIndex: 0 },
      { game: 'Zelda', console: 'NES', url: '', rowIndex: 5 },
      { game: 'Metroid', console: 'NES', url: '', rowIndex: 2 }
    ];
    component.sortBy = 'date-added';
    component.sortGames();
    
    // Higher rowIndex = more recent = comes first
    expect(component.visibleGames[0].game).toBe('Zelda');
    expect(component.visibleGames[1].game).toBe('Metroid');
    expect(component.visibleGames[2].game).toBe('Mario');
  });

  it('should detect when filters are active', () => {
    // Default state - no filters active
    component.selectedConsole = 'All';
    component.search = '';
    component.sortBy = 'title-asc';
    expect(component.filtersActive).toBeFalse();
    
    // Console filter active
    component.selectedConsole = 'NES';
    expect(component.filtersActive).toBeTrue();
    
    // Search active
    component.selectedConsole = 'All';
    component.search = 'Mario';
    expect(component.filtersActive).toBeTrue();
    
    // Non-default sort
    component.search = '';
    component.sortBy = 'system';
    expect(component.filtersActive).toBeTrue();
  });

  it('should clear all filters to defaults', () => {
    component.selectedConsole = 'NES';
    component.search = 'Mario';
    component.sortBy = 'system';
    
    component.clearFilters();
    
    expect(component.selectedConsole).toBe('All');
    expect(component.search).toBe('');
    expect(component.sortBy).toBe('title-asc');
  });

  it('should clear search field only', () => {
    component.selectedConsole = 'NES';
    component.search = 'Mario';
    component.sortBy = 'system';
    
    component.clearSearch();
    
    expect(component.search).toBe('');
    // Other filters should remain unchanged
    expect(component.selectedConsole).toBe('NES');
    expect(component.sortBy).toBe('system');
  });

  it('should persist filters to localStorage', () => {
    component.selectedConsole = 'Genesis';
    component.selectedImageType = 'marquee';
    component.search = 'Sonic';
    component.sortBy = 'system';
    component.persistFilters();
    
    const saved = JSON.parse(localStorage.getItem('cc-beaten-filters') || '{}');
    expect(saved.selectedConsole).toBe('Genesis');
    expect(saved.selectedImageType).toBe('marquee');
    expect(saved.search).toBe('Sonic');
    expect(saved.sortBy).toBe('system');
  });

  it('should load filters from localStorage', () => {
    localStorage.setItem('cc-beaten-filters', JSON.stringify({
      selectedConsole: 'SNES',
      selectedImageType: 'marquee',
      search: 'Street',
      sortBy: 'title-desc'
    }));
    
    component.loadPersistedFilters();
    
    expect(component.selectedConsole).toBe('SNES');
    expect(component.selectedImageType).toBe('marquee');
    expect(component.search).toBe('Street');
    expect(component.sortBy).toBe('title-desc');
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('cc-beaten-filters', 'not valid json');
    
    // Should not throw
    expect(() => component.loadPersistedFilters()).not.toThrow();
    
    // Should use defaults
    expect(component.selectedConsole).toBe('All');
    expect(component.search).toBe('');
  });
});
