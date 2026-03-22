import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Booking, BookingHelper, BookingStatus} from '../../core/models/booking';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookingService} from '../../core/services/booking.service';
import { ReviewService } from '../../core/services/review.service';
import {AuthService} from '../../core/services/auth.service';
import {ToastService} from '../../core/services/toast.service';
import { Router } from '@angular/router';
import {CreateReviewDto} from '../../core/models/review';
import {LowerCasePipe} from '@angular/common';

type Section = 'bookings' | 'reviews' | 'profile';

@Component({
  selector: 'app-dashboard',
  imports: [
    LowerCasePipe,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();

  activeSection = signal<Section>('bookings');
  bookings = signal<Booking[]>([]);
  isLoading = signal(true);
  isSubmittingReview = signal(false);

  reviewForm!: FormGroup;
  reviewingBooking = signal<Booking | null>(null);
  hoveredStar = signal(0);

  BookingHelper = BookingHelper;
  BookingStatus = BookingStatus;

  get userEmail(): string {
    return this.authService.getDecodedToken()?.email || '';
  }

  get pendingCount(): number {
    return this.bookings().filter(b => b.status === BookingStatus.PendingApproval).length;
  }

  get confirmedCount(): number {
    return this.bookings().filter(b => b.status === BookingStatus.Confirmed).length;
  }

  get completedCount(): number {
    return this.bookings().filter(b => b.status === BookingStatus.Completed).length;
  }

  get reviewableBookings(): Booking[] {
    return this.bookings().filter(b => BookingHelper.canBeReviewed(b));
  }

  constructor(
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(1000)]]
    });
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setSection(section: Section): void {
    this.activeSection.set(section);
  }

  private loadBookings(): void {
    this.isLoading.set(true);
    this.bookingService.getMyBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings) => {
          this.bookings.set(bookings);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastService.showError('Error', 'Failed to load bookings');
          this.isLoading.set(false);
        }
      });
  }

  requestCancellation(booking: Booking): void {
    if (!BookingHelper.canBeCancelled(booking)) return;
    this.toastService.showInfo(
      'Check your email',
      'To cancel this booking, use the cancellation link in the confirmation email you received.'
    );
  }

  openReviewModal(booking: Booking): void {
    if (!BookingHelper.canBeReviewed(booking)) return;
    this.reviewingBooking.set(booking);
    this.reviewForm.reset({ rating: 0, comment: '' });
    this.hoveredStar.set(0);
  }

  closeReviewModal(): void {
    this.reviewingBooking.set(null);
  }

  navigateToApartment(apartmentId: string): void {
    this.router.navigate(['/apartment', apartmentId]);
  }

  setRating(value: number): void {
    this.reviewForm.patchValue({ rating: value });
  }

  submitReview(): void {
    const booking = this.reviewingBooking();
    if (!booking || this.reviewForm.value.rating < 1) {
      this.toastService.showWarning('Rating required', 'Please select a star rating');
      return;
    }
    if (this.reviewForm.invalid) return;
    this.isSubmittingReview.set(true);

    const dto: CreateReviewDto = {
      apartmentId: booking.apartmentId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment || undefined
    };

    this.reviewService.createReview(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Review submitted!', 'Thank you for your feedback');
          this.isSubmittingReview.set(false);
          this.closeReviewModal();
          this.loadBookings();
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to submit review';
          this.toastService.showError('Error', msg);
          this.isSubmittingReview.set(false);
        }
      });
  }


  formatDateRange(start: Date | string, end: Date | string): string {
    return BookingHelper.formatDateRange(start, end);
  }

  formatPrice(price: number): string {
    return BookingHelper.formatPrice(price);
  }

  getNights(start: Date | string, end: Date | string): number {
    return BookingHelper.calculateNights(start, end);
  }
}
