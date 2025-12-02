import { Component } from '@angular/core';
import {Searchbar} from '../../shared/components/searchbar/searchbar';
import {PaginatedResults} from '../paginatedresults/paginated-results.component';

@Component({
  selector: 'app-home',
  imports: [
    Searchbar,
    PaginatedResults
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
