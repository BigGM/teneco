import { TestBed } from '@angular/core/testing';

import { ResourceAudioService } from './resource-audio.service';

describe('ResourceAudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceAudioService = TestBed.get(ResourceAudioService);
    expect(service).toBeTruthy();
  });
});
