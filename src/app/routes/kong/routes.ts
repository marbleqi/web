import { Routes } from '@angular/router';

import {
  KongInstanceService,
  KongRouteService,
  KongServiceService,
  KongConsumerService,
  KongUpstreamService,
  KongPluginService,
  KongSslService,
  KongLayoutComponent,
  KongInstanceComponent,
  KongInstanceEditComponent,
  KongListComponent,
  KongRouteComponent,
  KongRouteEditComponent,
  KongServiceComponent,
  KongServiceEditComponent,
  KongConsumerComponent,
  KongConsumerEditComponent,
  KongUpstreamComponent,
  KongUpstreamEditComponent,
  KongPluginComponent,
  KongPluginEditComponent,
  KongSslComponent,
  KongSslEditComponent
} from '.';

export const routes: Routes = [
  {
    path: '',
    component: KongLayoutComponent,
    pathMatch: 'prefix',
    providers: [
      KongInstanceService,
      KongRouteService,
      KongServiceService,
      KongConsumerService,
      KongUpstreamService,
      KongPluginService,
      KongSslService
    ],
    children: [
      { path: 'instance', component: KongInstanceComponent, data: { reuse: true } },
      { path: 'instance/add', component: KongInstanceEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'instance/edit/:id', component: KongInstanceEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'instance/copy/:id', component: KongInstanceEditComponent, data: { reuse: true, type: 'copy' } },
      {
        path: 'list',
        component: KongListComponent,
        children: [
          { path: 'route', component: KongRouteComponent, data: { reuse: true } },
          { path: 'service', component: KongServiceComponent, data: { reuse: true } },
          { path: 'consumer', component: KongConsumerComponent, data: { reuse: true } },
          { path: 'upstream', component: KongUpstreamComponent, data: { reuse: true } },
          { path: 'plugin', component: KongPluginComponent, data: { reuse: true } },
          { path: 'ssl', component: KongSslComponent, data: { reuse: true } }
        ]
      },
      { path: 'route/:instance/add', component: KongRouteEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'route/:instance/edit/:id', component: KongRouteEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'route/:instance/copy/:id', component: KongRouteEditComponent, data: { reuse: true, type: 'copy' } },
      { path: 'service/:instance/add', component: KongServiceEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'service/:instance/edit/:id', component: KongServiceEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'service/:instance/copy/:id', component: KongServiceEditComponent, data: { reuse: true, type: 'copy' } },
      { path: 'consumer/:instance/add', component: KongConsumerEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'consumer/:instance/edit/:id', component: KongConsumerEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'consumer/:instance/copy/:id', component: KongConsumerEditComponent, data: { reuse: true, type: 'copy' } },
      { path: 'upstream/:instance/add', component: KongUpstreamEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'upstream/:instance/edit/:id', component: KongUpstreamEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'upstream/:instance/copy/:id', component: KongUpstreamEditComponent, data: { reuse: true, type: 'copy' } },
      { path: 'plugin/:instance/add', component: KongPluginEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'plugin/:instance/edit/:id', component: KongPluginEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'plugin/:instance/copy/:id', component: KongPluginEditComponent, data: { reuse: true, type: 'copy' } },
      { path: 'ssl/:instance/add', component: KongSslEditComponent, data: { reuse: true, type: 'add' } },
      { path: 'ssl/:instance/edit/:id', component: KongSslEditComponent, data: { reuse: true, type: 'edit' } },
      { path: 'ssl/:instance/copy/:id', component: KongSslEditComponent, data: { reuse: true, type: 'copy' } }
    ]
  }
];
