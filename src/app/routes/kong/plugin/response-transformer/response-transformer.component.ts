import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-kong-plugin-response-transformer',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './response-transformer.component.html'
})
export class KongPluginResponseTransformerComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      no: { type: 'string', title: '编号' },
      owner: { type: 'string', title: '姓名', maxLength: 15 },
      callNo: { type: 'number', title: '调用次数' },
      href: { type: 'string', title: '链接', format: 'uri' },
      description: { type: 'string', title: '描述', maxLength: 140 }
    },
    required: ['owner', 'callNo', 'href', 'description']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string'
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  constructor() {}

  ngOnInit(): void {
    console.debug('');
  }
}
