import { TestBed } from '@angular/core/testing';

import { ResourceDocsService } from './resource-docs.service';

describe('ResouceDocsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceDocsService = TestBed.get(ResourceDocsService);
    expect(service).toBeTruthy();
  });
});
