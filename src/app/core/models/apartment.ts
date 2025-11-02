import { Owner } from './owner';
import {Photo} from './photo';
import {Review} from './review';

export interface Apartment{
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  price: number;
  description:  string;
  cleaningFee: number;
  lastBookedOnUtc?: Date;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  type: ApartmentType;
  amenities: Amenity[];
  photos: Photo[];
  reviews?: Review[];
  isActive: boolean;
  isAvailable: boolean;
  ownerId: string;
  owner?: Owner;
}

export enum ApartmentType {
  Studio = 1,
  OneBedroom = 2,
  TwoBedroom = 3,
  ThreeBedroom = 4,
  Penthouse = 5,
  Villa = 6,
  Cottage = 7,
  Cabin = 8,
  Bungalow = 9,
  Loft = 10
}

export enum Amenity {
  WiFi = 1,
  AirConditioning = 2,
  Parking = 3,
  PetFriendly = 4,
  SwimmingPool = 5,
  Gym = 6,
  Spa = 7,
  Terrace = 8,
  MountainView = 9,
  GardenView = 10
}

export interface CreateApartmentDto{
  name: string;
  country: string;
  city: string;
  address: string;
  price: number;
  description: string;
  cleaningFee: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  type: ApartmentType;
  amenities: Amenity[];
  isActive: boolean;
  isAvailable: boolean;
}

export interface UpdateApartmentDto extends CreateApartmentDto{
  id: string;
}

export interface ApartmentSearchDto {
  location?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  pageNumber: number;
  pageSize: number;
  minPrice?: number;
  maxPrice?: number;
  apartmentType?:string;
  orderBy?: string;
}

export class ApartmentHelper {
  static getTypeDisplayName(type: ApartmentType): string {
    const typeNames: Record<ApartmentType, string> = {
      [ApartmentType.Studio]: 'Studio',
      [ApartmentType.OneBedroom]: '1 Bedroom',
      [ApartmentType.TwoBedroom]: '2 Bedrooms',
      [ApartmentType.ThreeBedroom]: '3 Bedrooms',
      [ApartmentType.Penthouse]: 'Penthouse',
      [ApartmentType.Villa]: 'Villa',
      [ApartmentType.Cottage]: 'Cottage',
      [ApartmentType.Cabin]: 'Cabin',
      [ApartmentType.Bungalow]: 'Bungalow',
      [ApartmentType.Loft]: 'Loft'
    };
    return typeNames[type];
  }

  static getAmenityDisplayName(amenity: Amenity): string {
    const amenityNames: Record<Amenity, string> = {
      [Amenity.WiFi]: 'WiFi',
      [Amenity.AirConditioning]: 'Air Conditioning',
      [Amenity.Parking]: 'Parking',
      [Amenity.PetFriendly]: 'Pet Friendly',
      [Amenity.SwimmingPool]: 'Swimming Pool',
      [Amenity.Gym]: 'Gym',
      [Amenity.Spa]: 'Spa',
      [Amenity.Terrace]: 'Terrace',
      [Amenity.MountainView]: 'Mountain View',
      [Amenity.GardenView]: 'Garden View'
    };
    return amenityNames[amenity];
  }

  static formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  static getFullAddress(apartment: Apartment): string {
    return `${apartment.address}, ${apartment.city}, ${apartment.country}`;
  }
}

export interface ApartmentListItemDto {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  type: ApartmentType;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  mainPhoto?: string;
  averageRating?: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface UpdateApartmentDto extends CreateApartmentDto {
  id: string;
}
