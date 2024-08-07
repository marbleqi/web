import { BaseService } from '@shared';
import { Observable, Subject, map } from 'rxjs';

export class KongObjectService extends BaseService {
  /**当前选中的实例 */
  instance: number = 0;
  /**数据类型 */
  protected type: string = '';
  /**缓存的数据列表 */
  dataMap: Map<string, any> = new Map<string, any>();
  /**数据变更订阅 */
  dataSub: Subject<any[]> = new Subject<any[]>();

  /**
   * 获取对象列表
   * @param instance 实例ID
   * @param init 初始化标记
   */
  list(instance: number, init: boolean = false): void {
    console.debug(`KongObjectService.list(${instance}, ${init})`, 'this.dataMap.size', this.dataMap.size);
    if (this.instance !== instance || init || !this.dataMap.size) {
      this.instance = instance;
      this.dataMap.clear();
      this.http.get(`kong/${this.type}/${instance}/list`).subscribe((res: any[]) => {
        for (const item of res) {
          this.dataMap.set(item.id, item);
        }
        this.dataSub.next(Array.from(this.dataMap.values()).sort((a, b) => b.updated_at - a.updated_at));
      });
    } else {
      this.dataSub.next(Array.from(this.dataMap.values()).sort((a, b) => b.updated_at - a.updated_at));
    }
  }

  /**
   * 获取对象详情
   * @param instance 实例ID
   * @param id 对象ID
   * @returns 对象详情
   */
  get(instance: number, id: string): Observable<any> {
    return this.http.get(`kong/${this.type}/${instance}/get/${id}`).pipe(
      map((res: any) => {
        if (this.instance === instance) {
          this.dataMap.set(res.id, res);
        }
        return res;
      })
    );
  }

  /**
   * 创建对象
   * @param instance 实例ID
   * @param value 新对象值
   * @returns 创建结果
   */
  create(instance: number, value: any): Observable<any> {
    console.debug('create', value);
    return this.http.post(`kong/${this.type}/${instance}/create`, value).pipe(
      map((res: any) => {
        if (this.instance === instance) {
          this.dataMap.set(res.id, res);
        }
        return res.value;
      })
    );
  }

  /**
   * 更新对象
   * @param instance 实例ID
   * @param id 对象ID
   * @param value 新对象值
   * @returns 更新结果
   */
  update(instance: number, id: string, value: any): Observable<any> {
    return this.http.post(`kong/${this.type}/${instance}/update/${id}`, value).pipe(
      map((res: any) => {
        if (this.instance === instance) {
          this.dataMap.set(res.id, res);
        }
        return res;
      })
    );
  }

  /**
   * 删除对象
   * @param instance 实例ID
   * @param id 对象ID
   * @returns 删除结果
   */
  distory(instance: number, id: string): Observable<any> {
    return this.http.delete(`kong/${this.type}/${instance}/distory/${id}`).pipe(
      map((res: any) => {
        if (this.instance === instance) {
          this.dataMap.delete(id);
        }
        return res;
      })
    );
  }
}
