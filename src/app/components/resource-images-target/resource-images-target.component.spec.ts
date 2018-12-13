import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceImagesTargetComponent } from './resource-images-target.component';

describe('ResourceImagesTargetComponent', () => {
  let component: ResourceImagesTargetComponent;
  let fixture: ComponentFixture<ResourceImagesTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceImagesTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceImagesTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
