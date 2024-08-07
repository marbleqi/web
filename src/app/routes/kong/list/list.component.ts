import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SFSchema, SFUISchema, SFSchemaEnum } from '@delon/form';
import { SHARED_IMPORTS, BaseComponent } from '@shared';
import { BehaviorSubject } from 'rxjs';

import { KongInstanceService } from '..';

@Component({
  selector: 'app-kong-list',
  standalone: true,
  imports: [...SHARED_IMPORTS, RouterOutlet],
  templateUrl: './list.component.html'
})
export class KongListComponent extends BaseComponent {
  /**实例选项订阅 */
  instanceSub: BehaviorSubject<SFSchemaEnum[]> = new BehaviorSubject<SFSchemaEnum[]>([]);
  /**表单配置 */
  schema: SFSchema = { properties: { id: { type: 'number', title: '实例' } } };
  /**表单样式 */
  ui: SFUISchema = {
    '*': { spanLabelFixed: 100 },
    $id: {
      widget: 'select',
      width: 200,
      mode: 'default',
      change: (value: number) => {
        console.debug('实例ID变化', value);
        this.instanceSrv.idSub.next(value);
      },
      asyncData: () => this.instanceSub
    }
  };
  /**表单初始数据 */
  i: any;

  constructor(private instanceSrv: KongInstanceService) {
    super();
    this.main = 'kong';
    this.reload = () => {
      this.instanceSrv.index();
    };
    this.instanceSrv.dataSub.subscribe((res: any[]) => {
      if (res.length && !this.i?.id) {
        this.instanceSrv.idSub.next(res[0].id);
        this.i = { id: res[0].id };
      }
      this.instanceSub.next(res.map((item: any) => ({ label: item.name, value: item.id })));
    });
  }
}
