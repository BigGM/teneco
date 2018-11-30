import { TestBed } from '@angular/core/testing';

import { FormazioneService } from './formazione.service';

describe('FormazioneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormazioneService = TestBed.get(FormazioneService);
    expect(service).toBeTruthy();
  });
});
