import { TestBed, inject } from '@angular/core/testing';

import { LikeServiceService } from './like-service.service';

describe('LikeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LikeServiceService]
    });
  });

  it('should be created', inject([LikeServiceService], (service: LikeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
