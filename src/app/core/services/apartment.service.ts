import {Apartment, ApartmentSearchDto} from '../models/apartment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment';

interface PagedApartmentResult{
  pageIndex: number;
  data: Apartment[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApartmentService{
  private apiUrl = environment.apiUrl;
  constructor(private http:  HttpClient) {

    }

  /**
   * Links to the C# GetAllApartmentsPaged endpoint.
   * @param query The filtering and pagination criteria.
   * @returns An observable containing the paged apartment results.
   */
    getApartmentsPaged(query: ApartmentSearchDto): Observable<PagedApartmentResult>{
      let params = new HttpParams()
        .set('PageIndex', query.pageIndex.toString())
        .set('PageSize', query.pageSize.toString());
      if (query.country) {
        params = params.set('Country', query.country);
      }
      if (query.city) {
        params = params.set('City', query.city);
      }
      if (query.searchTerm) {
        params = params.set('SearchTerm', query.searchTerm);
      }
      if (query.checkInDate) {
        params = params.set('startDate', query.checkInDate);
      }
      if (query.checkOutDate) {
        params = params.set('endDate', query.checkOutDate);
      }
      if (query.minPrice !== undefined && query.minPrice !== null) {
        params = params.set('MinPrice', query.minPrice.toString());
      }
      if (query.maxPrice !== undefined && query.maxPrice !== null) {
        params = params.set('MaxPrice', query.maxPrice.toString());
      }

    console.log('API Request:', `${this.apiUrl}/Apartment/paged`, params.toString());

    return this.http.get<PagedApartmentResult>(`${this.apiUrl}/Apartment/paged`, {params});
    }

  getApartmentById(id: string): Observable<Apartment> {
    return this.http.get<Apartment>(`${this.apiUrl}/Apartment/${id}`);
  }

  getAllApartments(): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(`${this.apiUrl}/Apartment`);
  }
}
