import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { first, map, Observable, Observer, Subject, Subscription, take, takeUntil } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { AirportService } from './airport.service';

@Component({
  selector: 'flight-workspace-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportComponent implements OnInit, OnDestroy {
  protected isLoading = true;

  protected airports$?: Observable<string[]> | undefined;
  private airportsObserver?: Observer<string[]>;
  private airportsSubscription?: Subscription;

  private onDestroySubject = new Subject<void>();
  readonly terminator$ = this.onDestroySubject.asObservable();

  protected airports: string[] = [];

  constructor(private airportService: AirportService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.airports$ = this.airportService.findAll().pipe(
      // map((airports) => []),
      delay(2000),
      share()
    );

    this.airportsObserver = {
      next: (airports) => {
        console.log(airports);
        this.airports = airports;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        console.error(err);
      },
      complete: () => console.warn('complete!')
    };

    // var 1 subscription
    this.airportsSubscription = this.airports$.subscribe(this.airportsObserver);

    // var 2 takeUntil
    this.airports$.pipe(takeUntil(this.terminator$)).subscribe(this.airportsObserver);
  }

  ngOnDestroy(): void {
    // var 1 subscription
    // console.warn('unsubscribe!');
    this.airportsSubscription?.unsubscribe();

    // var 2 takeUntil
    this.onDestroySubject.next(void 0);
    this.onDestroySubject.complete();
  }
}
