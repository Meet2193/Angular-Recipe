import { TestBed } from '@angular/core/testing';

import { AllRecipeService } from './all-recipe.service';

describe('AllRecipeService', () => {
  let service: AllRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
