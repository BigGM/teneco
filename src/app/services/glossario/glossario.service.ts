import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../../neuro-app'
//import { RecordError } from '../../record-error'
import { Outcome } from '../../outcome'

// La struttura del record del glossario
export class RecordGlossario {
    id:         number;
    voce:       string;
    def:        string;
    short_def?: string;

    /**
     * Imposta il valore della proprieta short_def per ogni record
     * dell'array in input
     * @param records  array di oggetti RecordGlossario
     */
    static setShortDef(records: RecordGlossario[]) {  
      console.log("setShortDef", records)

      records.forEach(element => {
          element.short_def = NeuroApp.truncString(element.def,100)
      })
      return records
    }
}


// il tipo restituito dalla procedura php, puo essere:
//  RecordGlossario (array), oppure
//  RecordError (array di un solo elemento)
type out_glossario =  RecordGlossario[] | Outcome;


@Injectable({
  providedIn: 'root'
})
export class GlossarioService {
  
  private G_URL_ROOT:string;
  
  // Parametro in uscita per comunicare alla finestra modale di modifica
  // il record di glossario da modificare
  @Output() change_glos:EventEmitter<RecordGlossario>;


  constructor(private http: HttpClient) {
    //console.log("NeuroApp.G_URL_ROOT ==> " + NeuroApp.G_URL_ROOT )
    this.G_URL_ROOT = NeuroApp.G_URL_ROOT;
    this.change_glos = new EventEmitter();
  }


  /**
   * Invia alla finestra modale di modifica il record da modificare.
   * @param rec record di glossario da modificare
   */
  sendRecordToModal(rec: RecordGlossario) {
    this.change_glos.emit(rec)
  }


  /**
   * Carica le voci del glossario dal db
   */
  loadGlossario() : Observable<RecordGlossario[]> {
    let db_proc = "NeuroApp.lista_glossario"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_glossario.php?proc="+db_proc
    let url = this.G_URL_ROOT+"/cgi-bin/lista_glossario2.php?proc="+db_proc
    
    console.log("** loadGlossario: ", url)
    
    return this.http.get<out_glossario>(url)
    .pipe(
        retry(1),
        //catchError( this.handleError('fetchAll',[]) )
        map ( records => {
          if (records[0].status==="exception") {
              let error = (<Outcome>records[0]).message
              throw new Error(`Exception: ${error}`)
          }
          else
            return RecordGlossario.setShortDef(records as RecordGlossario[])
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.handleError ),
    )
  }

  /**
   * Salva una nuova voce di glossario sul db
   * @param glossario 
   */
  salvaGlossario(glossario:RecordGlossario) : Observable<Outcome> {
    let db_proc = "NeuroApp.salva_glossario"
    //let url = this.G_URL_ROOT+"/cgi2-bin/salva_glossario.php?proc="+db_proc+"&voce="+glossario.voce+"&definizione="+glossario.def;
    let url = this.G_URL_ROOT+"/cgi-bin/salva_glossario.php?proc="+db_proc+"&voce="+glossario.voce+"&definizione="+glossario.def;
    console.log("** salvaGlossario: ", url)

    return this.http.get<Outcome>(url)
    .pipe(
        retry(1),
        map ( outcome => {
          console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`Exception: ${outcome.message}`) 
            return outcome
        }),
        tap( outcome => {
          console.log('** outcome **', outcome)
        }),
        catchError( this.handleError )
    )
  } // salvaGlossario()


  /**
   * Rimuove una voce del glossario dal db.
   * @param id_voce id della voce di glossario da cancellare
   */
  cancellaGlossario(id_voce:number) {
    let db_proc = "NeuroApp.cancella_glossario"
    //let url = this.G_URL_ROOT+"/cgi2-bin/cancella_glossario.php?proc="+db_proc+"&id_voce="+id_voce;
    let url = this.G_URL_ROOT+"/cgi-bin/cancella_glossario.php?proc="+db_proc+"&id_voce="+id_voce;
    console.log("** cancellaGlossario: ", url)

    return this.http.get<Outcome>(url)
    .pipe(
        retry(1),
        map ( outcome => {
          console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`Exception: ${outcome.message}`) 
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
