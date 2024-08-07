import { Component } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { getUnixTime } from 'date-fns';
import { pki, asn1 } from 'node-forge';

import { KongSslService, KongObjectEditComponent } from '../..';
@Component({
  selector: 'app-kong-ssl-edit',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './edit.component.html'
})
export class KongSslEditComponent extends KongObjectEditComponent {
  /**表单配置 */
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'id' },
      snis: { type: 'string', title: '域名' },
      key: { type: 'string', title: '私钥' },
      cert: { type: 'string', title: '证书' },
      validity_start: { type: 'number', title: '生效时间', timestamp: 's' },
      validity_end: { type: 'number', title: '过期时间', timestamp: 's' },
      created_at: { type: 'number', title: '创建时间', timestamp: 's' }
    },
    required: ['snis', 'status', 'key', 'cert']
  };

  constructor(private sslSrv: KongSslService) {
    super();
    this.main = 'apisix';
    this.baseUrl = '/kong/list/ssl';
    this.name = '证书';
    this.ui = {
      '*': { spanLabelFixed: 100, spanLabel: 4, spanControl: 20, grid: { span: 12 } },
      $id: { widget: 'text', hidden: true, grid: { span: 24 } },
      $snis: { widget: 'custom', grid: { span: 16 } },
      $key: { widget: 'textarea', grid: { span: 24 }, autosize: { minRows: 5, maxRows: 10 } },
      $cert: {
        widget: 'textarea',
        grid: { span: 24 },
        autosize: { minRows: 5, maxRows: 10 },
        change: (value: string) => {
          const result = this.sslSrv.validity(value);
          this.sf.setValue('/snis', result.snis);
          this.sf.setValue('/validity_start', result.validity_start);
          this.sf.setValue('/validity_end', result.validity_end);
        }
      },
      $validity_start: { widget: 'at', grid: { span: 8 } },
      $validity_end: { widget: 'at', grid: { span: 8 } },
      $created_at: { widget: 'at', grid: { span: 8 } }
    };
    this.show = () => this.sslSrv.get(this.instance, this.id);
    this.create = () => this.sslSrv.create(this.instance, this.value);
    this.update = () => this.sslSrv.update(this.instance, this.id, this.value);
  }

  override init(record: any) {
    if (record) {
      const result = this.sslSrv.validity(record.cert);
      this.i = { ...record, ...result };
    } else {
      this.i = {};
    }
    console.debug('init', record, this.i);
  }

  /**
   * 重写提交方法
   * @param back 是否返回列表页
   */
  override save(back: boolean = true) {
    this.value = { ...this.value, created_at: undefined, updated_at: undefined };
    super.save(back);
  }
}
