import { Component } from '@angular/core';
import {Searchbar} from '../../shared/components/searchbar/searchbar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    Searchbar,
    RouterOutlet
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
