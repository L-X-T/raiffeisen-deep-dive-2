import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CUSTOMER_ROUTES } from './customer.routes';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(CUSTOMER_ROUTES)],
  declarations: [BookingHistoryComponent]
})
export class CustomerModule {}
