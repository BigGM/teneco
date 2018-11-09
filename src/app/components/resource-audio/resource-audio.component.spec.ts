import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAudioComponent } from './resource-audio.component';

describe('ResourceAudioComponent', () => {
  let component: ResourceAudioComponent;
  let fixture: ComponentFixture<ResourceAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
