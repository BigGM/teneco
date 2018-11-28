import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionEsercizioComponent } from './action-esercizio.component';

describe('ActionEsercizioComponent', () => {
  let component: ActionEsercizioComponent;
  let fixture: ComponentFixture<ActionEsercizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionEsercizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionEsercizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
