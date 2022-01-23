// src/app/flight-booking/flight-booking.module.ts

import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';
import { RouterModule } from '@angular/router';
import { FLIGHT_BOOKING_ROUTES } from './flight-booking.routes';
import { FlightBookingComponent } from './flight-booking.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FormsModule } from '@angular/forms';
import { AirportComponent } from './airport/airport.component';
import { FlightService } from './flight.service';
import { createFlightService } from './flight-service.factory';
import { HttpClient } from '@angular/common/http';
import { FlightResolver } from './flight-search/flight.resolver';

@NgModule({
  imports: [RouterModule.forChild(FLIGHT_BOOKING_ROUTES), FormsModule, SharedModule],
  declarations: [
    FlightSearchComponent,
    FlightCardComponent,
    PassengerSearchComponent,
    FlightBookingComponent,
    FlightEditComponent,
    AirportComponent
  ],
  providers: [
    FlightResolver,
    {
      provide: FlightService,
      useFactory: createFlightService,
      deps: [HttpClient]
    }
  ],
  exports: [FlightSearchComponent]
})
export class FlightBookingModule {}
