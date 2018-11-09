import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDocsComponent } from './resource-docs.component';

describe('ResourceDocsComponent', () => {
  let component: ResourceDocsComponent;
  let fixture: ComponentFixture<ResourceDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
