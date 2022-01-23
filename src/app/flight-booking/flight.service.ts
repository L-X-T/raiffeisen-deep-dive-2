import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flight } from './flight';
// import { DefaultFlightService } from './default-flight.service';
// import { DummyFlightService } from './dummy-flight.service';

import { createFlightService } from './flight-service.factory';

@Injectable({
  providedIn: 'root',
  useFactory: createFlightService,
  deps: [HttpClient]
})
export abstract class FlightService {
  flights: Flight[] = [];
  flightsSubject = new BehaviorSubject<Flight[]>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly flights$ = this.flightsSubject.asObservable();

  protected constructor(public http: HttpClient) {}

  load(from: string, to: string): void {
    const o = this.find(from, to).subscribe(
      (flights) => {
        this.flights = flights;

        // Add this line:
        this.flightsSubject.next(flights);
      },
      (err) => console.error('Error loading flights', err)
    );
  }

  delay(): void {
    const ONE_MINUTE = 1000 * 60;
    const oldFlights = this.flights;
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);

    // Mutable
    // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    // oldFlight.date = oldDate.toISOString();

    // Immutable
    const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
    const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
    const newFlights = [newFlight, ...oldFlights.slice(1)];
    this.flightsSubject.next(newFlights);
    this.flights = newFlights;
  }

  abstract find(from: string, to: string): Observable<Flight[]>;
}
