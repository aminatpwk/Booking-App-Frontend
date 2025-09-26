import {Apartment} from './apartment';
import {User} from './user';

export interface Review{
  id: string;
  apartmentId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdOnUtc: Date;
  apartment?: Apartment;
  user?: User;
}

export interface CreateReviewDto {
  apartmentId: string;
  rating: number;
  comment?: string;
}

export interface ReviewListItemDto {
  id: string;
  rating: number;
  comment?: string;
  createdOnUtc: Date;
  userName: string;
}
