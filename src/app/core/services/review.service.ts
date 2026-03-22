import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environment/environment';
import {CreateReviewDto} from '../models/review';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiUrl}/Review`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/Review
   * Requires role: User.
   * Backend checks: user must have a completed booking for the apartment (end < now).
   * Backend checks: user cannot review the same apartment twice.
   */
  createReview(reviewDto: CreateReviewDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, reviewDto);
  }
}
