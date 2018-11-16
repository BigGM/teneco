import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiabilCognitivaComponent } from './riabil-cognitiva.component';

describe('RiabilCognitivaComponent', () => {
  let component: RiabilCognitivaComponent;
  let fixture: ComponentFixture<RiabilCognitivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiabilCognitivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiabilCognitivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
