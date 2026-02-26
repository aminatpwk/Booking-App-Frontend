import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dashboard-owner',
  imports: [],
  templateUrl: './dashboard-owner.html',
  styleUrl: './dashboard-owner.css'
})
export class DashboardOwner {
  activeSection: string = 'overview';
  @ViewChild('mainPanel') mainPanel!: ElementRef<HTMLElement>;

  setActiveSection(section: string): void{
    this.activeSection = section;
    this.mainPanel.nativeElement.scrollTop = 0;
  }


  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      overview: 'Dashboard Overview',
      apartments: 'My Apartments',
      bookings: 'Booking Management'
    };
    return titles[this.activeSection] || 'Dashboard';
  }
}
