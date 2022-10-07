import { TestBed } from '@angular/core/testing';

import { LocadorasService } from './locadoras.service';

describe('LocadorasService', () => {
  let service: LocadorasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocadorasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
