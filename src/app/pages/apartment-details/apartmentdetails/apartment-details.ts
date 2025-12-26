import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Amenity, Apartment, ApartmentHelper, ApartmentType} from '../../../core/models/apartment';
import {ActivatedRoute, Router} from '@angular/router';
import {ApartmentService} from '../../../core/services/apartment.service';
import {AuthService} from '../../../core/services/auth.service';
import {ToastService} from '../../../core/services/toast.service';
import {PhotoHelper} from '../../../core/models/photo';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BookingCalculation, BookingHelper, CreateBookingDto} from '../../../core/models/booking';
import {BookingService} from '../../../core/services/booking.service';

@Component({
  selector: 'app-apartmentdetails',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apartment-details.html',
  styleUrl: './apartment-details.css'
})
export class ApartmentDetails implements OnInit,  OnDestroy {
  private destroy$ = new Subject<void>();
  apartment = signal<Apartment | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  currentImageIndex = signal(0);
  showAllPhotos = signal(false);
  isBookingModalOpen = signal(false);
  isSubmittingBooking = signal(false);
  bookingCalculation = signal<BookingCalculation | null>(null);
  bookingForm!: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apartmentService: ApartmentService,
              private authService: AuthService,
              private toastService: ToastService,
              private bookingService: BookingService,
              private formBuilder: FormBuilder) {
    this.initializeBookingForm();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadApartmentDetails(id);
        } else {
          this.errorMessage.set('Invalid apartment');
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeBookingForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    this.bookingForm = this.formBuilder.group({
      checkInDate: [today, [Validators.required]],
      checkOutDate: [tomorrowStr, [Validators.required]],
      guests: [1, [Validators.required, Validators.min(1)]]
    });
    this.bookingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateBookingPrice();
      });
  }

  private calculateBookingPrice(): void {
    const apartment = this.apartment();
    const formValue = this.bookingForm.value;
    if (!apartment || !formValue.checkInDate || !formValue.checkOutDate) {
      this.bookingCalculation.set(null);
      return;
    }
    try {
      const calculation = BookingHelper.calculateBookingPrice(
        apartment.price,
        apartment.cleaningFee,
        formValue.checkInDate,
        formValue.checkOutDate
      );
      this.bookingCalculation.set(calculation);
    } catch (error) {
      this.bookingCalculation.set(null);
    }
  }

  private loadApartmentDetails(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.apartmentService.getApartmentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (apartment) => {
          this.apartment.set(apartment);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Failed to load apartment details. Please try again.');
          this.isLoading.set(false);
          this.toastService.showError('Error', 'Failed to load apartment details');
        }
      });
  }

  get photos(): string[] {
    const apt = this.apartment();
    if (!apt?.photos || apt.photos.length === 0) {
      return ['placeholder-apartment.png'];
    }
    return apt.photos.map(photo => PhotoHelper.createImageUrl(photo));
  }

  get currentPhoto(): string {
    return this.photos[this.currentImageIndex()];
  }

  get reviewCount(): number {
    return this.apartment()?.reviews?.length || 0;
  }

  nextImage(): void {
    const photos = this.photos;
    if (photos.length > 0) {
      this.currentImageIndex.update(idx => (idx + 1) % photos.length);
    }
  }

  previousImage(): void {
    const photos = this.photos;
    if (photos.length > 0) {
      this.currentImageIndex.update(idx => (idx - 1 + photos.length) % photos.length);
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  togglePhotosView(): void {
    this.showAllPhotos.update(v => !v);
  }

  openBookingModal(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.showWarning('Login Required', 'Please login to make a booking');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    const apartment = this.apartment();
    if (!apartment) return;
    if (!apartment.isAvailable || !apartment.isActive) {
      this.toastService.showWarning('Unavailable', 'This apartment is not available for booking');
      return;
    }
    this.isBookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.isBookingModalOpen.set(false);
    this.isSubmittingBooking.set(false);
  }

  onBookingSubmit(event: Event): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastService.showWarning('Invalid Form', 'Please fill in all required fields');
      return;
    }
    const formValue = this.bookingForm.value;
    const apartment = this.apartment();
    if (!apartment) return;
    const validationError = BookingHelper.validateBookingDates(
      formValue.checkInDate,
      formValue.checkOutDate
    );
    if (validationError) {
      this.toastService.showError('Invalid Dates', validationError);
      return;
    }
    if (formValue.guests > apartment.maxGuests) {
      this.toastService.showError(
        'Too Many Guests',
        `This apartment accommodates a maximum of ${apartment.maxGuests} guests`
      );
      return;
    }
    this.submitBooking();
  }

  private submitBooking(): void {
    this.isSubmittingBooking.set(true);
    const apartment = this.apartment();
    const formValue = this.bookingForm.value;
    if (!apartment) return;
    const bookingDto: CreateBookingDto = {
      apartmentId: apartment.id,
      start: new Date(formValue.checkInDate).toISOString(),
      end: new Date(formValue.checkOutDate).toISOString()
    };
    this.bookingService.createBooking(bookingDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookingId) => {
          this.toastService.showSuccess(
            'Booking Created',
            'Please check your email to confirm your booking'
          );
          this.closeBookingModal();
          this.router.navigate(['/user-dashboard']);
        },
        error: (error) => {
          this.isSubmittingBooking.set(false);
          const errorMessage = error.error?.message || 'Failed to create booking. Please try again.';
          this.toastService.showError('Booking Failed', errorMessage);
        }
      });
  }

  getAmenityName(amenity: Amenity): string {
    return ApartmentHelper.getAmenityDisplayName(amenity);
  }

  getTypeName(type: ApartmentType): string {
    return ApartmentHelper.getTypeDisplayName(type);
  }

  formatPrice(price: number): string {
    return ApartmentHelper.formatPrice(price);
  }

  getFullAddress(): string {
    const apt = this.apartment();
    return apt ? ApartmentHelper.getFullAddress(apt) : '';
  }

  shareApartment(): void {
    if (navigator.share) {
      navigator.share({
        title: this.apartment()?.name || 'Apartment',
        text: `Check out this apartment: ${this.apartment()?.name}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.toastService.showSuccess('Link Copied', 'Apartment link copied to clipboard');
    }
  }

  goBack(): void{
    window.history.back();
  }
}
