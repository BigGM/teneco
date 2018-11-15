import { TestBed } from '@angular/core/testing';

import { ResourceImagesService } from './resource-images.service';

describe('ResourceImagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceImagesService = TestBed.get(ResourceImagesService);
    expect(service).toBeTruthy();
  });
});
