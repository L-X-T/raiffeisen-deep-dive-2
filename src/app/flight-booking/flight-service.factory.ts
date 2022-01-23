import { HttpClient } from '@angular/common/http';
import { DefaultFlightService } from './default-flight.service';
import { DummyFlightService } from './dummy-flight.service';

import { environment } from '../../environments/environment';

const DEBUG = !environment.production;

export const createFlightService = (http: HttpClient) => {
  if (DEBUG) {
    return new DummyFlightService(http);
  } else {
    return new DefaultFlightService(http);
  }
};
