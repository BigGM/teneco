
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroAppService } from '../neuro-app.service';
import { NeuroApp } from '../../neuro-app'
import { Outcome } from '../../classes/outcome'
import { Paziente } from '../../classes/paziente';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


/**
 * Il tipo restituito dalla procedura php che carica i pazienti puo' essere:
 * Paziente (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_pazienti =  Paziente[] | Outcome;

type out_paziente =  Paziente  | Outcome;


@Injectable({
  providedIn: 'root'
})
export class PazientiService {

  private G_URL_ROOT:string;

  // Parametro in uscita per comunicare alla finestra modale di modifica
  // il record di glossario da modificare
  //@Output() change_pkt:EventEmitter<RecordPacchetto>;


  constructor (
    private http: HttpClient,
    private neuroService: NeuroAppService
  ) {
    //console.log("NeuroApp.G_URL_ROOT ==> " + NeuroApp.G_URL_ROOT )
    this.G_URL_ROOT = NeuroApp.G_URL_ROOT;
//    this.change_pkt = new EventEmitter();
  }


  /**
   * Carica la lista dei pazienti dal DB.
   */
  loadPazienti() : Observable<Paziente[]> {

    let db_proc = "NeuroApp.lista_pazienti"
    let url = this.G_URL_ROOT+"/cgi-bin/lista_pazienti.php?proc="+db_proc;
    
    console.log("** loadPazienti: ", url)
    
    return this.http.get<out_pazienti>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (records as Paziente[])
        }),
        tap( records => {
          //console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }


  /**
   * Carica il dettaglio di un paziente
   */
  loadDettaglioPaziente(p:Paziente) : Observable<Paziente> {

    let db_proc = "NeuroApp.dettaglio_paziente"
    let url = this.G_URL_ROOT+"/cgi-bin/dettaglio_paziente.php?proc="+db_proc+"&id_paziente="+p.id_paziente;
    
    console.log("** loadDettaglioPaziente: ", url)
    
    return this.http.get<out_paziente>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (records as Paziente)           
        }),
        tap( records => {
          //console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }
}
