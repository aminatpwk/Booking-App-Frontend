import {Apartment, ApartmentSearchDto} from '../models/apartment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

const API_BASE_URL = 'https://localhost:7157/api/v1'

interface PagedApartmentResult{
  data: Apartment[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApartmentService{
    constructor(private http:  HttpClient) {

    }

  /**
   * Links to the C# GetAllApartmentsPaged endpoint.
   * @param query The filtering and pagination criteria.
   * @returns An observable containing the paged apartment results.
   */
    getApartmentsPaged(query: ApartmentSearchDto): Observable<PagedApartmentResult>{
      let params = new HttpParams()
        .set('PageIndex', query.pageNumber.toString())
        .set('PageSize', query.pageSize.toString());
      if (query.location) {
        params = params.set('Location', query.location);
      }
      if (query.checkInDate) {
        params = params.set('CheckInDate', query.checkInDate.toString());
      }
      if (query.checkOutDate) {
        params = params.set('CheckOutDate', query.checkOutDate.toString());
      }

    return this.http.get<PagedApartmentResult>(`${API_BASE_URL}/Apartment/paged`, {params});
    }
}
