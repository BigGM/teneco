import { TestBed } from '@angular/core/testing';

import { NeuroAppService } from './neuro-app.service';

describe('NeuroAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeuroAppService = TestBed.get(NeuroAppService);
    expect(service).toBeTruthy();
  });
});
