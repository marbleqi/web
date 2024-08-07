import { Injectable } from '@angular/core';
import { BaseService } from '@shared';
import { Observable, Subject } from 'rxjs';

/**权限点服务 */
@Injectable()
export class AuthAbilityService extends BaseService {
  /**缓存的权限点Map */
  private dataMap: Map<number, any> = new Map<number, any>();
  /**数据变更订阅 */
  dataSub: Subject<any[]> = new Subject<any[]>();

  /**获取权限点列表 */
  index(init = false): void {
    if (init || !this.dataMap.size) {
      this.http.get(`auth/ability/index`).subscribe((res: any[]) => {
        for (const item of res) {
          this.dataMap.set(item.id, item);
        }
        this.dataSub.next(Array.from(this.dataMap.values()).sort((a: any, b: any) => a.id - b.id));
      });
    } else {
      this.dataSub.next(Array.from(this.dataMap.values()).sort((a: any, b: any) => a.id - b.id));
    }
  }

  /**
   * 获取权限点详情
   * @param id 权限点id
   * @returns 权限点详情
   */
  show(id: number): Observable<any> {
    return this.http.get(`auth/ability/show/${id}`);
  }

  /**
   * 设置某权限点的菜单或角色
   * @param type 对象类型，菜单或者角色
   * @param id 权限点id
   * @param params 待授权的对象数组ID
   * @returns 后端响应报文
   */
  grant(type: 'menu' | 'role', id: number, params: number[]): Observable<any> {
    return this.http.post(`auth/ability/${type}/${id}`, params);
  }
}
