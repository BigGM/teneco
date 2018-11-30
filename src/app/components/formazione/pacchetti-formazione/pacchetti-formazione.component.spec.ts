import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacchettiFormazioneComponent } from './pacchetti-formazione.component';

describe('PacchettiFormazioneComponent', () => {
  let component: PacchettiFormazioneComponent;
  let fixture: ComponentFixture<PacchettiFormazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacchettiFormazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacchettiFormazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
