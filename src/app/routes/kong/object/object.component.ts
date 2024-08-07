import { Component, inject } from '@angular/core';
import { ListComponent } from '@shared';

import { KongInstanceService } from '..';

@Component({
  selector: 'app-kong-object',
  standalone: true,
  template: ''
})
export class KongObjectComponent extends ListComponent {
  /**当前KONG实例ID */
  protected id: number = 0;
  /**实例服务 */
  private readonly instanceSrv = inject(KongInstanceService);

  /**构造函数 */
  constructor() {
    super();
    this.reload = () => {};
    this.instanceSrv.idSub.subscribe(id => {
      console.debug('id', id);
      if (id) {
        this.id = id;
        this.reload();
      }
    });
  }
}
