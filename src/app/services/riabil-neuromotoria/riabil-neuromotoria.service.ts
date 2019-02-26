import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../../neuro-app'
import { Outcome } from '../../classes/outcome'
import { NeuroAppService } from '../neuro-app.service';
import { RecordPacchetto } from '../../classes/record-pacchetto'
import { RecordEsercizio } from '../../classes/record-esercizio'
import { RecordMediaEsercizio } from '../../classes/record-media-esercizio'
import { RecordMedia } from '../../classes/record-media'
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


/**
 * Il tipo restituito dalla procedura php che carica gli elementi multimediali di uno
 * specifico esercizio
 * RecordMediaEsercizio (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_media_esercizio =  RecordMediaEsercizio[] | Outcome;


/**
 * Il tipo restituito dalla procedura php get_scheda_valutazione.php
 */
type out_scheda_val =  RecordMedia | Outcome;


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
  })
};


@Injectable({
  providedIn: 'root'
})
export class RiabilNeuromotoriaService {

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
   * Invia alla finestra modale di modifica il record da modificare.
   * @param rec record di glossario da modificare
   *
  sendRecordToModal(rec: RecordPacchetto) {
    this.change_pkt.emit(rec)

  } */


  /**
   * Carica la lista del pacchetti dal DB
   */
  loadPacchetti(ambito:number) : Observable<RecordPacchetto[]> {

    let db_proc = "NeuroApp.lista_pacchetti2"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_pacchetti.php?proc="+db_proc+"&ambito="+ambito;
    let url = this.G_URL_ROOT+"/cgi-bin/lista_pacchetti2.php?proc="+db_proc+"&ambito="+ambito;
    
    console.log("** loadPacchetti: ", url)
    
    return this.http.get<out_pacchetto>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (records as RecordPacchetto[])
            //RecordPacchetto.setShortDescr(records as RecordPacchetto[])
        }),
        tap( records => {
          //console.log('** fetched records **', records)
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
              throw new Error(`${outcome.message}`) 
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
    return s
    if (s==null||s=="")
      return "";
    s = s.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return s;
  }


  /**
   * Salva un pacchetto nel DB.
   * @param pkt         pacchetto ( i caratteri speciali sono gia' codificati)
   * @param php_script  script php da eseguire
   * @param db_proc     procedura oracle
   * @param ambito :  1 ( riabilitazione neuromotoria )
   *                  2 ( riabilitazione cognitiva )
   *                  3 ( formazione )
   **/
  salvaPacchetto(pkt:RecordPacchetto, php_script:string, db_proc:string, ambito:number) {
     
    // NB. Se il pacchetto in ingresso contiene un id significa che stiamo salvando
    // un pacchetto modificato e quindi nella url va aggiunto l'id
    let id_pkt = ""
    if (pkt.id >= 0)
      id_pkt = "&id_pkt="+pkt.id

      console.log(pkt)

    let url = this.G_URL_ROOT+"/cgi-bin/"+php_script
    let params =   "proc="+db_proc+
                  id_pkt +
                  "&nome="+ pkt.nome +
                  "&descr="+ pkt.descr +
                  "&pre_req="+ pkt.pre_req +
                  "&contro_ind="+ pkt.contro_ind +
                  "&alert_msg="+pkt.alert_msg +
                  "&alert_msg_visibile=" + pkt.alert_msg_visibile +
                  "&bibliografia=" + pkt.bibliografia +
                  "&patologie_secondarie=" + pkt.patologie_secondarie +
                  "&valutazione=" + pkt.valutazione+
                  "&note=" + pkt.note+
                  "&contro_ind_abs=" + pkt.contro_ind_abs+
                  "&pre_req_comp=" + pkt.pre_req_comp+
                  "&come_valutare=" + pkt.come_valutare+
                  "&ambito="+ambito +
                  "&id_scheda_val="+pkt.id_scheda_val;
    console.log(url)

    return this.http.post<Outcome>(url, params, httpOptions)
    .pipe(
        retry(1),
        map ( outcome => {
            console.log('** outcome **', outcome)
            if (outcome.status.toLowerCase()=="exception" )
              throw new Error(`${outcome.message}`) 
            return outcome
        }),
        tap( outcome => {
          console.log('** outcome **', outcome)
        }),
        catchError( this.neuroService.handleError )
    )
  } //salvaPacchetto()
  
  

 /**
   * Carica la lista degli esercizi del pacchetto specificato in input.
   */
  loadEserciziPacchetto(pkt: RecordPacchetto) : Observable<RecordEsercizio[]> {
    let db_proc = "NeuroApp.lista_esercizi"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_esercizi2.php?proc="+db_proc+"&ambito="+ambito;
    let url = this.G_URL_ROOT+"/cgi-bin/lista_esercizi_pacchetto2.php?proc="+db_proc+"&id_pkt="+pkt.id
    
    console.log("** loadEserciziPacchetto: ", url)
    
    return this.http.get<out_esercizio>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
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
  

  /**
   * Salva sul sistema un nuovo esercizio o un esercizio esistente modificato.
   * @param ex          l'esercizio;
   * @param php_script  lo script php da eseguire
   * @param db_proc     il nome della procedura oracle da eseguire.
   */
  salvaEsercizio(ex: RecordEsercizio, php_script:string, db_proc:string) {
    
    // NB. Se l'esecizio in ingresso contiene un id significa che stiamo salvando
    // un esercizio modificato e quindi nella url va aggiunto l'id
    let id_ex = ""
    if (ex.id_ex >= 0)
      id_ex = "&id_ex="+ex.id_ex

    let url = this.G_URL_ROOT+"/cgi-bin/"+php_script;

    let params = "proc="+db_proc+
                "&id_pkt=" + ex.id_pkt +
                id_ex +
                "&nome=" + ex.nome +
                "&descr=" + ex.descr +
                "&testo=" + ex.testo +
                "&alert=" + ex.alert +
                "&limitazioni=" + ex.limitazioni +
                "&id_grp=" + ex.id_grp;

    console.log(url)
    console.log(params)

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
  } // salvaEsercizio()



  /**
   * Cancella un esercizio dal sistema.
   * @param ex
   */
  cancellaEsercizio(ex:RecordEsercizio) {
    let db_proc = "NeuroApp.cancella_esercizio"
    let url = this.G_URL_ROOT+"/cgi-bin/cancella_esercizio2.php?proc="+db_proc+"&id_pkt="+ex.id_pkt+"&id_ex="+ex.id_ex;
    //let url = this.G_URL_ROOT+"/cgi2-bin/cancella_pacchetto2.php?proc="+db_proc+"&id_pkt="+pkt.id;
    
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
  } // cancellaEsercizio()



  loadMediaEsercizio(ex: RecordEsercizio) : Observable<RecordMediaEsercizio[]> {
    let db_proc = "NeuroApp.lista_dettaglio_esercizio"
    //let url = this.G_URL_ROOT+"/cgi2-bin/lista_esercizi2.php?proc="+db_proc+"&ambito="+ambito;    
    let url = this.G_URL_ROOT+"/cgi-bin/lista_media_esercizio.php?proc="+db_proc+
    "&id_pkt="+ex.id_pkt+"&id_ex="+ex.id_ex;
    
    console.log("** loadMediaEsercizio: ", url)
    
    return this.http.get<out_media_esercizio>(url)
    .pipe(
        retry(1),
        map ( records => {
          let outcome = <Outcome>records
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (records as RecordMediaEsercizio[])
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }


  aggiungiMediaEsercizio(id_pkt:number, id_ex:number, id_media:string) {
    let db_proc = "NeuroApp.aggiungi_media_esercizio"
    let url = this.G_URL_ROOT+"/cgi-bin/aggiungi_media_esercizio2.php?proc="+db_proc +
              "&id_pkt="+id_pkt +
              "&id_ex="+id_ex +
              "&id_media="+id_media;

    console.log("aggiungiMediaEsercizio",url)

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


  /**
   * Recupera descrizione e url della scheda con l'id specificato.
   * @param id_scheda id della scheda
   */
  getSchedaValutazione(id_scheda:number) : Observable<RecordMedia> {
    let db_proc = "NeuroApp.get_scheda_valutazione";
    let url = this.G_URL_ROOT+"/cgi-bin/get_scheda_valutazione.php?proc="+db_proc +
              "&id_scheda="+id_scheda;

    console.log("getSchedaValutazione",url)

    return this.http.get<out_scheda_val>(url)
    .pipe(
        retry(1),
        map ( record => {
          let outcome = <Outcome>record
          if ( outcome.status==="exception") {
              throw new Error(`${outcome.message}`)
          }
          else
            return (record as RecordMedia)
        }),
        tap( records => {
          console.log('** fetched records **', records)
        }),
        catchError( this.neuroService.handleError ),
    )
  }

}
