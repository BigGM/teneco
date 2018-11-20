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
  patologia?   : string

  
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

  public reset() {
    this. id = -1
    this.nome         = ""
    this.descr        = ""
    this.short_descr  = ""
    this.pre_req      = ""
    this.contro_ind   = ""
    this.alert_msg    = ""
    this.patologia    = ""
  }


  /**
   * Elimina gli spazi bianchi laterali dalla stringa in input considerando
   * che la stringa puo' essere contenuta tra i tag <p>...</p>.
   * @param s 
   */
  public trimField (s:string) {
    if (s==null || s=="undefined" || s==="")
      return s;

    let start_s = "";
    let end_s   = "";
    
    if (s.startsWith("<p>" ) ) {
      start_s = "<p>"
    	s = s.substring(3)
    }
    if (s.endsWith("</p>" ) ) {
      end_s = "</p>"
    	s = s.substring(0,s.length-4)
    }
    // il metodo trim_nbsp() toglie gli spazi laterali scritti come "&nbsp;"
    s = NeuroApp.trim_nbsp(s)

    // rimette tutto insieme
    return (start_s + s + end_s).trim();
  }


  /**
   * Elimina gli spazi laterari dai campi del record.
   */
  public trim() {
    this.nome         = this.trimField ( this.nome )
    this.descr        = this.trimField ( this.descr )
    this.short_descr  = this.trimField ( this.short_descr )
    this.pre_req      = this.trimField ( this.pre_req )
    this.contro_ind   = this.trimField ( this.contro_ind )
    this.alert_msg    = this.trimField ( this.alert_msg )
    this.patologia    = this.trimField ( this.patologia )
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

  
  private protectNewLine = function(s) {
    s = s.replace(/(?:\r\n|\r|\n)/g, '<br>');
    console.log("protectNewLine " + s );
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
    var url = this.G_URL_ROOT+"/cgi-bin/salva_pacchetto2.php?proc="+db_proc+"&nome="+pkt.nome +
                   "&descr="+pkt.descr.replace(/&amp;/,'0x26').replace(/#/,'0x23') +
                   "&pre_req="+this.protectNewLine(pkt.pre_req) +
                   "&contro_ind="+this.protectNewLine(pkt.contro_ind) +
                   "&alert_msg="+pkt.alert_msg +
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
  } //cancellaPacchetto()

}
