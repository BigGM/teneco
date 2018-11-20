
/**
 * plaintext.pipe.ts
 * Data la stringa html restituisce una nuova stringa
 * privata di ogni formattazione html eventualmente presente.
 * Es: 
 *  <b><i>stringa di testo</i></b> ==>  stringa di testo
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plaintext'
})
export class PlaintextPipe implements PipeTransform {

  transform(html_text: string, args?: any): string {
    let temp = document.createElement("div");
    temp.innerHTML = html_text;
    return temp.textContent || temp.innerText || "";
  }

}
