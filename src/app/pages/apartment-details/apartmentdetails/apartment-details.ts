import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Amenity, Apartment, ApartmentHelper, ApartmentType} from '../../../core/models/apartment';
import {ActivatedRoute, Router} from '@angular/router';
import {ApartmentService} from '../../../core/services/apartment.service';
import {AuthService} from '../../../core/services/auth.service';
import {ToastService} from '../../../core/services/toast.service';
import {PhotoHelper} from '../../../core/models/photo';

@Component({
  selector: 'app-apartmentdetails',
  imports: [],
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apartmentService: ApartmentService,
              private authService: AuthService,
              private toastService: ToastService) {
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
    this.isBookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.isBookingModalOpen.set(false);
  }

  onBookingSubmit(event: Event): void {
    event.preventDefault();
    // TODO: Implement booking logic
    this.closeBookingModal();
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
