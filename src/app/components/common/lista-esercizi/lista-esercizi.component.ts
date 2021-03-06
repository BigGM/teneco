import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { ListaPacchettiComponent } from '../../riabil-neuromotoria/lista-pacchetti/lista-pacchetti.component';
import { PacchettiFormazioneComponent } from '../../formazione/pacchetti-formazione/pacchetti-formazione.component';
import { PacchettiCognitiviComponent } from '../../riabil-cognitiva/pacchetti-cognitivi/pacchetti-cognitivi.component';
import { RecordPacchetto } from '../../../classes/record-pacchetto'
import { RecordEsercizio } from '../../../classes/record-esercizio'
import { RecordMedia } from 'src/app/classes/record-media';

declare var $ : any;
declare var NeuroAppJS : any;
declare var bootbox: any;

@Component({
  selector: 'app-lista-esercizi',
  templateUrl: './lista-esercizi.component.html',
  styleUrls: ['./lista-esercizi.component.css']
})
export class ListaEserciziComponent implements OnInit, OnDestroy, AfterViewInit {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug : boolean = false;


  /** Per visualizzare o meno questo componente */
  view_esercizi_visible : boolean

  /** Pacchetto corrente */
  pacchetto : RecordPacchetto
  
  /** Gli eserizi del pacchetto corrente */
  esercizi  : RecordEsercizio[]

  /** Id dell'esercizio selezionato per il dettaglio */
  id_esercizio_selected: number

  /** Scheda di valutazione associata al pacchetto */
  schedaValutazione?: RecordMedia

  /** Icona da inserire sulla voce Scheda di Valutazione */
  schedaIcon = NeuroApp.ROOT_ICONS + "/generic-doc-icon.png"

  
  /* Sottoscrizione al servizio RiabilNeuromotoriaService */
  exSubscr : Subscription


  /** Per l'accesso alla lista dei pacchetti */ 
  @Input() listaPacchetti: ListaPacchettiComponent | PacchettiFormazioneComponent | PacchettiCognitiviComponent


  /** Per comunicare alla finestra di dettaglio la richiesta di apertura  
   *  con l'esercizio da mostrare.
   **/
  @Output() openDettaglio: EventEmitter<RecordEsercizio> = new EventEmitter


  /** 
   * Per comunicare alla finestra modale la richiesta di creare un nuovo
   * esercizio o modificarne uno esistente.
   */
  @Output() openActionEsercizio: EventEmitter<any> = new EventEmitter


  constructor( private exService : RiabilNeuromotoriaService) {
    this.pacchetto = new RecordPacchetto
    this.esercizi = []
    this.view_esercizi_visible = false
    this.exSubscr = null
    this.id_esercizio_selected = -1
    this.schedaValutazione = null
  }


