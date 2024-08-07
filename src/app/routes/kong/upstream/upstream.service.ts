import { Injectable } from '@angular/core';

import { KongObjectService } from '..';

@Injectable()
export class KongUpstreamService extends KongObjectService {
  constructor() {
    super();
    this.type = 'upstream';
  }
}
