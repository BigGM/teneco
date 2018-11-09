import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModGlossarioComponent } from './mod-glossario.component';

describe('ModGlossarioComponent', () => {
  let component: ModGlossarioComponent;
  let fixture: ComponentFixture<ModGlossarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModGlossarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModGlossarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
