import {Component, OnInit} from '@angular/core';
import {Apartment, ApartmentSearchDto} from '../../core/models/apartment';
import {ActivatedRoute, Router} from '@angular/router';
import {ApartmentService} from '../../core/services/apartment.service';
import {switchMap} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './paginated-results.component.html',
  styleUrl: './paginated-results.component.css'
})
export class PaginatedResults implements OnInit {
  apartments: Apartment[] = [];
  location: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  sortBy: string = 'priceAsc';

  constructor(private route: ActivatedRoute, private  apartmentService: ApartmentService, private router: Router) {}

  ngOnInit(): void{
    this.route.queryParams.pipe(
      switchMap(params => {
        this.location = params['location'] || '';
        this.checkInDate = params['checkInDate'] || '';
        this.checkOutDate = params['checkOutDate'] || '';
        this.currentPage = +params['pageNumber'] || 1;
        this.sortBy = params['sortBy'] || 'priceAsc';

        const query: ApartmentSearchDto = {
          location: params['location'] || '',
          checkInDate: params['checkInDate'] || '',
          checkOutDate: params['checkOutDate'] || '',
          pageNumber: +params['pageNumber'] || 1,
          pageSize: +params['pageSize'] || 10
        };

        return this.apartmentService.getApartmentsPaged(query);
      })
    ).subscribe(results => {
      this.apartments = results.data;
      this.totalCount = results.totalCount || results.data.length;
      this.totalPages = results.totalPages;
      this.currentPage = results.pageNumber;
    });
  }

  onSortChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: this.sortBy, pageNumber: 1 },
      queryParamsHandling: 'merge'
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { pageNumber: this.currentPage - 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { pageNumber: this.currentPage + 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  getAmenitiesPreview(amenities: any[]): string {
    if (!amenities || amenities.length === 0) {
      return '';
    }

    const preview = amenities.slice(0, 3).map(a => a.name).join(', ');
    return amenities.length > 3 ? `${preview}...` : preview;
  }
}
