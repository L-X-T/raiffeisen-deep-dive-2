import { Component } from '@angular/core';
import {
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hello World!';

  showLoadingIndicator = false;

  constructor(private router: Router) {
    router.events.pipe(filter((e) => e instanceof NavigationStart || e instanceof GuardsCheckEnd)).subscribe((event) => {
      this.showLoadingIndicator = true;
    });

    router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationEnd || e instanceof NavigationError || e instanceof NavigationCancel || e instanceof GuardsCheckStart
        )
      )
      .subscribe((event) => {
        this.showLoadingIndicator = false;
      });
  }
}
