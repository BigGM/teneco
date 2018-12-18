import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImagesTargetComponent } from './upload-images-target.component';

describe('UploadImagesTargetComponent', () => {
  let component: UploadImagesTargetComponent;
  let fixture: ComponentFixture<UploadImagesTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadImagesTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImagesTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
