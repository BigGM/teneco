import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEsercizioComponent } from './new-esercizio.component';

describe('NewEsercizioComponent', () => {
  let component: NewEsercizioComponent;
  let fixture: ComponentFixture<NewEsercizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEsercizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEsercizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
