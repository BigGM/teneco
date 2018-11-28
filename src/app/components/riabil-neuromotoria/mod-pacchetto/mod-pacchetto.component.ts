
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
  selector: 'app-mod-pacchetto',
  templateUrl: './mod-pacchetto.component.html',
  styleUrls: ['./mod-pacchetto.component.css']
})
export class ModPacchettoComponent extends ActionPacchetto implements OnInit, OnDestroy {

  @Input() listaPacchetti: ListaPacchettiComponent;

  // questo e' il pacchetto all'apertura della finestra modale
  entryPacchetto : RecordPacchetto

  /**
   * Il costruttore del componente riceve in input che usa per ricevere
   * il pacchetto da modificare.
   * @param pktService 
   */
  constructor(private pktService : RiabilNeuromotoriaService) {
    super()
  }

  ngOnInit() {

    super.init()
    this.initSummernote()
    this.entryPacchetto = new RecordPacchetto()
    
    // Si registra sul servizio per ricevere il pacchetto da modificare
    this.pktService.change_pkt.subscribe( (rec) => {
      let r = rec as RecordPacchetto
      
      this.pacchetto.alert_msg = r.alert_msg
      this.pacchetto.alert_msg_visibile = r.alert_msg_visibile
      this.pacchetto.bibliografia = r.bibliografia
      this.pacchetto.contro_ind = r.contro_ind
      this.pacchetto.descr = r.descr
      this.pacchetto.id = r.id
      this.pacchetto.nome = r.nome
      this.pacchetto.patologie_secondarie = r.patologie_secondarie
      this.pacchetto.pre_req = r.pre_req
      this.pacchetto.valutazione = r.valutazione

      this.entryPacchetto.copy( this.pacchetto);
  
      $('#summernote-modpkt-descr').summernote('code', this.pacchetto.descr)
      $('#summernote-modpkt-prereq').summernote('code', this.pacchetto.pre_req)
    })
  }

  ngOnDestroy() {
    console.log( "NewPacchettoComponent => onDestroy" )
    super.unsubscribe()
    // Cancella i codice html creato da summernote
    $('#summernote-modpkt-descr').summernote('destroy')
    $('#summernote-modpkt-prereq').summernote('destroy')
  }

  /**
   * Inizializza i campi di testo ricoperti dalla libreria summernote
   */
  initSummernote() {

    // opzioni per summernote
    let note_options = super.getSummernoteOptions()

    // imposta la descrizione come campo obbligatorio (serve per cambiare lo stile del campo di testo)
    note_options.required = true
    $('#summernote-modpkt-descr').summernote(note_options)

    // questo non e' obbligatorio
    note_options.required = false
    $('#summernote-modpkt-prereq').summernote(note_options)
    
  } // initSummernote()


  
  /**
   * Riassegna al pacchetto collegato con l'interfaccia (this.pacchetto) i valori
   * che aveva all'apertura della finestra modale.
   */
  reloadEntryPkt() {
    // Rimuove eventuali popover aperti
    NeuroApp.removePopover()
    this.pacchetto.copy(this.entryPacchetto)
    $('#summernote-modpkt-descr').summernote('code', this.pacchetto.descr)
    $('#summernote-modpkt-prereq').summernote('code', this.pacchetto.pre_req)
  }


  /**
   * Salva su db il pacchetto modificato.
   * @param form 
   */
  salvaPacchettoModificato(form) {
    console.log("ModPacchettoComponent.salvaPacchettoModificato")

    // Rimuove popover che puo' essere stato aperto
    NeuroApp.removePopover()
    
    //console.log(form.value)
    this.pacchetto.descr = $('#summernote-modpkt-descr').summernote('code')
    this.pacchetto.pre_req = $('#summernote-modpkt-prereq').summernote('code')
    
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
    
    let serv = this.pktService.salvaPacchettoModificato(this.pacchetto,this.ambito)    
    this.pktSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info("Pacchetto modificato")
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
  } // salvaPacchettoModificato(form)


  /**
   * Ripulisce i campi della form.
   * Richiama il metodo corrispondente della superclasse.
   * @param form
   */
  reset(form) {
    console.log("ModPacchettoComponent.reset()")
    super.reset(form)
    $('#summernote-modpkt-descr').summernote('reset')
    $('#summernote-modpkt-prereq').summernote('reset')
  }

}
