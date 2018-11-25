import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioEsercizioComponent } from './dettaglio-esercizio.component';

describe('DettaglioEsercizioComponent', () => {
  let component: DettaglioEsercizioComponent;
  let fixture: ComponentFixture<DettaglioEsercizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioEsercizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioEsercizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
