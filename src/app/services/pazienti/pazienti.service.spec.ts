import { TestBed } from '@angular/core/testing';

import { PazientiService } from './pazienti.service';

describe('PazientiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PazientiService = TestBed.get(PazientiService);
    expect(service).toBeTruthy();
  });
});
