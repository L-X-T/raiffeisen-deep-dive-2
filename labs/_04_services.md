# Lab: Services and Dependency Injection - Deep Dive

- [Lab: Services and Dependency Injection - Deep Dive](#lab-services-and-dependency-injection---deep-dive)
  - [Tree-shakable Providers and useClass](#tree-shakable-providers-and-useclass)
  - [Traditional Providers and useClass](#traditional-providers-and-useclass)
  - [Tree-shakable Providers and useFactory](#tree-shakable-providers-and-usefactory)
  - [Traditional Providers and useFactory](#traditional-providers-and-usefactory)
  - [DI-Scopes](#di-scopes)
    - [Local Services](#local-services)
  - [Bonus: Multi-Providers and InjectionToken<T>](#bonus-multi-providers-and-injectiontokent)
    - [Bonus: Multi-Providers *](#bonus-multi-providers-)
    - [Bonus: Tree-shakable Providers with InjectionToken<T> Constants *](#bonus-tree-shakable-providers-with-injectiontokent-constants-)
    - [Bonus: Traditional Providers with InjectionToken<T> Constants *](#bonus-traditional-providers-with-injectiontokent-constants-)
    - [Bonus: Multi-Providers and InjectionToken<T> *](#bonus-multi-providers-and-injectiontokent-)

## Tree-shakable Providers and useClass

1. Add a ``DefaultFlightService`` and a ``DummyFlightService``:

    ```
    ng g service flight-booking/default-flight
    ng g service flight-booking/dummy-flight
    ```

2. Open the existing ``flight.service.ts`` file and convert it into a **abstract** class:
   
    ```typescript
    // src/app/flight.service.ts

    import { Injectable } from '@angular/core';
    import { Observable } from 'rxjs';
    import { DefaultFlightService } from './default-flight.service';
    import { Flight } from './flight';

    @Injectable({
      providedIn: 'root',
      // Add this redirection:
      useClass: DefaultFlightService
    })
    // Make class abstract:
    export abstract class FlightService {

      // This methods becomes abstract too:
      abstract find(from: string, to: string): Observable<Flight[]>;

    }
    ```

3. Open the file ``default-flight.service.ts``. Let the ``DefaultFlightService`` implement the abstract ``FlightService`` class:

    ```typescript
    // src/app/default-flight.service.ts

    import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { Observable } from 'rxjs';
    import { Flight } from './flight';
    import { FlightService } from './flight.service';

    @Injectable({
      providedIn: 'root'
    })
    export class DefaultFlightService implements FlightService {

      constructor(public http: HttpClient) {}

      find(from: string, to: string): Observable<Flight[]> {
        const url = 'http://www.angular.at/api/flight';
        const headers = new HttpHeaders()
          .set('Accept', 'application/json');
        const params = new HttpParams()
          .set('from', from)
          .set('to', to);

        return this.http.get<Flight[]>(url, {headers, params});
      }
    }
    ```


4. Open the ``FlightSearchComponent`` and assure yourself that it uses the abstract ``FlightService`` as the injection token.
   
5. Start your application and check if the FlightSearchComponents gets the ``DefaultFlightService`` injected.

6. Now, let's switch to a different implementation of the ``FlightService``. 
   
   For this, open the file ``dummy-flight.service.ts`` and let it also implement the abstract ``FlightService``:
   
    ```typescript
    // src/app/dummy-flight.service.ts

    import { Injectable } from '@angular/core';
    import { Observable, of } from 'rxjs';
    import { Flight } from './flight';
    import { FlightService } from './flight.service';

    @Injectable({
      providedIn: 'root'
    })
    export class DummyFlightService implements FlightService {

      constructor(public http: HttpClient) {}

      find(from: string, to: string): Observable<Flight[]> {
        return of([
          { id: 1, from: 'Frankfurt', to: 'Flagranti', date: '2022-01-02T19:00+01:00' },
          { id: 2, from: 'Frankfurt', to: 'Kognito', date: '2022-01-02T19:30+01:00' },
          { id: 3, from: 'Frankfurt', to: 'Mallorca', date: '2022-01-02T20:00+01:00' }
        ]);
      }
    }
    ```

7. Open the ``flight.service.ts`` file again, and make it redirect to the ``DummyFlightService``:
   
    ```typescript
    // src/app/flight.service.ts

    import { Injectable } from '@angular/core';
    import { Observable } from 'rxjs';
    import { DummyFlightService } from './dummy-flight.service';
    import { Flight } from './flight';

    @Injectable({
      providedIn: 'root',
      // Redirect to DummyFlightService for the time being:
      useClass: DummyFlightService
    })
    export abstract class FlightService {
      abstract find(from: string, to: string): Observable<Flight[]>;
    }
    ```

8. Start your application (if it isn't still running) and check if the ``DummyFlightService`` is now used by the ``FlightSearchComponent``. 


## Traditional Providers and useClass

1. Open the file ``flight.service.ts`` and remove the settings provided to ``Injectable``:
    
    ```typescript
    // src/app/flight.service.ts

    @Injectable()
    export abstract class FlightService {
      abstract find(from: string, to: string): Observable<Flight[]>;
    }
    ```

2. Open the file ``app.module.ts`` and add a traditional provider for the ``FlightService``:

    ```typescript
    // src/app/app.module.ts

    [...]
    // Import services:
    import { FlightService } from './flight.service';
    import { DefaultFlightService } from './default-flight.service';

    @NgModule({
      imports: [
        [...]
      ],
      declarations: [
        [...]
      ],
      providers: [
          // Add service Provides
          {
            provide: FlightService,
            useClass: DefaultFlightService
          }
      ],
      bootstrap: [
          AppComponent
      ]
    })
    export class AppModule { }
    ```

3. Start the application (if it isn't still running) and assure yourself that the ``FlightSearchComponent`` uses the ``DefaultFlightService``.

4. Undo the performed changes so that you are using Tree-shakable providers again. Also test this.




## Tree-shakable Providers and useFactory

1. Open the file ``app.module.ts`` and **remove** the configured traditional provider.

1. Create a file ``flight-service.factory.ts``:
   
    ```typescript
    // src/app/flight-service.factory.ts

    import { HttpClient } from '@angular/common/http';
    import { DefaultFlightService } from './default-flight.service';
    import { DummyFlightService } from './dummy-flight.service';

    const DEBUG = false;

    export const createFlightService = (http: HttpClient) => {
        if (!DEBUG) {
            return new DefaultFlightService(http);
        }
        else {
            return new DummyFlightService();
        }
    };
    ```

2. Open the file ``flight.service.ts`` and add the following configuration to the ``Injectable`` provider:
   
    ```typescript
    // src/app/flight.service.ts

    [...]
    // New import:
    import { createFlightService } from './flight-service.factory';

    @Injectable({
      providedIn: 'root',
      useFactory: createFlightService,
      deps: [HttpClient]
    })
    export abstract class FlightService {
      abstract find(from: string, to: string): Observable<Flight[]>;
    }
    ```

4. Start your application and assure yourself that the used ``FlightService`` is now created by your factory. For this, you can switch the value of the constant ``DEBUG``.

## Traditional Providers and useFactory

1. Open the ``flight.service.ts`` file and remove the configuration passed to the ``Injectable`` Decorator

    ```typescript
    @Injectable()
    export abstract class FlightService {
      abstract find(from: string, to: string): Observable<Flight[]>;
    }
    ```

2. Open the file ``app.module.ts`` and introduce the following traditional provider:
   
```typescript
// src/app/app.module.ts

[...]

// New import:
import { createFlightService } from './flight-service.factory';

@NgModule({
   imports: [
     [...]
   ],
   declarations: [
     [...]
   ],
   providers: [
      {
         provide: FlightService,
         useFactory: createFlightService,
         deps: [HttpClient]
      }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
```

4. Start your application and assure yourself that the used ``FlightService`` is still created by your factory. For this, you can switch the value of the constant ``DEBUG``.



## DI-Scopes

### Local Services

1. Open the file ``flight-search.component.ts`` and introduce a local provider for the ``FlightSearchComponent``:
   
    ```typescript
    // src/app/flight-search/flight-search.component.ts

    [...]
    import { FlightService } from '../flight.service';
    // Add this import:
    import { DummyFlightService } from '../dummy-flight.service';

    @Component({
      [...]
      // Add this:
      providers: [
        {
          provide: FlightService,
          useClass: DummyFlightService
        }
      ]
    })
    export class FlightSearchComponent implements OnInit {

      [...]

      constructor(private flightService: FlightService) {
      }

      [...]

    }
    ```

2. Start your application (if it isn't still running) and assure yourself that the FlightSearchComponent uses the local ``DummyFlightService`` again.

3. Remove the introduced local service in ``flight-search.component.ts`` and assure yourself that the global ``DefaultFlightService`` is used again.


## Bonus: Multi-Providers and InjectionToken<T>

### Bonus: Multi-Providers *

1. Open the ``flight.service.ts`` file and remove the configuration passed to the ``Injectable`` Decorator (if it's still there):

    ```typescript
    @Injectable()
    export abstract class FlightService {
      abstract find(from: string, to: string): Observable<Flight[]>;
    }
    ```

2. Open the ``app.module.ts`` file and introduce the following multi-providers:

    ```typescript
    [...]
    providers: [
      {
          provide: FlightService,
          useClass: DefaultFlightService,
          multi: true
      },
      {
          provide: FlightService,
          useClass: DummyFlightService,
          multi: true
      }
    ],
    [...]
    ```

3. Open the file ``flight-search.component.ts``. Instead of a ``FlightService``, inject now a FlightService Array (``FlightService[]``):
   
    ```typescript
    // src/app/flight-search/flight-search.component.ts

    // Import Inject:
    import { Component, Inject, OnInit } from '@angular/core';
    [...]

    @Component( [...] )
    export class FlightSearchComponent implements OnInit {

      [...]

      // Change the next line:
      constructor(@Inject(FlightService) private flightServices: FlightService[]) {
      }

      search(): void {
        [...]
      }

      [...]

    }
    ```

    Please note, that we need to use Inject with the ``FlightService`` type, because Arrays (e. g. ``FlightService[]``) cannot be used as Tokens. Using constants of the type ``InjectionToken<T>`` as shown in the next section can help here.


4. Also, in the file ``flight-search.component.ts``, update the search method so that it uses all ``FlightService``s in the injected array:
   
    ```typescript
    // src/app/flight-search/flight-search.component.ts

    [...]

    // New import
    import { merge } from 'rxjs';

    @Component( [...] )
    export class FlightSearchComponent implements OnInit {

      constructor(@Inject(FlightService) private flightServices: FlightService[]) {
      }

      ngOnInit(): void {
      }

      search(): void {

        this.flights = [];

        const observables = this.flightServices.map(fs => fs.find(this.from, this.to));

        // Merge results of individual observables:
        const observable = merge(...observables);
          // This is the same as: merge(observables[0], observables[1], ...)

        observable.subscribe({
          next: (additionalFlights) => {
            this.flights = [...this.flights, ...additionalFlights];
              // Same as: [this.flights[0], this.flights[1], ..., additionalFlights[0], additionalFlights[1], ...]
          },
          error: (err) => {
            console.debug('Error', err);
          }
        });

      }

      [...]
    }
    ```

5. Start your application and assure yourself that both registered ``FlightService`` implementations are used.

### Bonus: Tree-shakable Providers with InjectionToken<T> Constants *

1. Create a file ``tokens.ts``:

    ```typescript
    // src/app/tokens.ts

    import { InjectionToken } from '@angular/core';

    export const BASE_URL = new InjectionToken<string>('BASE_URL', {
        providedIn: 'root',
        factory: () => 'http://demo.ANGULARarchitects.io/api/'
    });
    ```

2. Open the file ``default-flight.service.ts`` and inject the defined ``BASE_URL`` ``InjectionToken``:
    
    ```typescript
    // src/app/default-flight.service.ts

    // Add this import:
    import { BASE_URL } from './tokens';

    // Import Inject:
    import { Inject, Injectable } from '@angular/core';
    [...]

    @Injectable({
      providedIn: 'root'
    })
    export class DefaultFlightService implements FlightService {

      constructor(
        private http: HttpClient,
        // Inject BASE_URL:
        @Inject(BASE_URL) private baseUrl: string,
      ) { }

      find(from: string, to: string): Observable<Flight[]> {
        const url = this.baseUrl + 'flight';

        const headers = new HttpHeaders()
          .set('Accept', 'application/json');

        const params = new HttpParams()
          .set('from', from)
          .set('to', to);

        return this.http.get<Flight[]>(url, {headers, params});
      }

      [...]
    }
    ```

3. Start your application (if it's not still running) and assure yourself the new token is used.

### Bonus: Traditional Providers with InjectionToken<T> Constants *
   
1. Open the file ``tokens.ts`` and remove the configuration from the ``InjectionToken``:

    ```typescript
    export const BASE_URL = new InjectionToken<string>('BASE_URL');
    ```

2. Open the file ``app.module.ts`` and introduce the following provider:
   
    ```typescript
    providers: [
      {
          provide: BASE_URL,
          useValue: 'http://demo.ANGULARarchitects.io/api/'
      }
    ],
    ```

3. Start your application (if it's not still running) and assure yourself the new provider is used.

### Bonus: Multi-Providers and InjectionToken<T> *

As mentioned above, Arrays cannot be used a tokens. Hence, it's quite usual to combine Multi-Providers together with an InjectionToken<T>.

1. Open your ``tokens.ts`` file and add the following ``InjectionToken``:

    ```typescript
    export const FLIGHT_SERVICES = new InjectionToken<FlightService>('FLIGHT_SERVICES');
    ```

2. Open the file ``app.module.ts`` and introduce the following providers. If you already have them, update them accordingly:
   
    ```typescript
    providers: [
      {
          provide: FLIGHT_SERVICES,
          useClass: DefaultFlightService,
          multi: true
      },
      {
          provide: FLIGHT_SERVICES,
          useClass: DummyFlightService,
          multi: true
      },
    ],
    ```

3. Now, switch to your ``flight-search.component.ts`` and adjust the constructor as follows. Please note that ``@Inject`` points now to the ``FLIGHT_SERVICES`` ``InjectionToken`` introduced before:

    ```typescript
    [...]
    constructor(@Inject(FLIGHT_SERVICES) private flightServices: FlightService[]) {
    }
    [...]
    ```

4. Start your application (if it's not still running) and assure yourself the multi provider works.
