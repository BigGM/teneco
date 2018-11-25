import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { ListaPacchettiComponent } from '../lista-pacchetti/lista-pacchetti.component';
import { RecordPacchetto } from '../../../classes/record-pacchetto'
import { RecordEsercizio } from '../../../classes/record-esercizio'

declare var $ : any;
declare var bootbox: any;

@Component({
  selector: 'app-lista-esercizi',
  templateUrl: './lista-esercizi.component.html',
  styleUrls: ['./lista-esercizi.component.css']
})
export class ListaEserciziComponent implements OnInit, OnDestroy, AfterViewInit {

  /** Per visualizzare o meno questo componente */
  view_esercizi_visible : boolean

  /** Pacchetto corrente */
  pacchetto : RecordPacchetto
  
  /** Gli eserizi del pacchetto corrente */
  esercizi  : RecordEsercizio[]

  
  /* Sottoscrizione al servizio RiabilNeuromotoriaService */
  exSubscr : Subscription


  /** Per l'accesso alla lista dei pacchetti */ 
  @Input() listaPacchetti: ListaPacchettiComponent;


  /** Per comunicare alla finestra di dettaglio la richiesta di apertura  
   *  con l'esercizio da mostrare */
  @Output() openDettaglio: EventEmitter<RecordEsercizio> = new EventEmitter


  constructor( private exService : RiabilNeuromotoriaService) {
    console.log( "ListaEserciziComponent costruttore" )
    this.pacchetto = new RecordPacchetto
    this.esercizi = []
    this.view_esercizi_visible = false
    this.exSubscr = null
  }


  ngOnInit() {
    this.listaPacchetti.selectedPkt.subscribe ( pkt => {
      this.pacchetto.copy(pkt)
      //console.log(this.pacchetto)
      this.loadEserciziPacchetto()
      // Qualora fosse aperta la vista di dettaglio esercizio
      // richiede al componente di nascondersi
      this.hideDettaglioEsercizio()
    })
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
    console.log( "ListaEserciziComponent => onDestroy" )
    this.pacchetto = null
    this.esercizi = null
    if ( this.exSubscr) 
      this.exSubscr.unsubscribe()
  }


  /**
   * Carica la lista degli esercizi del pacchetto corrente
   */
  loadEserciziPacchetto() {
    console.log("ListaEserciziComponent.loadEserciziPacchetto")
    
    NeuroApp.showWait();
    
    let serv = this.exService.loadEserciziPacchetto(this.pacchetto)
    
    this.exSubscr = serv.subscribe (
        result => {
          console.log(result)
          NeuroApp.hideWait()
          this.esercizi = result
          this.view_esercizi_visible = true
          NeuroApp.scrollTo('divListaEserciziPacchetto')
          this.exSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.exSubscr.unsubscribe()
        }
      )
  } // loadEserciziPacchetto()


  /**
   * Rinfresca la lista degli esercizi del pacchetto corrente.
   */
  reloadEserciziPacchetto() {
    console.log("** reloadEserciziPacchetto **")
    NeuroApp.removePopover()
    this.esercizi = []
    this.loadEserciziPacchetto();
  }


  /**
   * Richiede conferma di cancellazione dell'esercizio in input, e se confermato avvia la cancellazione.
   * @param pkt 
   */
  confermaCancellaEsercizio(event:MouseEvent, ex:RecordEsercizio)
  {
    NeuroApp.removePopover()
    
    event.preventDefault()
    
    let self = this;
    bootbox.dialog ({
        title: "<h3>Cancella esercizio</h3>", 
        message: "<h6 p-4 style='line-height:1.6;'>Conferma rimozione dell'esercizio <label class='text-danger'>\""+ex.nome+"\"</label></h6>",
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-secondary btn-md"
          }, 
          "Rimuovi" : { 
             className:"btn-danger btn-md",
             callback: function(){
              self.cancellaEsercizio(ex);
             } // end callback
          } // end Rimuovi
       } // end buttons
    }); // bootbox.dialog

  } // confermaCancellaPacchetto()


  /**
   * Cancella un esercizio richiamando il metodo di cancellazione
   * del servizio exService
   * @param ex esercizio da cancellare
   */
  cancellaEsercizio(ex:RecordEsercizio) {
    console.log("ListaEserciziComponent.cancellaEsercizio")
    NeuroApp.showWait();
    
    let serv = this.exService.cancellaEsercizio(ex)
    
    this.exSubscr = serv.subscribe (
        result => {
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Esercizio "<b>${ex.nome}</b>" cancellato`)
          // Aggiorna la lista dei pacchetti
          this.reloadEserciziPacchetto()
        },
        error => {
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
    )
  }

  
  /** 
   * Invia al componente di dettaglio l'esercizio da mostrare.
   */
  dettaglioEsercizio(esercizio:RecordEsercizio) {
    this.openDettaglio.emit(esercizio)
  }

  /**
   * Invia al componente di dettaglio la richiesta di nascondersi.
   */
  hideDettaglioEsercizio() {
    this.openDettaglio.emit()
  }

  /**
   * Apre il modulo per la definizione di un nuovo pacchetto
   */
  formNuovoEsercizio() {
    NeuroApp.removePopover()
    $('#nuovoEsercizio').modal('show')
  }

}
