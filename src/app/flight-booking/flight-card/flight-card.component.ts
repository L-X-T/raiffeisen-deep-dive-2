// src/app/flight-card/flight-card.component.ts

import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Flight } from '../flight';

@Component({
  selector: 'flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightCardComponent implements OnInit, OnChanges {
  @Input() item?: Flight | null = null;
  @Input() selected = false;

  constructor(private element: ElementRef, private zone: NgZone) {
    console.debug('ctor', this.item);
  }

  ngOnInit() {
    console.debug('ngOnInit', this.item);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.debug('ngOnChanges', this.item);

    if (changes.item) {
      console.debug('ngOnChanges: item');
    }
    if (changes.selected) {
      console.debug('ngOnChanges: selected');
    }
  }

  blink() {
    // Dirty Hack used to visualize the change detector
    // let originalColor = this.element.nativeElement.firstChild.style.backgroundColor;
    this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';
    //              ^----- DOM-Element

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  }
}
