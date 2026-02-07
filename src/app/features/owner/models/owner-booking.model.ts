import {BookingStatus} from '../../../core/models/booking';

export interface OwnerBooking {
  id: string;
  apartmentId: string;
  apartmentName: string;
  apartmentPhoto?: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  pricePerNight: number;
  priceForPeriod: number;
  cleaningFee: number;
  amenitiesUpCharge: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  rejectedAt?: Date;
}

export interface OwnerBookingListItem {
  id: string;
  apartmentName: string;
  guestName: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

export interface BookingFilters {
  status?: BookingStatus;
  apartmentId?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}
