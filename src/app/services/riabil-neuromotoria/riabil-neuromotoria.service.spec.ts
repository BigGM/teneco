import { TestBed } from '@angular/core/testing';

import { RiabilNeuromotoriaService } from './riabil-neuromotoria.service';

describe('RiabilNeuromotoriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiabilNeuromotoriaService = TestBed.get(RiabilNeuromotoriaService);
    expect(service).toBeTruthy();
  });
});
