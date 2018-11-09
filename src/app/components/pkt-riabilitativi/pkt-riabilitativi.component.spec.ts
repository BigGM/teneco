import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PktRiabilitativiComponent } from './pkt-riabilitativi.component';

describe('PktRiabilitativiComponent', () => {
  let component: PktRiabilitativiComponent;
  let fixture: ComponentFixture<PktRiabilitativiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PktRiabilitativiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PktRiabilitativiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
