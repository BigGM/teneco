import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';
import { RecordPacchetto } from '../../../classes/record-pacchetto'
import { RiabilNeuromotoriaService} from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'

declare var $ : any;
declare var NeuroAppJS : any;
declare var bootbox: any;

@Component({
  selector: 'app-pacchetti-formazione',
  templateUrl: './pacchetti-formazione.component.html',
  styleUrls: ['./pacchetti-formazione.component.css']
})
export class PacchettiFormazioneComponent implements OnInit {
  
  // Questo e' l'ambito che identifica i pacchetti di formazione sul DB
  readonly AMBITO: number = 3

  /** La lista dei pacchetti */
  pacchetti  : RecordPacchetto[]

  /** Sottoscrizione al servizio di accesso al DB.
   * Il servizio e' quello dei pacchetti di formazione. */
  pktSubscr  : Subscription
  
  @Output() selectedPkt = new EventEmitter()

  /** 
   * Per comunicare alla finestra modale la richiesta di creare un nuovo
   * pacchetto o modificarne uno esistente.
   */
  @Output() openActionPacchetto: EventEmitter<any> = new EventEmitter


  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;


  constructor( private pktService : RiabilNeuromotoriaService) {
    //console.log( "PacchettiFormazioneComponent costruttore" )
    this.pacchetti = []
    this.pktSubscr = null
  }

  ngOnInit() {
    //console.log( this.pacchetti.length )
    this.loadPacchetti()
  }

  ngOnDestroy() {
    console.log( "PacchettiFormazioneComponent => onDestroy" )
    this.pacchetti = null
    if (this.pktSubscr )
      this.pktSubscr.unsubscribe()
    NeuroApp.removePopover()
  }


  /**
   * Assegna una classe di stile per evidenziare una riga selezionata col mouse.
   * @param row riferimento alla riga cliccata della tabella HTML
   */
  onForeground(row,event:MouseEvent) {
    event.preventDefault()
    $('#tablePacchettiFormazione tr td').removeClass('marked-row');
    $('#tablePacchettiFormazione tr td').removeClass('marked-row-first-col');
    $('#tablePacchettiFormazione tr td').removeClass('marked-row-last-col');
    for (var j=0; j<row.cells.length; j++) {
      $(row.cells[j]).addClass('marked-row'); 
    }
    if (row.cells.length>0) {
      $(row.cells[0]).addClass('marked-row-first-col');
      $(row.cells[row.cells.length-1]).addClass('marked-row-last-col');
    }
  }


  /**
   * Carica dal DB i pacchetti configurati sul sistema.
   * In caso di errore emette una popup.
   */
  loadPacchetti() {
    console.log("PacchettiFormazioneComponent => loadPacchetti")
    
    NeuroApp.showWait();
    
    let serv = this.pktService.loadPacchetti(this.AMBITO)
    
    this.pktSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.pacchetti = result
          this.pacchetti.forEach(pkt => {
              RecordPacchetto.decode(pkt)
          })
          console.log(this.pacchetti)
          this.pktSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pktSubscr.unsubscribe()
        }
      )
  } // loadPacchetti()


  reloadPacchetti() {
    NeuroApp.removePopover()
    this.pacchetti = []
    this.loadPacchetti();
    // comunica alla finestra di dettaglio di chiudersi con l'emissione di un messaggio vuoto.
    this.selectedPkt.emit()
  }


  /**
   * Carica le procedure del pacchetto specificato in input.
   * 
   * @param event evento di click che lancia questo metodo
   * @param pkt   il pacchetto selezionato
   */
  loadProcedurePacchetto(event:MouseEvent, pkt) {
    console.log("PacchettiFormazioneComponent => loadProcedurePacchetto")
    NeuroApp.removePopover()
    
    /**
     * Emette l'evento per la componente ListaEsercizi per inviargli il pacchetto
     * di cui si vuole caricare la lista degli esercizi.
     */
    this.selectedPkt.emit(pkt)
  }

  /**
   * Aggiorna il numero di modalita' del pacchetto id_pkt al valore num_modalita.
   * Questo metodo viene richiamato dal componente ListaEserciziComponent dopo una
   * cancellazione o l'aggiunta di una modalita'.
   * 
   * @param id_pkt 
   * @param num_modalita
   */
  updateNumEsercizi(id_pkt:number, num_modalita:number) {
    this.pacchetti.forEach(pkt => {
      if(pkt.id == id_pkt) pkt.num_esercizi = num_modalita
    })
  }



  /**
   * Richiede conferma di cancellazione del pacchetto in input, e se confermato avvia la cancellazione.
   * @param mouseEvent 
   * @param pkt 
   */
  confermaCancellaPacchetto(mouseEvent:MouseEvent, pkt:RecordPacchetto)
  {
    NeuroApp.removePopover()
    mouseEvent.preventDefault()

    let self = this;
    bootbox.dialog ({
        title: "<h3>Cancella pacchetto</h3>", 
        message: "<h6 p-4 style='line-height:1.6;'>Conferma rimozione del pacchetto <label class='text-danger'>\""+pkt.nome+"\"</label></h6>",
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-dark btn-md"
          }, 
          "Rimuovi" : { 
             className:"btn-danger btn-md",
             callback: function(){
              self.cancellaPacchetto(pkt);
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
  cancellaPacchetto(pkt:RecordPacchetto) {
    console.log("PacchettiFormazioneComponent => cancellaPacchetto")
    NeuroApp.showWait();
    
    let serv = this.pktService.cancellaPacchetto(pkt)
    
    this.pktSubscr = serv.subscribe (
        result => {
          this.pktSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Pacchetto "<b>${pkt.nome}</b>" cancellato`)
          // Aggiorna la lista dei pacchetti
          this.reloadPacchetti()
        },
        error => {
          this.pktSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
    )
  }


  /**
   * Apre il modulo per la definizione di un nuovo pacchetto
   */
  formNuovoPacchetto() {
    NeuroApp.removePopover()
    // comunica all finestra modale l'azione da eseguire: creazione nuovo pacchetto
    let obj = {
      azione: "nuovo_pacchetto"
    }
    this.openActionPacchetto.emit( obj )
    $('#actPacchetto').modal('show')
  }

  
  /**
   * Apre il modulo per la modifica di un pacchetto esistente
   * @param mouseEvent l'evento di click che apre questa finestra
   * @param pkt il pacchetto da modificare
   */
  formModifPacchetto(mouseEvent, pkt:RecordPacchetto) {
    console.log("PacchettiFormazioneComponent => formModifPacchetto", pkt);
    
    mouseEvent.stopPropagation()
    NeuroApp.removePopover()
    
    // comunica all finestra modale l'azione da eseguire: modifica di un pacchetto
    // e gli passa il pacchetto da modificare
    let obj = {
      azione: "modifica_pacchetto",
      pacchetto : pkt
    }
    this.openActionPacchetto.emit(obj)
    
    $('#actPacchetto').modal('show')
  }
}
