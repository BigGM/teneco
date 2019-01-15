import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacchettiCognitiviComponent } from './pacchetti-cognitivi.component';

describe('PacchettiCognitiviComponent', () => {
  let component: PacchettiCognitiviComponent;
  let fixture: ComponentFixture<PacchettiCognitiviComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacchettiCognitiviComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacchettiCognitiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
