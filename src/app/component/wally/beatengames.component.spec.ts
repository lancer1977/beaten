import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesBeatenComponent } from './beatengames.component';

describe('WallyComponent', () => {
  let component: GamesBeatenComponent;
  let fixture: ComponentFixture<GamesBeatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesBeatenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesBeatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
