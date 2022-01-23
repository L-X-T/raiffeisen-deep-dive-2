import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flight } from './flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  flights: Flight[] = [];
  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly flights$ = this.flightsSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  find(from: string, to: string): Observable<Flight[]> {
    const url = 'http://www.angular.at/api/flight';

    const headers = new HttpHeaders().set('Accept', 'application/json');

    const params = new HttpParams().set('from', from).set('to', to);

    return this.http.get<Flight[]>(url, { headers, params });
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
}
