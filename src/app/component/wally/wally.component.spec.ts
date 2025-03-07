import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallyComponent } from './wally.component';

describe('WallyComponent', () => {
  let component: WallyComponent;
  let fixture: ComponentFixture<WallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WallyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
