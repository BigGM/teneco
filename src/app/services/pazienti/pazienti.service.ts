
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroAppService } from '../neuro-app.service';
import { NeuroApp } from '../../neuro-app'
import { Outcome } from '../../classes/outcome'
import { Paziente } from '../../classes/paziente';
import { EserciziPaziente } from '../../classes/esercizi-paziente';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { p } from '@angular/core/src/render3';


/**
 * Il tipo restituito dalla procedura php che carica i pazienti puo' essere:
 * Paziente (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_pazienti =  Paziente[] | Outcome;

type out_paziente =  Paziente  | Outcome;

type out_esercizi_paziente =  EserciziPaziente[]  | Outcome;


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
  })
};



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
    // this.change_pkt = new EventEmitter();
  }


  /**
   * Carica la lista dei pazienti dal DB.
   */
  loadPazienti() : Observable<Paziente[]> {

    let db_proc = "NeuroApp.lista_pazienti"
    let url = this.G_URL_ROOT+"/cgi-bin/lista_pazienti.php?proc="+db_proc;
    
    //console.log("** loadPazienti: ", url)
    
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


  /**
   * Carica la lista degli esercizi assegnati a un paziente
   */
  loadEserciziPaziente(p:Paziente) : Observable<EserciziPaziente[]> {

    let db_proc = "NeuroApp.lista_pacchetti_esercizi"
    let url = this.G_URL_ROOT+"/cgi-bin/lista_pacchetti_esercizi.php?proc="+db_proc+"&id_paziente="+p.id_paziente;
    
    //console.log("** loadEserciziPaziente: ", url)
    
    return this.http.get<out_esercizi_paziente>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (records as EserciziPaziente[])
        }),
        tap( records => {
          //console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }

  associaEsercizi(id_paziente:number, id_esercizi:string) {
    let db_proc = "NeuroApp.associa_esercizi_paziente"
    let url = this.G_URL_ROOT+"/cgi-bin/associa_esercizi_paziente.php?proc="+db_proc +
              "&id_paziente="+id_paziente +
              "&id_esercizi="+id_esercizi;

    console.log("associaEsercizi",url)

    return this.http.get<Outcome>(url)
      .pipe(
          retry(1),
          map ( outcome => {
            //console.log('** outcome **', outcome)
              if (outcome.status.toLowerCase()=="exception" )
                throw new Error(`${outcome.message}`) 
              return outcome
          }),
          tap( outcome => {
            //console.log('** outcome **', outcome)
          }),
          catchError( this.neuroService.handleError )
      )
  }

  
  salvaNuovoPaziente(p:Paziente, php_script:string, db_proc:string) {   
    let url = this.G_URL_ROOT + "/cgi-bin/" + php_script;

    let params = "proc="+db_proc +
                "&nome=" + p.nome +
                "&cognome=" + p.cognome +
                "&cf=" + p.cf +
                "&sesso=" + p.sesso +
                "&luogo_nascita=" + p.luogo_nascita +
                "&data_nascita=" + p.data_nascita +
                "&residenza=" + p.residenza +
                "&indirizzo=" + p.indirizzo +
                "&nazionalita=" + p.nazionalita+
                "&note=" + p.note;
    //console.log(url)
    return this.http.post<Outcome>(url, params, httpOptions)
    .pipe(
        retry(1),
        map ( outcome => {
          //console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`${outcome.message}`) 
            return outcome
        }),
        tap( outcome => {
          //console.log('** outcome **', outcome)
        }),
        catchError( this.neuroService.handleError )
    )
  }

  salvaModifichePaziente(p:Paziente, php_script:string, db_proc:string) {
   
    let url = this.G_URL_ROOT + "/cgi-bin/" + php_script;

    let params = "proc="+db_proc +
                "&id_paziente=" + p.id_paziente +
                "&residenza=" + p.residenza +
                "&indirizzo=" + p.indirizzo +
                "&note=" + p.note;

    //console.log(url)

    return this.http.post<Outcome>(url, params, httpOptions)
    .pipe(
        retry(1),
        map ( outcome => {
          //console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`${outcome.message}`) 
            return outcome
        }),
        tap( outcome => {
          //console.log('** outcome **', outcome)
        }),
        catchError( this.neuroService.handleError )
    )
  }


  /**
   * Cancella un paziente dal sistema.
   * @param p
   */
  cancellaPaziente(p:Paziente) {
    let db_proc = "NeuroApp.cancella_paziente"
    let url = this.G_URL_ROOT+"/cgi-bin/cancella_paziente.php?proc="+db_proc+"&id_paziente="+p.id_paziente;
    
    return this.http.get<Outcome>(url)
    .pipe(
        retry(1),
        map ( outcome => {
          //console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`${outcome.message}`) 
            return outcome
        }),
        tap( outcome => {
          //console.log('** outcome **', outcome)
        }),
        catchError( this.neuroService.handleError )
    )
  } //cancellaPacchetto()

}
