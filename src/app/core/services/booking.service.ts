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

  /**
   * POST /api/v1/Booking
   * Requires role: User (via JWT — handled by auth interceptor)
   * Returns the new booking's Guid as a string.
   */
  createBooking(bookingDto: CreateBookingDto): Observable<string>{
    return this.http.post<string>(this.apiUrl, bookingDto);
  }

  /**
   * GET /api/v1/Booking/my
   * Requires role: User.
   * Returns all bookings for the current user.
   */
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my`);
  }

  /**
   * GET /api/v1/Booking/confirm/{token}
   * Token comes from the email confirmation link.
   */
  confirmBooking(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/confirm/${token}`);
  }

  /**
   * GET /api/v1/Booking/cancel/{token}
   * Token comes from the email cancellation link.
   * Users cancel via the email link, not from the dashboard directly.
   * The dashboard "Cancel" button should inform users to check their email.
   */
  cancelBooking(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/cancel/${token}`);
  }
}
