import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedResults } from './paginated-results.component';

describe('Paginatedresults', () => {
  let component: PaginatedResults;
  let fixture: ComponentFixture<PaginatedResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatedResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatedResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
