import { Injectable } from '@angular/core';

import { KongObjectService } from '..';

@Injectable()
export class KongServiceService extends KongObjectService {
  constructor() {
    super();
    this.type = 'service';
  }
}
