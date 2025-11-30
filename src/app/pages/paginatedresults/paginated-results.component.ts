import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apartment, ApartmentSearchDto, SortOption} from '../../core/models/apartment';
import {ActivatedRoute, Router} from '@angular/router';
import {ApartmentService} from '../../core/services/apartment.service';
import {Subject, switchMap, takeUntil} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [
    FormsModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './paginated-results.component.html',
  styleUrl: './paginated-results.component.css'
})
export class PaginatedResults implements OnInit, OnDestroy {
  //cleanup
  private destroy$ = new Subject<void>();
  protected readonly Math = Math;
  apartments: Apartment[] = [];
  location: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  sortBy: string = 'priceAsc';
  isLoading: boolean = false;
  errorMessage: string = '';
  skeletonItems = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];

  constructor(private route: ActivatedRoute, private  apartmentService: ApartmentService, private router: Router) {}

  ngOnInit(): void{
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        console.log('Query Params:', params);
        this.location = params['location'] || '';
        this.checkInDate = params['checkInDate'] || '';
        this.checkOutDate = params['checkOutDate'] || '';
        const pageFromUrl = params['page'];
        this.currentPage = pageFromUrl ? +pageFromUrl : 1;
        this.pageSize = +params['pageSize'] || 10;
        this.sortBy = (params['sortBy'] || 'priceAsc') as SortOption;
        this.loadApartments();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadApartments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const query: ApartmentSearchDto = {
      searchTerm: this.location || undefined,
      checkInDate: this.checkInDate || undefined,
      checkOutDate: this.checkOutDate || undefined,
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
      ...this.parseSortOption(this.sortBy)
    };

    this.apartmentService.getApartmentsPaged(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          console.log('API Response:', result);
          this.apartments = result.data || [];
          this.totalCount = result.totalCount;
          this.totalPages = result.totalPages;
          this.currentPage = result.pageIndex + 1;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading apartments:', error);
          this.errorMessage = 'Failed to load apartments. Please try again.';
          this.isLoading = false;
          this.apartments = [];
        }
      });
  }

  private parseSortOption(sortOption: string): { sortBy?: string; sortDescending?: boolean } {
    switch (sortOption) {
      case 'priceAsc':
        return { sortBy: 'Price', sortDescending: false };
      case 'priceDesc':
        return { sortBy: 'Price', sortDescending: true };
      case 'ratingDesc':
        return { sortBy: 'Rating', sortDescending: true };
      case 'nameAsc':
        return { sortBy: 'Name', sortDescending: false };
      case 'nameDesc':
        return { sortBy: 'Name', sortDescending: true };
      default:
        return { sortBy: 'Price', sortDescending: false };
    }
  }

  onSortChange(): void {
    this.updateQueryParams({ sortBy: this.sortBy, page: 1 });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.updateQueryParams({ page: this.currentPage - 1 });
    }
  }

  nextPage(): void {
    console.log('Next page clicked. Current:', this.currentPage, 'Total:', this.totalPages);
    if (this.currentPage < this.totalPages) {
      this.updateQueryParams({ page: this.currentPage + 1 });
    }
  }

  private updateQueryParams(params: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  getAmenitiesPreview(amenities: any[]): string {
    if (!amenities || amenities.length === 0) {
      return 'No amenities listed';
    }

    const preview = amenities.slice(0, 3).map(a => a.name).join(', ');
    return amenities.length > 3 ? `${preview}...` : preview;
  }
}
