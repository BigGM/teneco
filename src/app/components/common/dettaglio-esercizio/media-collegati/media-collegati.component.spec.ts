import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCollegatiComponent } from './media-collegati.component';

describe('MediaCollegatiComponent', () => {
  let component: MediaCollegatiComponent;
  let fixture: ComponentFixture<MediaCollegatiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaCollegatiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaCollegatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
