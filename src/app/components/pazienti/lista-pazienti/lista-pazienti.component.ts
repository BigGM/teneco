import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paziente } from '../../../classes/paziente';
import { PazientiService } from 'src/app/services/pazienti/pazienti.service';
import { NeuroApp } from '../../../neuro-app';


declare var $ : any;
declare var bootbox: any;


@Component({
  selector: 'app-lista-pazienti',
  templateUrl: './lista-pazienti.component.html',
  styleUrls: ['./lista-pazienti.component.css']
})
export class ListaPazientiComponent implements OnInit, OnDestroy {

  /** La lista dei pacchetti */
  pazienti  : Paziente[]

  /** Sottoscrizione ai servizi PazientiService*/
  pazientiSubscr  : Subscription

  /** Emette il paziente verso la finestra di dettaglio */
  @Output() selectedPaziente = new EventEmitter<Paziente>()


  /** Emette il paziente verso la finestra di gestione degli esercizi del paziente */
  @Output() eserciziPaziente = new EventEmitter<Paziente>()


  /** 
   * Per comunicare alla finestra modale la richiesta di aggiungere un nuovo
   * paziente o modificarne uno esistente.
   */
  @Output() openActionPaziente: EventEmitter<any> = new EventEmitter()


  constructor( private pazientiService : PazientiService) {
    //console.log( "PazientiComponent costruttore" )
    this.pazienti = []
    this.pazientiSubscr = null
  }

  ngOnInit() {
    //console.log( this.pacchetti.length )
    this.loadPazienti()
  }

  ngOnDestroy() {
    console.log( "PazientiComponent => onDestroy" )
    this.pazienti = null
    if (this.pazientiSubscr )
      this.pazientiSubscr.unsubscribe()
  }

  luogo_data_nascita(p:Paziente) {
    return p.luogo_nascita + " " + p.data_nascita
  }


  /**
   * Carica dal DB i pacchetti configurati sul sistema.
   * In caso di errore emette una popup.
   * @ambito -  1: riabilitazione neuromotoria
   *            2: riabilitazione cognitiva
   *            3: formazione
   */
  loadPazienti() {
    console.log("PazientiComponent.loadPazienti")
    
    NeuroApp.showWait();
    
    let serv = this.pazientiService.loadPazienti()
    
    this.pazientiSubscr = serv.subscribe (
        result => {
          //console.log(result)
          NeuroApp.hideWait()
          this.pazienti = result
          this.pazienti.forEach(p => {
              Paziente.decode(p)
          })
          //console.log(this.pazienti)
          this.pazientiSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pazientiSubscr.unsubscribe()
        }
      )
  } // loadPazienti()

  reloadPazienti() {
    console.log("** reloadPazienti **")
    NeuroApp.removePopover()
    this.pazienti = []
    this.loadPazienti();
    
    // comunica alla finestra col dettaglio di chiudersi.
    this.selectedPaziente.emit()

    // comunica alla finestra gestione esercizi di chiudersi.
    this.eserciziPaziente.emit()
  }

  openDettaglioPaziente(p:Paziente) {
    console.log(p)
    this.selectedPaziente.emit(p)
  }


  /**
   * Richiede conferma di cancellazione del paziente in input, e se confermato avvia la cancellazione.
   * @param p 
   */
  confermaCancellaPaziente(p:Paziente)
  {
    NeuroApp.removePopover()
    
    let self = this;
    bootbox.dialog ({
        title: "<h3>Cancella paziente</h3>", 
        message: "<h6 p-4 style='line-height:1.6;'>Conferma cancellazione del paziente <label class='text-danger'>\""+p.nome+"&nbsp;"+p.cognome+"\"</label></h6>",
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-dark btn-md"
          }, 
          "Rimuovi" : { 
             className:"btn-danger btn-md",
             callback: function(){
              self.cancellaPaziente(p);
             } // end callback
          } // end Rimuovi
       } // end buttons
    }); // bootbox.dialog

  } // confermaCancellaPacchetto()


  /**
   * Cancella un pacchetto richiamando il metodo di cancellazione
   * del servizio pktService
   * @param pkt pacchetto da cancellare
   */
  cancellaPaziente(p:Paziente) {
    console.log("ListaPazientiComponent.cancellaPaziente")
    /*NeuroApp.showWait();
    let serv = this.pazientiSubscr.cancellaPaziente(p)
    
    this.pazientiSubscr = serv.subscribe (
        result => {
          this.pazientiSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Pacchetto "<b>${p.nome} ${p.cognome}</b>" cancellato`)
          // Aggiorna la lista dei pacchetti
          this.reloadPazienti()
        },
        error => {
          this.pazientiSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
    )*/
  }


  /**
   * Apre il modulo per la modifica di un pacchetto esistente
   * @param mouseEvent l'evento di click che apre questa finestra
   * @param pkt il pacchetto da modificare
   */
  formModifPaziente(p:Paziente) {
    
    NeuroApp.removePopover()
    
    // comunica all finestra modale l'azione da eseguire: modifica di un paziente
    // e gli passa il paziente da modificare
    let obj = {
      azione: "modifica",
      paziente : p
    }
    this.openActionPaziente.emit(obj)

    // Invia alla modale il record da modificare tramite il servizio
    //this.pktService.sendRecordToModal(pkt)
  }
  
  /**
   * Emette l'evento verso il componente EserciziPazienteComponente per gestire gli 
   * esercizi da associare al paziente corrente.
   * @param p 
   */
  gestioneEserciziPaziente(p:Paziente){
    //console.log(p)
    this.eserciziPaziente.emit(p)
  }
}
