import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-searchbar',
  imports: [
    FormsModule
  ],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css'
})
export class Searchbar implements OnInit {
  location: string="";
  checkInDate: string="";
  checkOutDate:  string="";
  guestCount: string='3 adults · 0 children · 1 room';
  pageNumber: number = 0;
  pageSize: number = 10;
  @ViewChild('locationInput') locationInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) {
  }

  ngOnInit(): void{
    //TODO: implement logic
  }

  ngAfterViewInit(): void {
    this.locationInput.nativeElement.focus();
  }

  onSearch(): void{
    const searchParams = {
      location: this.location,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.router.navigate(['/results'], {queryParams: searchParams});
  }

  clearLocation(): void{
    this.location="";
  }
}
