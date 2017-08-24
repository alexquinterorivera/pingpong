import { TestBed, inject } from '@angular/core/testing';

import { DataOfflineService } from './data-offline.service';

describe('DataOfflineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataOfflineService]
    });
  });

  it('should be created', inject([DataOfflineService], (service: DataOfflineService) => {
    expect(service).toBeTruthy();
  }));
});
