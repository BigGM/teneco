import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModPacchettoComponent } from './mod-pacchetto.component';

describe('ModPacchettoComponent', () => {
  let component: ModPacchettoComponent;
  let fixture: ComponentFixture<ModPacchettoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModPacchettoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModPacchettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
