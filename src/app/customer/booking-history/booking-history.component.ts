import { Component } from '@angular/core';

import { FlightSearchComponent } from '../../flight-booking/flight-search/flight-search.component';

import { Flight } from '../../flight-booking/flight';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss']
})
export class BookingHistoryComponent {
  flightSearchComponent = FlightSearchComponent;

  flights: Flight[] = [
    { id: 1, from: 'Hamburg', to: 'Berlin', date: '2025-02-01T17:00+01:00' },
    { id: 2, from: 'Hamburg', to: 'Frankfurt', date: '2025-02-01T17:30+01:00' },
    { id: 3, from: 'Hamburg', to: 'Mallorca', date: '2025-02-01T17:45+01:00' }
  ];

  delete(): void {
    console.debug('delete ...');
  }
}
