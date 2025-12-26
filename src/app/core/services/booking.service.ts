import {Injectable} from '@angular/core';
import {environment} from '../../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Booking, CreateBookingDto} from '../models/booking';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService{
  private readonly apiUrl = `${environment.apiUrl}/Booking`;

  constructor(private http: HttpClient){}

  createBooking(bookingDto: CreateBookingDto): Observable<string>{
    return this.http.post<string>(this.apiUrl, bookingDto);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my`);
  }

  /**
   *   cancel and confirm bookings using e-mail link
   * @param token
   */
  confirmBooking(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/confirm/${token}`);
  }

  cancelBooking(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/cancel/${token}`);
  }

  checkAvailability(apartmentId: string, start: Date, end: Date): Observable<boolean> {
    const params = {
      apartmentId,
      start: start.toISOString(),
      end: end.toISOString()
    };
    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, { params });
  }

}
