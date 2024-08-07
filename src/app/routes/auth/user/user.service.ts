import { Injectable } from '@angular/core';
import { ListService } from '@shared';
import { Observable } from 'rxjs';

/**用户服务 */
@Injectable()
export class AuthUserService extends ListService {
  constructor() {
    super('auth/user');
  }

  /**
   * 批量更新对象状态
   * @param ids 对象ID数组
   * @returns 后端响应报文
   */
  unlock(...ids: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/unlock`, { ids });
  }

  /**
   * 批量更新对象状态
   * @param ids 对象ID数组
   * @returns 后端响应报文
   */
  resetpsw(value: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/resetpsw`, value);
  }
}
