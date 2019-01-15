import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPacchettoComponent } from './action-pacchetto.component';

describe('ActionPacchettoComponent', () => {
  let component: ActionPacchettoComponent;
  let fixture: ComponentFixture<ActionPacchettoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPacchettoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPacchettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
