import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPacchettoComponent } from './new-pacchetto.component';

describe('NewPacchettoComponent', () => {
  let component: NewPacchettoComponent;
  let fixture: ComponentFixture<NewPacchettoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPacchettoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPacchettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
