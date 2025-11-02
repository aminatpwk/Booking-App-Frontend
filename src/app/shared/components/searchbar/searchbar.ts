import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [
    FormsModule
  ],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css'
})
export class Searchbar {
  location: string="";
  checkInDate: string="";
  checkOutDate:  string="";
  guestCount: string='3 adults · 0 children · 1 room';

  constructor() {
  }

  ngOnInit(): void{
    //TODO: implement logic
  }

  onSearch(): void{
    //TODO: implement logic
  }

  clearLocation(): void{
    this.location="";
  }
}