  ngOnInit() {
    /**
     * Si sottoscrive alla lista dei pacchetti per ricevere il pacchetto di cui si vuole
     * visualizzare gli esercizi, oppure, se pkt e' vuoto per chiudere il dettaglio
     * qualore fosse aperto.
     */
    this.listaPacchetti.selectedPkt.subscribe ( pkt => {
      //console.log("this.listaPacchetti.selectedPkt", pkt)
      if ( pkt ) {
        this.pacchetto.copy(pkt)
        console.log(this.pacchetto)
        this.loadEserciziPacchetto()
        this.getSchedaValutazione()
      }
      else {
        this.view_esercizi_visible = false
      }
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
    this.schedaValutazione = null
    if ( this.exSubscr) 
      this.exSubscr.unsubscribe()
  }


  /**
   * Assegna una classe di stile per evidenziare una riga selezionata col mouse.
   * @param row riferimento alla riga cliccata della tabella HTML
   */
  onForeground(id_ex:number, row, event:MouseEvent) {
    event.preventDefault()
    this.id_esercizio_selected = id_ex

    $('#tableEsercizi tr td').removeClass('marked-row');
    $('#tableEsercizi tr td').removeClass('marked-row-first-col');
    $('#tableEsercizi tr td').removeClass('marked-row-last-col');
    for (var j=0; j<row.cells.length; j++) {
      $(row.cells[j]).addClass('marked-row'); 
    }
    if (row.cells.length>0) {
      $(row.cells[0]).addClass('marked-row-first-col');
      $(row.cells[row.cells.length-1]).addClass('marked-row-last-col');
    }
  }


  /**
   * Aggiorna il numero dei multimedia associati all'esercizio selezionato (id_esercizio_selected)
   * @param new_count il valore aggiornato
   */
  updateCountMultimedia(new_count:number) {
    /*
    this.esercizi.forEach (ex => {
      if (ex.id_ex==this.id_esercizio_selected)
        ex.count_media = new_count
    })*/
    let ex = this.esercizi.filter( ex => ex.id_ex==this.id_esercizio_selected )[0]
    ex.count_media = new_count
  }


  /**
   * Carica la lista degli esercizi del pacchetto corrente, al termine
   * e se l'esito e' positivo esegue la funzione di callback, se specificata.
   */
  loadEserciziPacchetto(callback=null) {
    console.log("ListaEserciziComponent.loadEserciziPacchetto")
    
    NeuroApp.showWait();
    
    let serv = this.exService.loadEserciziPacchetto(this.pacchetto)
    
    this.exSubscr = serv.subscribe (
        result => {
          console.log(result)
          NeuroApp.hideWait()
          this.esercizi = result
          this.esercizi.forEach(es => {
            RecordEsercizio.decode(es)
          })
          this.view_esercizi_visible = true
          NeuroApp.scrollTo('divListaEserciziPacchetto')
          this.exSubscr.unsubscribe()
          if(callback) callback()
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
   * La funzione di callback viene passata al metodo loadEserciziPacchetto().
   */
  reloadEserciziPacchetto(callback) {
    console.log("ListaEserciziComponent ** reloadEserciziPacchetto **")
    NeuroApp.removePopover()
    this.esercizi = []
    this.loadEserciziPacchetto(callback);
    this.hideDettaglioEsercizio()
  }


  /**
   * Ottiene dal DB la scheda di valutazione per questo pacchetto, se esiste.
   * @param id_scheda id della scheda di valutazione
   */
  getSchedaValutazione() {

    let id_scheda = this.pacchetto.id_scheda_val
    if (id_scheda==-1) {
      this.schedaValutazione = null;
      return
    }

    let schedaSubscr : Subscription
    let serv = this.exService.getSchedaValutazione(id_scheda)

    schedaSubscr = serv.subscribe (
      result => {
        schedaSubscr.unsubscribe()
        this.schedaValutazione = new RecordMedia
        this.schedaValutazione.copy(result)
        RecordMedia.decode(this.schedaValutazione)
        console.log(this.schedaValutazione)
      },
      error => {
        schedaSubscr.unsubscribe()
      }
    )
  }


  /**
  * Apre la scheda di valutazione.
  * @param url 
  */
  openScheda(ev:MouseEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    window.open(NeuroApp.G_URL_ROOT + "/" + this.schedaValutazione.url_media)
  }
  
  
  /**
   * Richiede conferma di cancellazione dell'esercizio in input, e se confermato avvia la cancellazione.
   * @param pkt 
   */
  confermaCancellaEsercizio(event:MouseEvent, ex:RecordEsercizio)
  {
    NeuroApp.removePopover()
    event.preventDefault()

    let ambito  = this.listaPacchetti.AMBITO
    
    let title   = ambito==1 
                  ? "<h3>Cancella esercizio</h3>"
                  :  "<h3>Cancella modalit&agrave;</h3>"

    let message = ambito==1 
                  ? "<h6 p-4 style='line-height:1.6;'>Conferma rimozione dell'esercizio <label class='text-danger'>\""+ex.nome+"\"</label></h6>"
                  : "<h6 p-4 style='line-height:1.6;'>Conferma rimozione della modalit&agrave; <label class='text-danger'>\""+ex.nome+"\"</label></h6>"
    
    let self = this;
    
    bootbox.dialog ({
        title: title, 
        message: message,
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-dark btn-md"
          }, 
          "Rimuovi" : { 
             className:"btn-danger btn-md",
             callback: function(){
              self.cancellaEsercizio(ex);
             } // end callback
          } // end Rimuovi
       } // end buttons
    }); // bootbox.dialog

  } // confermaCancellaEsercizio()


  /**
   * Cancella un esercizio richiamando il metodo di cancellazione
   * del servizio exService
   * @param ex esercizio da cancellare
   */
  cancellaEsercizio(ex:RecordEsercizio) {
    console.log("ListaEserciziComponent.cancellaEsercizio")
    NeuroApp.showWait();
    
    let serv = this.exService.cancellaEsercizio(ex)
    let self = this
    this.exSubscr = serv.subscribe (
        result => {
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Esercizio "<b>${ex.nome}</b>" cancellato`)
          // Aggiorna la lista degli esercizi di questo pacchetto, e al termine
          // aggiorna il campo dell'interfaccia grafica che mostra questo valore
          this.reloadEserciziPacchetto (
            function() {
              self.updateNumEsercizi()
            }
          );
        },
        error => {
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
    )
  }
  
  
  /**
   * Aggiorna il numero degli esercizi del pacchetto corrente sulla interfaccia grafica
   */
  updateNumEsercizi() {
      console.log("ListaEserciziComponent.updateNumEsercizi", this.pacchetto.id, this.esercizi.length)
      this.listaPacchetti.updateNumEsercizi(this.pacchetto.id, this.esercizi.length )
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

    // comunica all finestra modale l'azione da eseguire (nuovo esercizio)
    let obj = {
      azione: "nuovo_esercizio",
      id_pkt: this.pacchetto.id
    }
    this.openActionEsercizio.emit( obj )
    
    $('#actionEsercizio').modal('show')
  }


  formModifEsercizio(event:MouseEvent, esercizio:RecordEsercizio) {
    event.preventDefault()
    NeuroApp.removePopover()

    // comunica all finestra modale l'azione da eseguire (nuovo esercizio)
    let obj = {
      azione    :"modifica_esercizio",
      esercizio : esercizio
    }
    
    // comunica all finestra modale l'esercizio da modificare
    this.openActionEsercizio.emit(obj)
    
    // infine apre la modale
    $('#actionEsercizio').modal('show')
  }

}
