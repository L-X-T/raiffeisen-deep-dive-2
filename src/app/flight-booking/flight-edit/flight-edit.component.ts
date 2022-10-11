// src/app/flight-booking/flight-edit/flight-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.scss']
})
export class FlightEditComponent implements OnInit {
  id = 0;
  showDetails = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

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
  }

  onRoute(): void {
    const showDetails = !this.showDetails;
    this.router
      .navigate(['flight-booking', 'flight-edit', this.id, { showDetails }])
      .then(() => console.log('navigated to showDetails:', showDetails));
  }
}
