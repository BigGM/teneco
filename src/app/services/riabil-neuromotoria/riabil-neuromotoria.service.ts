import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../../neuro-app'
import { Outcome } from '../../outcome'
import { NeuroAppService } from '../neuro-app.service';


// La struttura del record del pacchetto
export class RecordPacchetto {

  id           : number
  nome         : string
  descr        : string
  short_descr? : string
  pre_req      : string
  contro_ind   : string
  alert_msg    : string

  
  /**
   * Imposta il valore della proprieta short_descr per ogni record
   * dell'array in input
   * @param records  array di oggetti RecordPacchetto
   */
  static setShortDescr(records: RecordPacchetto[]) {  
    //console.log("setShortDescr", records)

    records.forEach(element => {
        element.short_descr = NeuroApp.truncString(element.descr,100)
    })
    return records
  }
} //RecordPacchetto


/**
 * Il tipo restituito dalla procedura php, puo' essere:
 * RecordGlossario (array), oppure
 * Outcome per segnalare un errore di database
 */ 
type out_pacchetto =  RecordPacchetto[] | Outcome;


@Injectable({
  providedIn: 'root'
})
export class RiabilNeuromotoriaService {

  private G_URL_ROOT:string;

  // Parametro in uscita per comunicare alla finestra modale di modifica
  // il record di glossario da modificare
  @Output() change_pkt:EventEmitter<RecordPacchetto>;


  constructor (
    private http: HttpClient,
    private neuroService: NeuroAppService
  ) {
    //console.log("NeuroApp.G_URL_ROOT ==> " + NeuroApp.G_URL_ROOT )
    this.G_URL_ROOT = NeuroApp.G_URL_ROOT;
    this.change_pkt = new EventEmitter();
  }


  /**
   * Invia alla finestra modale di modifica il record da modificare.
   * @param rec record di glossario da modificare
   */
  sendRecordToModal(rec: RecordPacchetto) {
    this.change_pkt.emit(rec)

  }


  /**
   * Carica la lista del pacchetti dal DB
   */
  loadPacchetti() : Observable<RecordPacchetto[]> {

    let db_proc = "NeuroApp.lista_pacchetti"
    let ambito  = 1
    let url = this.G_URL_ROOT+"/cgi2-bin/lista_pacchetti.php?proc="+db_proc+"&ambito="+ambito;
    //var url = this.G_URL_ROOT+"/cgi-bin/lista_pacchetti.php?proc="+db_proc+"&ambito="+ambito;
    
    console.log("** loadPacchetti: ", url)
    
    return this.http.get<out_pacchetto>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`Exception: ${outcome.message}`)
          }
          else
            return RecordPacchetto.setShortDescr(records as RecordPacchetto[])
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }


  /**
   * Cancella un pacchetto dal DB.
   * @param pkt 
   */
  cancellaPacchetto(pkt:RecordPacchetto) {
    let db_proc = "NeuroApp.cancella_pacchetto"
    //let url = this.G_URL_ROOT+"/cgi-bin/cancella_pacchetto.php?proc="+db_proc+"&id_pkt="+pkt.id;
    let url = this.G_URL_ROOT+"/cgi2-bin/cancella_pacchetto.php?proc="+db_proc+"&id_pkt="+pkt.id;
    
    return this.http.get<Outcome>(url)
    .pipe(
        retry(1),
        map ( outcome => {
          //console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`Exception: ${outcome.message}`) 
            return outcome
        }),
        tap( outcome => {
          //console.log('** outcome **', outcome)
        }),
        catchError( this.neuroService.handleError )
    )
  } //cancellaPacchetto()
}
