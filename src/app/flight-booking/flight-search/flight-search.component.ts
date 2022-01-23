// src/app/flight-search/flight-search.component.ts

import { Component } from '@angular/core';
import { Flight } from '../flight';
import { FlightService } from '../flight.service';
import { DefaultFlightService } from '../default-flight.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss'],
  providers: [
    {
      provide: FlightService,
      useClass: DefaultFlightService
    }
  ]
})
export class FlightSearchComponent {
  from = 'Hamburg';
  to = 'Graz';
  selectedFlight: Flight | null = null;
  delayFilter = false;

  basket: { [key: number]: boolean } = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    3: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    5: true
  };

  flights$ = this.flightService.flights$;

  constructor(private flightService: FlightService) {}

  get flights() {
    // We will refactor this to an observable in a later exercise!
    return this.flightService.flights;
  }

  search(): void {
    this.flightService.load(this.from, this.to);
  }

  select(f: Flight): void {
    this.selectedFlight = f;
  }

  delay(): void {
    this.flightService.delay();
  }
}
