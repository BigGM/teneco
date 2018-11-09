import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceImagesComponent } from './resource-images.component';

describe('ResourceImagesComponent', () => {
  let component: ResourceImagesComponent;
  let fixture: ComponentFixture<ResourceImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
