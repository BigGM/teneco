import { TestBed } from '@angular/core/testing';

import { ResourceVideoService } from './resource-video.service';

describe('ResourceVideoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceVideoService = TestBed.get(ResourceVideoService);
    expect(service).toBeTruthy();
  });
});
