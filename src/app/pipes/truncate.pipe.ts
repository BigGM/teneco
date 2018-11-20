/**
 * truncate.pipe.ts
 * Tronca la stringa in input ai primi 'limit' caratteri;
 * il valore predefinito per limit e' di 80 caratteri.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  
  transform(value: string, limit?: number): string {
    if (limit==null || limit <=0 )limit = 80;
    //console.log(limit, value.substring(0,limit) )
    return value.length > limit ? value.substring(0,limit) + "..." : value
  }
}
