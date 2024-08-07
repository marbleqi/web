import { Injectable } from '@angular/core';

import { KongObjectService } from '..';

@Injectable()
export class KongRouteService extends KongObjectService {
  constructor() {
    super();
    this.type = 'route';
  }
}
