import {Apartment} from './apartment';

export enum BookingStatus {
  PendingApproval = 'PendingApproval',
  Confirmed = 'Confirmed',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

export interface Booking{
  id: string;
  apartmentId: string;
  apartment?: Apartment;
  start: Date | string;
  end: Date | string;
  status: BookingStatus;
  totalPrice: number;
  priceForPeriod: number;
  cleaningFee: number;
  amenitiesUpCharge: number;
  createdOnUtc: Date | string;
  confirmedOnUtc?: Date | string;
  cancelledOnUtc?: Date | string;
  completedOnUtc?: Date | string;
}

export interface CreateBookingDto{
  apartmentId: string;
  start: Date | string;
  end: Date | string;
}

export interface BookingCalculation {
  numberOfNights: number;
  pricePerNight: number;
  priceForPeriod: number;
  cleaningFee: number;
  amenitiesUpCharge: number;
  totalPrice: number;
}

export class BookingHelper{
  static getStatusDisplayName(status: BookingStatus): string {
    const statusNames: Record<BookingStatus, string> = {
      [BookingStatus.PendingApproval]: 'Pending Approval',
      [BookingStatus.Confirmed]: 'Confirmed',
      [BookingStatus.Rejected]: 'Rejected',
      [BookingStatus.Cancelled]: 'Cancelled',
      [BookingStatus.Completed]: 'Completed'
    };
    return statusNames[status];
  }

  static getStatusClass(status: BookingStatus): string {
    const statusClasses: Record<BookingStatus, string> = {
      [BookingStatus.PendingApproval]: 'status-pending',
      [BookingStatus.Confirmed]: 'status-confirmed',
      [BookingStatus.Rejected]: 'status-rejected',
      [BookingStatus.Cancelled]: 'status-cancelled',
      [BookingStatus.Completed]: 'status-completed'
    };
    return statusClasses[status];
  }

  static canBeCancelled(booking: Booking): boolean {
    return booking.status === BookingStatus.PendingApproval ||
      booking.status === BookingStatus.Confirmed;
  }

  static canBeReviewed(booking: Booking): boolean {
    return booking.status === BookingStatus.Completed;
  }

  static formatDateRange(start: Date | string, end: Date | string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  }

  static calculateNights(start: Date | string, end: Date | string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static calculateBookingPrice(pricePerNight: number, cleaningFee: number, start: Date | string, end: Date | string): BookingCalculation{
    const nights = this.calculateNights(start, end);
    const priceForPeriod = nights * pricePerNight;
    const amenitiesUpCharge = 0;
    const totalPrice = priceForPeriod + cleaningFee + amenitiesUpCharge;

    return {
      numberOfNights: nights,
      pricePerNight,
      priceForPeriod,
      cleaningFee,
      amenitiesUpCharge,
      totalPrice
    };
  }

  static formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  static isPastDate(booking: Booking): boolean {
    return new Date(booking.end) < new Date();
  }

  static isUpcomingDate(booking: Booking): boolean {
    return new Date(booking.start) > new Date();
  }

  static isCurrentDate(booking: Booking): boolean {
    const now = new Date();
    return new Date(booking.start) <= now && new Date(booking.end) >= now;
  }

  static validateBookingDates(start: Date | string, end: Date | string): string | null{
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return 'Check-in date cannot be in the past';
    }

    if (endDate <= startDate) {
      return 'Check-out date must be after check-in date';
    }

    const nights = this.calculateNights(start, end);
    if (nights < 1) {
      return 'Minimum stay is 1 night';
    }

    return null;
  }
}
