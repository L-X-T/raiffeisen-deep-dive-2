# Labs: Data Binding with OnPush

- [Labs: Data Binding with OnPush](#labs-data-binding-with-onpush)
  - [Discovering Default Change Detection Behavior](#discovering-default-change-detection-behavior)
  - [On-Push with Immutables](#on-push-with-immutables)
  - [On-Push with Observables and Subjects](#on-push-with-observables-and-subjects)

In this exercise, you will explore Angular's default change tracking behavior and the OnPush strategy. For this, you'll implement the flux pattern using Observables and Immutables.

## Discovering Default Change Detection Behavior

1. Open the file `flight-search.component.ts` and discover the `FlightSearchComponent`. 
    Have a look to the method ``delay`` which is bound to the button with the label `Delay 1st Flight`.

2. Open the file `flight-card.component.ts` and add have a look to the `blink` method. 

3. Move to the file `flight-card.component.html` and create a data binding for this method at the end:
    ```
    {{ blink() }}
    ```
    Please note that binding methods is not a good idea with respect to performance. We do it here just to visualize the change tracker.
    
4. Open the solution in the browser and search for flights form `Hamburg` to `Graz`. 

5. Click the button `Delay` and see that just the first flight gets a new date. But you also see that every component is checked for changes by Angular b/c every component blinks.

## On-Push with Immutables

1. Open the file `flight-card.component.ts`. Switch on `OnPush` for your `FlightCard`.

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    
    import {ChangeDetectionStrategy} from '@angular/core';
    [...]
    @Component({
      selector: 'flight-card',
      templateUrl: 'flight-card.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class FlightCardComponent {
      [...]
    }
    ```

    </p>
    </details>

2. Open the `flight.service.ts` and alter it to update the selected flight's date in an *immutable* way:

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    // libs/flight-lib/src/services/flight.service.ts
    
    delay(): void {
      const ONE_MINUTE = 1000 * 60;

      const oldFlights = this.flights;
      const oldFlight = oldFlights[0];
      const oldDate = new Date(oldFlight.date);
        
      // Mutable
      // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE );
      // oldFlight.date = oldDate.toISOString();

      // Immutable
      const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
      const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
      const newFlights = [ newFlight, ...oldFlights.slice(1) ]
      this.flights = newFlights;
    }
    ```

</p>
</details>

You find some information about the object spread operator (e. g. `...oldFlight`) [here](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html) (scroll down to Object Spread) and about the array spread operator (e. g. [newFlight, ...oldFlights.slice(1)]) [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).

1. Make sure your implementation works. Switch to the browser and search for flights again. Click `Delay` one more time and find out that Angular is just checking and updating the first flight card.

## On-Push with Observables and Subjects

1. Switch to the `flight-lib`. Open the file `flight.service.ts` and introduce the following two members:

    ```typescript
    export class FlightService {

      [...]

      private flightsSubject = new BehaviorSubject<Flight[]>([]);
      // eslint-disable-next-line @typescript-eslint/member-ordering
      readonly flights$ = this.flightsSubject.asObservable();

      [...]
    }
    ```

2. Scroll down to the service's `load` method. Publish the fetched `flight` array with the `flightsSubject`.

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
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
    ```

    </p>
    </details>

3. Scroll further down to the service's `delay` method. At the end of this method, publish the updated `flight` array with the subject.

    <details>
    <summary>Show Code</summary>
    <p>

    ```typescript
    delay(): void {
      [...]

      // Immutable
      const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
      const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
      const newFlights = [newFlight, ...oldFlights.slice(1)];
      this.flightsSubject.next(newFlights);
      this.flights = newFlights;
    }

    ```

    </p>
    </details>

4. Switch to the `flight-app`. Open to the file `flight-search.component.ts` and introduce a member `flights$`:

    ```javascript
    flights$ = this.flightService.flights$;
    ```

5. Open the file `flight-search.component.html` and change the `*ngFor` loop so that it iterates over all flights provided by the `flights$` observable. For this, you have to use the `async` pipe:

    ```html
    <div *ngFor="let f of flights$ | async">
      [...]
    </div>
    ```

6. Also, in this file, add the following *ngIf to the following div to "unwrap" the flights$ observable into a flights variable: 

    ```html
    <div class="form-group" *ngIf="flights$ | async as flights">
      <button class="btn btn-default" [disabled]="!from || !to" (click)="search()">
        Search
      </button>

      <button *ngIf="flights.length > 0" class="btn btn-default" (click)="delay()">
        Delay 1st Flight
      </button>

      <div *ngIf="flights.length > 0">
        {{flights.length}} flights found!
      </div>
    </div>
    ```
7. Start your solution and make sure it works.
