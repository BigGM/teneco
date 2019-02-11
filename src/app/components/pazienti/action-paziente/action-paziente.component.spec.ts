import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPazienteComponent } from './action-paziente.component';

describe('ActionPazienteComponent', () => {
  let component: ActionPazienteComponent;
  let fixture: ComponentFixture<ActionPazienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPazienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
