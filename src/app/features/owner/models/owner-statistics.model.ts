export interface OwnerStatistics {
  totalApartments: number;
  activeApartments: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageBookingValue: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  bookingCount: number;
}

export interface ApartmentPerformance {
  apartmentId: string;
  apartmentName: string;
  bookingCount: number;
  revenue: number;
  occupancyRate: number;
  averageRating?: number;
}
