
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../../neuro-app'
import { RecordMedia } from '../../record-media'
import { Outcome } from '../../outcome'

//import { RecordError } from '../../record-error'
//import { NeuroAppService } from '../neuro-app.service'

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ResourceDocsService {
  
  private G_URL_ROOT:string;

  constructor(private http: HttpClient) {
    this.G_URL_ROOT = this.G_URL_ROOT = NeuroApp.G_URL_ROOT
  }

  
  docName = function(url:string) {
    var k = url.lastIndexOf("/")
    return url.substring(k+1)
  }
 
  docExt = function(url):string {
    var k = url.lastIndexOf(".")
    return url.substring(k)
  }
 
  
  /**
   * Cancella un documento dal DB
   * @param doc 
   */
  rimuoviDocumento (doc:RecordMedia) {
    let db_proc = 'NeuroApp.rimuovi_media'
    var nome = this.docName(doc.url_media)
    var url = this.G_URL_ROOT+"cgi-bin/rimuovi_media2.php?proc="+db_proc+"&id_media="+doc.id_media+"&nome_media="+nome+"&tipo_media=doc"
    console.log(url);

    return this.http.get<Outcome>(url)
    .pipe(
        retry(1),
        map ( outcome => {
          console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(outcome.message) 
            return outcome
        }),
        tap( outcome => {
          console.log('** outcome **', outcome)
        }),
        catchError( this.handleError )
    )
  } //cancellaGlossario()



  private handleError(error: HttpErrorResponse) {
    //console.log("handleError", error.message)

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      //console.error(
      //  `Backend returned code ${error.status}, ` +
      //  `body was: ${error.error}`);
    }
   
    // return an observable with a user-facing error message
    return throwError(error.message);
  }

}
