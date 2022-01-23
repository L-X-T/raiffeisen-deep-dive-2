import { AfterContentInit, AfterViewInit, Component, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { TabNavigatorComponent } from '../tab-navigator/tab-navigator.component';

@Component({
  selector: 'app-tabbed-pane',
  templateUrl: './tabbed-pane.component.html',
  styleUrls: ['./tabbed-pane.component.scss']
})
export class TabbedPaneComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(TabComponent)
  tabQueryList: QueryList<TabComponent> | undefined;

  @ViewChild('navigator')
  navigator: TabNavigatorComponent | undefined;

  activeTab: TabComponent | undefined;
  currentPage = 1;

  get tabs(): TabComponent[] {
    return this.tabQueryList?.toArray() ?? [];
  }

  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      this.activate(this.tabs[0]);
    }
  }

  ngAfterViewInit(): void {
    if (this.navigator) {
      this.navigator.pageCount = this.tabs.length;
      // This line would cause a cycle:
      // this.navigator.page = 1;
      this.navigator.pageChange.subscribe((page: number) => {
        this.pageChange(page);
      });
    }
  }

  register(tab: TabComponent): void {
    this.tabs.push(tab);
  }

  activate(active: TabComponent): void {
    for (const tab of this.tabs) {
      tab.visible = tab === active;
    }
    this.activeTab = active;
  }

  pageChange(page: number): void {
    this.activate(this.tabs[page - 1]);
  }
}
