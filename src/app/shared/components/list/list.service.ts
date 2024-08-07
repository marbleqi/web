import { BaseService } from '@shared';
import { Observable, Subject } from 'rxjs';

/**通用对象服务 */
export class ListService extends BaseService {
  /**基本路径 */
  protected readonly baseUrl: string;
  /**最新操作ID */
  private operateId: number = 0;
  /**缓存的数据列表 */
  dataMap: Map<number, any> = new Map<number, any>();
  /**数据变更订阅 */
  dataSub: Subject<any[]> = new Subject<any[]>();

  /**
   * 构造函数
   * @param baseUrl 基本路径
   */
  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  /**
   * 获取用户列表
   * @param init 重置标记
   */
  index(init: boolean = false): void {
    if (init) {
      this.operateId = 0;
      this.dataMap.clear();
    }
    this.http.get(`${this.baseUrl}/index`, { operateId: this.operateId }).subscribe((res: any[]) => {
      if (res.length) {
        for (const item of res) {
          this.dataMap.set(item.id, item);
        }
        this.operateId = Math.max(...res.map(item => item.update.operateId));
      }
      this.dataSub.next(Array.from(this.dataMap.values()).sort((a, b) => a.id - b.id));
    });
  }

  /**
   * 获取对象详情
   * @param id 对象ID
   * @returns 对象详情
   */
  show(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/show/${id}`);
  }

  /**
   * 获取对象变更日志
   * @param id 对象ID
   * @returns 对象变更日志
   */
  log(id: number): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/log/${id}`);
  }

  /**
   * 创建对象
   * @param value 新对象值
   * @returns 后端响应报文
   */
  create(value: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, value);
  }

  /**
   * 更新对象
   * @param value 新对象值
   * @returns 后端响应报文
   */
  update(id: number, value: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update/${id}`, value);
  }

  /**
   * 批量更新对象状态
   * @param ids 对象ID数组
   * @param status 新状态
   * @returns 后端响应报文
   */
  status(ids: number[], status: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/status`, { ids, status });
  }
}
