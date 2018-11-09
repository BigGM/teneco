import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../neuro-app'
import { RecordMedia, RecordMediaError } from '../record-media'
//import { RecordError } from '../record-error'
import { Outcome } from '../outcome'




// il tipo restituito dalla procedura php che recupera la lista degli elementi
//  multimediali, puo essere:
//  RecordMedia (array), oppure
//  RecordError (array di un solo elemento)
type out_media =  RecordMedia[] | Outcome;


@Injectable({
  providedIn: 'root'
})
export class NeuroAppService {
  
  private G_URL_ROOT:string;

  constructor(private http: HttpClient) {
    //console.log("NeuroApp.G_URL_ROOT ==> " + NeuroApp.G_URL_ROOT )
    this.G_URL_ROOT = NeuroApp.G_URL_ROOT;
  }


  /**
   * 
   * @param lista_id   - lista degli id da escludere (valori separati da virgola)
   * @param tipo_media - video, audio, image, doc
   */
  listaMedia(lista_id, tipo_media) : Observable<RecordMedia[]> {

    let url = this.G_URL_ROOT+"/cgi-bin/lista_media2.php?proc=NeuroApp.lista_media&tipo_media="+tipo_media+"&lista_id=";
    if (lista_id != "")
       url += lista_id;
     else
       url += "-1"; // non ci sono id negativi nella tabella percio' questo funziona
        
    console.log("** listaMedia: ", url)
    
    return this.http.get<out_media>(url)
    .pipe(
        retry(1),
        map ( records => {
          console.log(records)
          if (records[0].status === "exception") {
              let error = (<Outcome>records[0]).message
              throw new Error(error)
          }
          return records as RecordMedia[]
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.handleError ),
    )
  } // listamedia


  private handleError(error: HttpErrorResponse) {
    console.log("handleError", error.message)

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
