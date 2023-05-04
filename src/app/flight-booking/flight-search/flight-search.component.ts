// src/app/flight-search/flight-search.component.ts

import { Component, ViewChild } from '@angular/core';
import { Flight } from '../flight';
import { FlightService } from '../flight.service';
import { DefaultFlightService } from '../default-flight.service';
import { NgForm } from '@angular/forms';

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
  @ViewChild('form') flightSearchForm?: NgForm;
  from = '';
  to = '';
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

  get flights(): Flight[] {
    // We will refactor this to an observable in a later exercise!
    return this.flightService.flights;
  }

  search(): void {
    if (this.flightSearchForm?.invalid) {
      this.markFormGroupDirty(this.flightSearchForm);
      return;
    }

    this.flightService.load(this.from, this.to);
  }

  select(f: Flight): void {
    this.selectedFlight = f;
  }

  delay(): void {
    this.flightService.delay();
  }

  private markFormGroupDirty(formGroup: NgForm): void {
    Object.values(formGroup.controls).forEach((c) => c.markAsDirty());
  }
}
