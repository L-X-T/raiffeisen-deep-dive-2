import { Component, OnInit } from '@angular/core';
import { TabbedPaneService } from '../tabbed-pane/tabbed-pane.service';

@Component({
  selector: 'app-tab-navigator',
  templateUrl: './tab-navigator.component.html',
  styleUrls: ['./tab-navigator.component.scss']
})
export class TabNavigatorComponent implements OnInit {
  page = 0;
  pageCount = 0;

  // Inject service here:
  constructor(private service: TabbedPaneService) {}

  ngOnInit(): void {
    this.service.pageCount.subscribe((pageCount) => {
      this.pageCount = pageCount;
    });
    this.service.currentPage.subscribe((page) => {
      this.page = page;
    });
  }

  prev(): void {
    if (this.page <= 1) {
      return;
    }
    this.page--;

    // Add: Notify service:
    this.service.currentPage.next(this.page);
  }

  next(): void {
    if (this.page >= this.pageCount) {
      return;
    }
    this.page++;

    // Add: Notify service:
    this.service.currentPage.next(this.page);
  }
}
