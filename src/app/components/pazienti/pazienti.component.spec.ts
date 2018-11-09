import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PazientiComponent } from './pazienti.component';

describe('PazientiComponent', () => {
  let component: PazientiComponent;
  let fixture: ComponentFixture<PazientiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PazientiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PazientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
