import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../neuro-app'
import { RecordMedia, RecordMediaError } from '../record-media'
import { RecordMediaEsercizio } from 'src/app/classes/record-media-esercizio';
import { Gruppo } from '../classes/gruppo'
import { Outcome } from '../outcome'


// jQuery
declare var $ : any;


/**
 * out_media
 *  Tipo restituito procedura php che recupera la lista degli elementi
 *  multimediali. Puo essere:
 *  un array di oggetti RecordMedia, oppure
 *  un oggetto Outcome per segnalare un errore
 */
type out_media =  RecordMedia[] | Outcome;


 /**
 * Il tipo restituito dalla procedura php che carica le tipologie di gruppi di esercizi,
 * il valore restituito puo' essere:
 * Gruppo (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_gruppo =  Gruppo[] | Outcome;


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
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_media2.php?proc=NeuroApp.lista_media&tipo_media="+tipo_media+"&lista_id=";
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
          let outcome = records as Outcome
          if (outcome.status === "exception") {
              throw new Error(outcome.message)
          }
          return records as RecordMedia[]
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.handleError ),
    )
  } // listamedia


  /**
   * Estrae il nome del file multimediale dalla url.
   * @param url 
   */
  private mediaName(url:string) : string {
    console.log("NeuroAppService.mediaName",url)
    var k = url.lastIndexOf("/")
    return url.substring(k+1)
  }


  /**
   * Cancella un elemento multimediale dal DB
   * @param doc
   * @param tipo_media - video, audio, image, doc
   */
  rimuoviMedia (doc:RecordMedia, tipo_media:string) {
    let db_proc = 'NeuroApp.rimuovi_media'
    var nome = this.mediaName(doc.url_media)
    var url = this.G_URL_ROOT+"/cgi-bin/rimuovi_media2.php?proc="+db_proc+"&id_media="+doc.id_media+"&nome_media="+nome+"&tipo_media="+tipo_media
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
  } // rimuoviMedia()


  /**
   * Cancella un elemento multimediale dall'esercizio specificato in input
   * @param media : l'elemento da cancellare
   */
  rimuoviMediaEsercizio (media:RecordMediaEsercizio) {
    let db_proc = 'NeuroApp.cancella_media_esercizio'
    let url = this.G_URL_ROOT+"/cgi-bin/cancella_media_esercizio2.php?proc="+db_proc +
              "&id_pkt="+media.id_pkt+"&id_ex="+media.id_ex+"&id_media="+media.id

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
  } // rimuoviMediaEsercizio()

  
  loadGruppi() : Observable<Gruppo[]> {
    let db_proc = "NeuroApp.lista_gruppi"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_esercizi2.php?proc="+db_proc+"&ambito="+ambito;
    let url = this.G_URL_ROOT+"/cgi-bin/lista_gruppi2.php?proc="+db_proc;
    
    console.log("** NeuroAppService loadGruppi: ", url)
    
    return this.http.get<out_gruppo>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (records as Gruppo[])
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.handleError ),
    )
  }


  /**
   * Metodo centralizzato per la gestione dell'errore; lancia una eccezione 
   * passando il messaggio di errore che viene mostrato sulla finestra di
   * popup. Viene utilizzato da tutti i servizi che effettuano una chiamata
   * http verso/da il server.
   * 
   * @param error il messaggio di errore ricevuto dal server http
   */
  public handleError(error: HttpErrorResponse) {
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
