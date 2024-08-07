import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class KongConsumerService {
  constructor(private http: _HttpClient) {}
}
