# Unit-Testing

- [Unit-Testing](#unit-testing)
  - [Preparation](#preparation)
  - [Unit-Test for a Component](#unit-test-for-a-component)
  - [Simulate HTTP calls](#simulate-http-calls)
  - [Bonus: Unit-Test with Mocking \*](#bonus-unit-test-with-mocking-)
  - [Bonus: Interact with the Template \*\*](#bonus-interact-with-the-template-)

## Preparation

If you have `.spec.ts` files in your project delete them now. Those test files were generated by the CLI automatically, but we did not update them during this training and therefore they would fail.

## Unit-Test for a Component

In this exercise you will create a Unit-Test in the file `flight-search.component.spec.ts`. This Unit-Test uses special Testing implementations for some Modules in the `beforeEach()` method inside `TestBed`. Afterwards it test whether the `FlightSearchComponent` has no Flights assigned after the instantiation.

<details>
<summary>Show code</summary>
<p>

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FlightSearchComponent } from './flight-search.component';
import { FlightBookingModule } from '../flight-booking.module';
import { SharedModule } from '../../shared/shared.module';

describe('Unit test: FlightSearchComponent', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FlightBookingModule, SharedModule],
      providers: [
        // Add Providers if you need them for your tests
      ],
    });

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not have any flights loaded initially', () => {
    expect(component.flights.length).toBe(0);
  });
});
```

</p>
</details>

Start your test with the command `npm test`.

## Simulate HTTP calls

1. Import the `HttpClientTestingModule` instead of the `HttpClientModule` in the `TestBed`.

2. Test whether the `search()` method loads Flights. Use the `HttpTestingController` to simulate a HTTP respond:

   <details>
   <summary>Show code</summary>
   <p>

   ```typescript
   describe('Unit test: flight-search.component', () => {
       […]

       beforeEach(async () => {
           […]
       });

       it('should load flights when user entered from and to', () => {
           component.from = 'Graz';
           component.to = 'Hamburg';
           component.search();

           const httpTestingController: HttpTestingController
               = TestBed.inject(HttpTestingController);

           const req = httpTestingController.expectOne(
               'http://www.angular.at/api/flight?from=Graz&to=Hamburg'
           );
           // req.request.method === 'GET'

           req.flush([{
               id: 22,
               from: 'Graz',
               to: 'Hamburg',
               date: ''
           }]);

           expect(component.flights.length).toBe(1);
       });
   });
   ```

   </p>
   </details>

3. Start your test with the command `npm test`.

## Bonus: Unit-Test with Mocking \*

In this exercise you will create a Mock for the `FlightService` that will be provided for `FlightSearchComponent` in the `TestBed`. Afterwards you will implement two test based on this Mock.

- Test whether the Flights are loaded if `from` and `to` are set.

- Test whether **no** Flights are loaded if `from` and `to` are **not** set.

Extend the `search()` method of the `FlightSearchComponent` so that the test works.

Follow the steps below:

1. Open the file `flight-search.component.ts` and extend the `search` method by a simple validation logic which will be tested in the Unit-Test afterwards:

   ```TypeScript
   search(): void {
       if (!this.from || !this.to) {
           return;
       }
       […]
   }
   ```

2. Open the file `flight-search.spec.ts` and add a Mock-Object for the `FlightService` as well as for Components, Directives and Pipes used.

   <details>
   <summary>Show code</summary>
   <p>

   ```TypeScript
   describe('Unit test with service mock: flight-search.component', () => {
       let component: FlightSearchComponent;
       let fixture: ComponentFixture<FlightSearchComponent>;
       const result = [
           { id: 17, from: 'Graz', to: 'Hamburg', date: 'now', delayed: true },
           { id: 18, from: 'Vienna', to: 'Barcelona', date: 'now', delayed: true },
           { id: 19, from: 'Frankfurt', to: 'Salzburg', date: 'now', delayed: true },
       ];

       const flightServiceMock = {
           find(from: string, to: string): Observable<Flight[]> {
               return of(result);
           },
           // Implement the following members only if this code is used in your Component
           flights: [] as Flight[],
           load(from: string, to: string): void {
               this.find(from, to).subscribe(f => { this.flights = f; });
           }
       };

       @Component({ selector: 'app-flight-card', template: '' })
       class FlightCardComponent {
           @Input() item: Flight;
           @Input() selected: boolean;
           @Output() selectedChange = new EventEmitter<boolean>();
       }

       // tslint:disable-next-line: directive-selector
       @Directive({ selector: 'input[city]' })
       class CityValidatorDirective {
           @Input() city: string[];
           validate = _ => null;
       }

       // tslint:disable-next-line: use-pipe-transform-interface
       @Pipe({ name: 'city' })
       class CityPipe implements PipeTransform {
           transform = v => v;
       }

       […]
   });
   ```

   </p>
   </details>

3. Extend the `beforeEach()` method of your Test to define that your `FlightSearchComponent` uses the Mock-Object instead the regularly used `FlightServices` implementation. Use the `overrideComponent()` method of the `TestBed`.

   In case you implemented an `AbstractFlightService` Token, be aware to use your Mock for this Token.

   <details>
   <summary>Show code</summary>
   <p>

   ```TypeScript
   describe('Unit test with service mock: flight-search.component', () => {
       […]

       beforeEach(async () => {
           TestBed.configureTestingModule({
               imports: [
                   FormsModule
               ],
               declarations: [
                   FlightSearchComponent,
                   FlightCardComponent,
                   CityPipe,
                   CityValidatorDirective
               ]
           })
           .overrideComponent(FlightSearchComponent, {
               set: {
                   providers: [
                       {
                           provide: FlightService,
                           useValue: flightServiceMock
                       }
                   ]
               }
           });

           fixture = TestBed.createComponent(FlightSearchComponent);
           component = fixture.componentInstance;
           fixture.detectChanges();
       });

       […]
   });
   ```

   </p>
   </details>

   Because `flightServiceMock` is an object and not a class, you need to use `useValue` instead of `useClass`.

4. Implement a Test `should not load flights w/o from and to` and another `should not load flights w/ from and to`. Those Tests shall test the behavior described above.

   <details>
   <summary>Show code</summary>
   <p>

   ```TypeScript
   describe('Unit test with service mock: flight-search.component', () => {
       […]

       it('should not load flights w/o from and to', () => {
           component.from = '';
           component.to = '';
           component.search();

           expect(component.flights.length).toBe(0);
       });

       it('should load flights w/ from and to', () => {
           component.from = 'Hamburg';
           component.to = 'Graz';
           component.search();

           expect(component.flights.length).toBeGreaterThan(0);
       });
   });
   ```

   </p>
   </details>

5. Start your test with the command `npm test`.
