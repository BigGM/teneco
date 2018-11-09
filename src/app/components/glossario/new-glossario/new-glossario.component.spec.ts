import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGlossarioComponent } from './new-glossario.component';

describe('NewGlossarioComponent', () => {
  let component: NewGlossarioComponent;
  let fixture: ComponentFixture<NewGlossarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGlossarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGlossarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
