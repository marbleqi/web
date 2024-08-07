import { Injectable } from '@angular/core';
import { ListService } from '@shared';
import { Observable } from 'rxjs';

@Injectable()
export class AuthRoleService extends ListService {
  /**构造函数 */
  constructor() {
    super('auth/role');
  }

  /**
   * 设置某角色的用户清单
   * @param id 角色
   * @param users 待授权的用户ID数组
   * @returns 后端响应报文
   */
  grant(id: number, users: number[]): Observable<any> {
    return this.http.post(`auth/role/users/${id}`, users);
  }
}
