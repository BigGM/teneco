
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroApp } from '../../../neuro-app';
import { ListaPacchettiComponent } from '../lista-pacchetti/lista-pacchetti.component';
import { ActionPacchetto } from '../action-pacchetto'
import { RecordPacchetto } from '../../../classes/record-pacchetto'


// questo e' per jQuery
declare var $: any;

@Component({
  selector: 'app-new-pacchetto',
  templateUrl: './new-pacchetto.component.html',
  styleUrls: ['./new-pacchetto.component.css']
})
export class NewPacchettoComponent extends ActionPacchetto implements OnInit, OnDestroy {

  @Input() listaPacchetti: ListaPacchettiComponent;

  constructor(private pktService : RiabilNeuromotoriaService) {
    super()
  }

  ngOnInit() {
    super.init()
    this.initSummernote()
  }

  ngOnDestroy() {
    console.log( "NewPacchettoComponent => onDestroy" )
    super.unsubscribe()
  
    // Cancella i codice html creato da summernote
    $('#summernote-newpkt-descr').summernote('destroy')
    $('#summernote-newpkt-prereq').summernote('destroy')
  }


  /**
   * Inizializza i campi di testo ricoperti dalla libreria summernote
   */
  initSummernote() {
    let note_options = super.getSummernoteOptions()

    // imposta la descrizione come campo obbligatorio (serve per cambiare lo stile del campo di testo)
    note_options.required = true
    $('#summernote-newpkt-descr').summernote(note_options)

    // questo non e' obbligatorio
    note_options.required = false
    $('#summernote-newpkt-prereq').summernote(note_options)

  } // initSummernote()



  /**
   * Salva su db il nuovo pacchetto.
   * @param form
   */
  salvaPacchetto(form) {
    console.log("NewPacchettoComponent.salvaPacchetto")

    // Rimuove popover che puo' essere stato aperto
    NeuroApp.removePopover()
    
    //console.log(form.value)
    this.pacchetto.descr = $('#summernote-newpkt-descr').summernote('code')
    this.pacchetto.pre_req =  $('#summernote-newpkt-prereq').summernote('code')
    
    // trim dei campi
    this.pacchetto.trim()

    // e controllo dei campi obbligatori
    let fields_empty = "";
    fields_empty += super.checkMandatory("Nome",this.pacchetto.nome)
    fields_empty += super.checkMandatory("Descrizione",this.pacchetto.descr)

    // Manca qualche campo => messaggio di errore ed esce
    if (fields_empty.length > 0 ) {
      NeuroApp.custom_error("Uno o pi&ugrave; campi obbligatori sono vuoti:<br> "+fields_empty,"Errore")
      return
    }

    NeuroApp.showWait();
    
    let serv = this.pktService.salvaPacchetto(this.pacchetto,this.ambito)    
    this.pktSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info("Pacchetto aggiunto nel sistema")
        // Aggiorna la lista delle voci di glossario
        this.listaPacchetti.reloadPacchetti(this.ambito)
        this.pktSubscr.unsubscribe()
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Error")
        this.pktSubscr.unsubscribe()
      }
    )
  } // salvaPacchetto(form)


  /**
   * Ripulisce i campi della form.
   * Richiama il metodo corrispondente della superclasse.
   * @param form 
   */
  reset(form) {
    super.reset(form)
    console.log(this.pacchetto)
    $('#summernote-newpkt-descr').summernote('reset')
    $('#summernote-newpkt-prereq').summernote('reset')
  }
}
