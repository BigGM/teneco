import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RiabilNeuromotoriaService, RecordPacchetto} from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';


declare var $ : any;
declare var bootbox: any;

@Component({
  selector: 'app-lista-pacchetti',
  templateUrl: './lista-pacchetti.component.html',
  styleUrls: ['./lista-pacchetti.component.css']
})
export class ListaPacchettiComponent implements OnInit {

  readonly ambito = "1"
  pacchetti     : RecordPacchetto[]
  pktSubscr     : Subscription;
  pacchetto     : RecordPacchetto


  constructor( private pktService : RiabilNeuromotoriaService) {
    //console.log( "ListaPacchettiComponent costruttore" )
    this.pacchetti = []
    this.pacchetto = null
  }


  ngOnInit() {
    //console.log( this.pacchetti.length )
    this.loadPacchetti(this.ambito)
  }

  ngOnDestroy() {
    console.log( "ListaPacchettiComponent => onDestroy" )
    this.pacchetti = null
    this.pacchetto = null
    this.pktSubscr.unsubscribe()
  }


/**
 * Assegna una classe di stile per evidenziare una riga selezionata col mouse.
 * @param row riferimento alla riga cliccata della tabella HTML
 */
onForeground(row,event:MouseEvent) {
  event.preventDefault()
  $('#tablePacchetti tr td').removeClass('marked-row');
  $('#tablePacchetti tr td').removeClass('marked-row-first-col');
  $('#tablePacchetti tr td').removeClass('marked-row-last-col');
  for (var j=0; j<row.cells.length; j++) {
     $(row.cells[j]).addClass('marked-row'); 
  }
  if (row.cells.length>0) {
    $(row.cells[0]).addClass('marked-row-first-col');
    $(row.cells[row.cells.length-1]).addClass('marked-row-last-col');
  }
}


/**
 * rimuove qualunque popover sia aperta 
 */
private removePopover() {
  console.log("removePopover")
  $('.my-popover-glossario').remove()
  $('.my-popover-video').remove()
  $('.my-popover-audio').remove()
  $('.my-popover-image').remove()
}


  /**
   * Carica le voci di glossario sull'array this.glossario o
   * emette una popup di errore.
   * @ambito -  1: riabilitazione neuromotoria
   *            2: riabilitazione cognitiva
   */
  loadPacchetti(ambito) {
    console.log("ListaPacchettiComponent.loadPacchetti")
    
    NeuroApp.showWait();
    
    let serv = this.pktService.loadPacchetti(ambito)
    
    this.pktSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.pacchetti = result
          this.pktSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pktSubscr.unsubscribe()
        }
      )
  } // loadPacchetti()


  reloadPacchetti(ambito) {
    console.log("** reloadPacchetti **")
    this.removePopover()
    this.pacchetto = null
    this.pacchetti = []
    this.loadPacchetti(ambito);
  }


  loadEserciziPacchetto(event:MouseEvent, pkt) {
    console.log("** loadEserciziPacchetto **")
    this.removePopover()
  }


  /**
   * Richiede conferma di cancellazione del pacchetto in input, e se confermato avvia la cancellazione.
   * @param mouseEvent 
   * @param pkt 
   */
  confermaCancellaPacchetto(mouseEvent:MouseEvent, pkt:RecordPacchetto)
  {
    this.removePopover()
    mouseEvent.preventDefault()

    let self = this;
    bootbox.dialog ({
        title: "<h3>Cancella pacchetto</h3>", 
        message: "<h6 p-4 style='line-height:1.6;'>Conferma rimozione del pacchetto <label class='text-danger'>\""+pkt.nome+"\"</label></h6>",
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-secondary btn-md"
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
    console.log("ListaPacchettiComponent.cancellaPacchetto")
    NeuroApp.showWait();
    
    let serv = this.pktService.cancellaPacchetto(pkt)
    
    this.pktSubscr = serv.subscribe (
        result => {
          this.pktSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Pacchetto "<b>${pkt.nome}</b>" cancellato`)
          // Aggiorna la lista dei pacchetti
          this.reloadPacchetti(this.ambito)
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
    this.removePopover()
    $('#nuovoPacchetto').modal('show')
  }

  formModifPacchetto(mouseEvent, pkt) {
    this.removePopover()
    mouseEvent.stopPropagation()
    alert("formModifPacchetto")
  }
}