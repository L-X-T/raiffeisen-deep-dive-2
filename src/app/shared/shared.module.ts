// src/app/shared/shared.module.ts

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateComponent } from './date/date.component';
import { CityPipe } from './city.pipe';
import { StatusColorPipe } from './status-color.pipe';
import { StatusFilterPipe } from './status-filter.pipe';
import { FormsModule } from '@angular/forms';

import { TabbedPaneComponent } from './controls/tabbed-pane/tabbed-pane.component';
import { TabComponent } from './controls/tab/tab.component';
import { TabNavigatorComponent } from './controls/tab-navigator/tab-navigator.component';
import { ClickWithWarningDirective } from './controls/click-with-warning.directive';
import { TooltipDirective } from './tooltip.directive';
import { TableFieldDirective } from './controls/data-table/table-field.directive';
import { DataTableComponent } from './controls/data-table/data-table.component';
import { AuthService } from './auth/auth.service';

import { CityValidatorDirective } from './validation/city-validator.directive';
import { AsyncCityValidatorDirective } from './validation/async-city-validator.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    DateComponent,
    CityPipe,
    StatusColorPipe,
    StatusFilterPipe,

    TabbedPaneComponent,
    TabComponent,
    TabNavigatorComponent,
    ClickWithWarningDirective,
    TooltipDirective,
    TableFieldDirective,
    DataTableComponent,

    CityValidatorDirective,
    AsyncCityValidatorDirective
  ],
  exports: [
    DateComponent,
    CityPipe,
    StatusColorPipe,
    StatusFilterPipe,
    FormsModule,
    CommonModule,

    TabbedPaneComponent,
    TabComponent,
    TabNavigatorComponent,
    ClickWithWarningDirective,
    TooltipDirective,
    TableFieldDirective,
    DataTableComponent,

    CityValidatorDirective,
    AsyncCityValidatorDirective
  ]
})
export class SharedModule {
  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [AuthService]
    };
  }
}
