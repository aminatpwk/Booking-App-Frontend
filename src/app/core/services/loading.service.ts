import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCountSignal = signal(0);
  private loadingSignal = signal(false);

  isLoading = this.loadingSignal.asReadonly();

  show(): void{
    this.loadingCountSignal.update(count => count + 1);
    this.loadingSignal.set(true);
  }

  hide(): void{
    this.loadingCountSignal.update(count => Math.max(0, count - 1));
    if (this.loadingCountSignal() === 0) {
      this.loadingSignal.set(false);
    }
  }
}
