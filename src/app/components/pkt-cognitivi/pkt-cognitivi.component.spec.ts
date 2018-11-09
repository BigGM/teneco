import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PktCognitiviComponent } from './pkt-cognitivi.component';

describe('PktCognitiviComponent', () => {
  let component: PktCognitiviComponent;
  let fixture: ComponentFixture<PktCognitiviComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PktCognitiviComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PktCognitiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
