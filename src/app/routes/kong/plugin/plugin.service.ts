import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KongObjectService } from '..';

@Injectable()
export class KongPluginService extends KongObjectService {
  constructor() {
    super();
    this.type = 'plugin';
  }

  /**
   * 获取对象列表
   * @param instance 实例ID
   * @param init 初始化标记
   */
  enum(instance: number): Observable<any> {
    return this.http.get(`kong/plugin/${instance}/enum`);
  }
}
