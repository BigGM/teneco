import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../../neuro-app'
import { Outcome } from '../../outcome'
import { NeuroAppService } from '../neuro-app.service';
import { RecordPacchetto } from '../../classes/record-pacchetto'
import { RecordEsercizio } from '../../classes/record-esercizio'
import { Gruppo } from '../../classes/gruppo';



/**
 * Il tipo restituito dalla procedura php che carica i pacchetti puo' essere:
 * RecordPacchetto (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_pacchetto =  RecordPacchetto[] | Outcome;


/**
 * Il tipo restituito dalla procedura php che carica gli esercizi di un pacchetto puo' essere:
 * RecordEsercizio (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_esercizio =  RecordEsercizio[] | Outcome;


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
  loadPacchetti(ambito) : Observable<RecordPacchetto[]> {

    let db_proc = "NeuroApp.lista_pacchetti"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_pacchetti.php?proc="+db_proc+"&ambito="+ambito;
    var url = this.G_URL_ROOT+"/cgi-bin/lista_pacchetti2.php?proc="+db_proc+"&ambito="+ambito;
    
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
            return (records as RecordPacchetto[])
            //RecordPacchetto.setShortDescr(records as RecordPacchetto[])
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
    let url = this.G_URL_ROOT+"/cgi-bin/cancella_pacchetto2.php?proc="+db_proc+"&id_pkt="+pkt.id;
    //let url = this.G_URL_ROOT+"/cgi2-bin/cancella_pacchetto2.php?proc="+db_proc+"&id_pkt="+pkt.id;
    
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



  /**
   * Nella stringa in input sostituisce i caratteri di new-line con <br>.
   */
  private protectNewLine = function(s) {
    console.log("protectNewLine " + s );
    if (s==null||s=="")
      return "";
    s = s.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return s;
  }


  /**
   * Salva un pacchetto nel DB.
   * @param pkt pacchetto
   * @param ambito  - 1 ( riabilitazione neuromotoria )
   *                  2 ( riabilitazione cognitiva )
   */
  salvaPacchetto(pkt:RecordPacchetto, ambito:string) {
    let db_proc = "NeuroApp.salva_pacchetto"
    var url = this.G_URL_ROOT+"/cgi-bin/salva_pacchetto2.php?proc="+db_proc+
                   "&nome="+pkt.nome +
                   "&descr="+pkt.descr.replace(/&amp;/,'0x26').replace(/#/,'0x23') +
                   "&pre_req="+this.protectNewLine(pkt.pre_req) +
                   "&contro_ind="+this.protectNewLine(pkt.contro_ind) +
                   "&alert_msg="+pkt.alert_msg +
                   "&alert_msg_visibile="+pkt.alert_msg_visibile +
                   "&bibliografia="+pkt.bibliografia +
                   "&patologie_secondarie="+pkt.patologie_secondarie +
                   "&valutazione="+pkt.valutazione+
                   "&ambito="+ambito;

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
  } //salvaPacchetto()


  /**
   * Salva nel DB un pacchetto modificato.
   * @param pkt pacchetto
   * @param ambito  - 1 ( riabilitazione neuromotoria )
   *                  2 ( riabilitazione cognitiva )
   */
  salvaPacchettoModificato(pkt:RecordPacchetto, ambito:string) {
    let db_proc = "NeuroApp.salva_pacchetto_modificato"
    var url = this.G_URL_ROOT+"/cgi-bin/salva_pacchetto_modificato2.php?proc="+db_proc+
                   "&id_pkt="+pkt.id +
                   "&nome="+pkt.nome +
                   "&descr="+pkt.descr.replace(/&amp;/,'0x26').replace(/#/,'0x23') +
                   "&pre_req="+this.protectNewLine(pkt.pre_req) +
                   "&contro_ind="+this.protectNewLine(pkt.contro_ind) +
                   "&alert_msg="+pkt.alert_msg +
                   "&alert_msg_visibile="+pkt.alert_msg_visibile +
                   "&bibliografia="+pkt.bibliografia +
                   "&patologie_secondarie="+pkt.patologie_secondarie +
                   "&valutazione="+pkt.valutazione+
                   "&ambito="+ambito;
    
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
          //console.log('** outcome **', outcome)
        }),
        catchError( this.neuroService.handleError )
    )
  } //salvaPacchettoModificato()



 /**
   * Carica la lista degli esercizi del pacchetto specificato in input.
   */
  loadEserciziPacchetto(pkt: RecordPacchetto) : Observable<RecordEsercizio[]> {
    let db_proc = "NeuroApp.lista_esercizi"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_esercizi2.php?proc="+db_proc+"&ambito="+ambito;
    var url = this.G_URL_ROOT+"/cgi-bin/lista_esercizi_pacchetto2.php?proc="+db_proc+"&id_pkt="+pkt.id
    
    console.log("** loadEserciziPacchetto: ", url)
    
    return this.http.get<out_esercizio>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`Exception: ${outcome.message}`)
          }
          else
            return (records as RecordEsercizio[])
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }


  loadGruppi() : Observable<Gruppo[]> {
    let db_proc = "NeuroApp.lista_gruppi"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_esercizi2.php?proc="+db_proc+"&ambito="+ambito;
    let url = this.G_URL_ROOT+"/cgi-bin/lista_gruppi2.php?proc="+db_proc;
    
    console.log("** loadGruppi: ", url)
    
    return this.http.get<out_gruppo>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`Exception: ${outcome.message}`)
          }
          else
            return (records as Gruppo[])
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }


}
