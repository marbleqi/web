import { Injectable } from '@angular/core';
import { getUnixTime } from 'date-fns';
import { pki, asn1 } from 'node-forge';

import { KongObjectService } from '..';

@Injectable()
export class KongSslService extends KongObjectService {
  constructor() {
    super();
    this.type = 'ssl';
  }

  /**
   * 根据证书信息提取有效期
   * @param value 证书字符串
   */
  /**
   * 根据证书信息提取有效期
   * @param value 证书字符串
   * @returns 有效期信息
   */
  validity(value: string) {
    const certPem = value;
    // 解析PEM格式的证书
    const certDer = pki.pemToDer(certPem);
    const cert = pki.certificateFromAsn1(asn1.fromDer(certDer));
    // 提取有效期
    const validity_start = getUnixTime(cert.validity.notBefore);
    const validity_end = getUnixTime(cert.validity.notAfter);
    // 提取域名信息（Subject Alternative Name）
    const exts = cert.extensions;
    let snis: string[] = [];
    for (const ext of exts) {
      if (ext.name === 'subjectAltName') {
        const altNames = ext.altNames;
        for (const name of altNames) {
          if (name.type === 2) {
            snis.push(name.value);
          }
        }
      }
    }
    return { snis, validity_start, validity_end };
  }
}
