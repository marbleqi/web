import { Injectable } from '@angular/core';
import { ListService } from '@shared';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class KongInstanceService extends ListService {
  /**当前选中的实例ID */
  id: number = 0;
  /**实例ID变更订阅 */
  idSub: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**构造函数 */
  constructor() {
    super('kong/instance');
    this.idSub.subscribe(id => {
      this.id = id;
    });
  }
}
