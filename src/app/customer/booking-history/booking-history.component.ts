import { Component } from '@angular/core';

import { FlightSearchComponent } from '../../flight-booking/flight-search/flight-search.component';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent {
  flightSearchComponent = FlightSearchComponent;

  delete(): void {
    console.debug('delete ...');
  }
}
