import {environment} from '../../environment/environment';
import {BehaviorSubject, catchError, Observable, shareReplay, tap, throwError} from 'rxjs';
import {Apartment} from '../models/apartment';
import {OwnerBookingListItem} from '../../features/owner/models/owner-booking.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OwnerService{
  private readonly apiUrl = environment.apiUrl;
  private apartmentsSubject = new BehaviorSubject<Apartment[]>([]);
  private bookingsSubject = new BehaviorSubject<OwnerBookingListItem[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  apartments$ = this.apartmentsSubject.asObservable();
  bookings$ = this.bookingsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // getOwnerApartments(): Observable<Apartment[]> {
  //   this.isLoadingSubject.next(true);
  //
  //   return this.http.get<Apartment[]>(`${this.apiUrl}/Owner/apartments`).pipe(
  //     tap(apartments => {
  //       const listItems = this.mapToApartmentListItems(apartments);
  //       this.apartmentsSubject.next(listItems);
  //       this.isLoadingSubject.next(false);
  //     }),
  //     catchError(error => {
  //       this.isLoadingSubject.next(false);
  //       return this.handleError(error, 'Failed to load apartments');
  //     }),
  //     shareReplay(1)
  //   );
  // }

  private handleError(error: any, userMessage: string): Observable<never> {
    console.error('Owner Service Error:', error);
    let errorMessage = userMessage;
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
