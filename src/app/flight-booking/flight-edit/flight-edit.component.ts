// src/app/flight-booking/flight-edit/flight-edit.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Observable, Observer, Subscription } from 'rxjs';
import { CanComponentDeactivate } from '../../shared/deactivation/can-deactivate.guard';
import { Flight } from '../flight';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateCity } from '../../shared/validation/city-validator';
import { FlightService } from '../flight.service';
import { validateAsyncCity } from '../../shared/validation/async-city-validator';
import { validateRoundTrip } from '../../shared/validation/round-trip-validator';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss']
})
export class FlightEditComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  id = 0;
  showDetails = false;

  sender: Observer<boolean> | undefined;
  showWarning = false;

  flight: Flight | undefined;

  editForm = this.fb.group({
    id: [0, Validators.required],
    from: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)], validateAsyncCity(this.flightService)],
    to: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity(['Graz', 'Wien', 'Hamburg', 'Berlin'])]],
    date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)]]
  });

  valueChangesSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private flightService: FlightService, private fb: FormBuilder, private router: Router) {
    this.editForm.validator = validateRoundTrip;
  }

  ngOnInit(): void {
    console.log(this.router.url);
    console.log(this.route.snapshot);
    this.id = this.route.snapshot.params.id;
    this.showDetails = this.route.snapshot.params.showDetails;

    this.route.paramMap.pipe(delay(2000)).subscribe((p) => {
      console.log('route params received:', p);

      this.showDetails = p.get('showDetails') === 'true';
      console.log('showDetails set to:', this.showDetails);

      this.id = Number(p.get('id'));
      const idAsString = '' + this.id;
      console.log('number:', this.id);
      console.log('string:', idAsString);
    });

    this.route.data.subscribe((data) => {
      this.flight = data.flight;
      this.editForm.patchValue(data.flight);
    });

    console.log('value', this.editForm.value);
    console.log('valid', this.editForm.valid);
    console.log('touched', this.editForm.touched);
    console.log('dirty', this.editForm.dirty);

    this.valueChangesSubscription = this.editForm.valueChanges.subscribe((v) => {
      console.debug('valueChanges', v);
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
  }

  onRoute(): void {
    const showDetails = !this.showDetails;
    this.router
      .navigate(['flight-booking', 'flight-edit', this.id, { showDetails }])
      .then(() => console.log('navigated to showDetails:', showDetails));
  }

  decide(decision: boolean): void {
    this.showWarning = false;
    if (this.sender) {
      this.sender.next(decision);
      this.sender.complete();
    }
  }

  canDeactivate(): Observable<boolean> {
    return new Observable((sender: Observer<boolean>) => {
      this.sender = sender;
      this.showWarning = true;
    });
  }

  save(): void {
    console.log(this.editForm?.value);
  }
}
