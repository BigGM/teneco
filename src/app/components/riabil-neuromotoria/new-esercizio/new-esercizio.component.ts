
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroApp } from '../../../neuro-app';
import { NeuroAppService } from '../../../services/neuro-app.service';
import { ListaEserciziComponent } from '../lista-esercizi/lista-esercizi.component';
import { RecordEsercizio } from '../../../classes/record-esercizio'
import { Gruppo } from '../../../classes/gruppo'
import { ActionEsercizio } from '../action-esercizio'


// questo e' per jQuery
declare var $: any;


/**
 * Attributi ereditadi dalla super classe
 *   esercizio : RecordEsercizio
 *   gruppi    : Array<Gruppo>
 *   exSubscr  : Subscription;
 **/
  
@Component({
  selector: 'app-new-esercizio',
  templateUrl: './new-esercizio.component.html',
  styleUrls: ['./new-esercizio.component.css']
})
export class NewEsercizioComponent extends ActionEsercizio implements OnInit, OnDestroy {

  @Input() listaEsercizi: ListaEserciziComponent;

  
  constructor(
    private exService : RiabilNeuromotoriaService,
    neuroService : NeuroAppService
    ) {
    super(neuroService)
  }

  ngOnInit() {
    super.init()
    this.initSummernote()

    // Se la lista dei gruppi e' gia' inserita nell'array globale usa quello,
    // così evita un accesso non necessario al server
    if ( NeuroApp.gruppi ) 
      this.gruppi = NeuroApp.gruppi
    else
      this.loadGruppi()
  }

  ngOnDestroy() {
    console.log( "NewEsercizioComponent => onDestroy" )
    super.unsubscribe()
    this.gruppi = null
    this.esercizio = null
  
    // Cancella i codice html creato da summernote
    $('#summernote-newex-nome').summernote('destroy')
    $('#summernote-newex-descr').summernote('destroy')
    $('#summernote-newex-testo').summernote('destroy')
    $('#summernote-newex-alert').summernote('destroy')
    $('#summernote-newex-limit').summernote('destroy')
  }


  /**
   * Inizializza i campi di testo ricoperti dalla libreria summernote
   */
  initSummernote() {
    let note_options = super.getSummernoteOptions()

    // imposta il nome come campo obbligatorio (serve per cambiare lo stile del campo di testo)
    note_options.required = true
    $('#summernote-newex-nome').summernote(note_options)

    // descrizione (obbligatorio)
    note_options.required = true
    $('#summernote-newex-descr').summernote(note_options)

    note_options.required = false
    $('#summernote-newex-testo').summernote(note_options)
    $('#summernote-newex-alert').summernote(note_options)
    $('#summernote-newex-limit').summernote(note_options)

  } // initSummernote()


  
  /**
   * Salva su db la nuova voce di glossario inserita via form
   * @param form
   */
  salvaEsercizio(form) {
    console.log("NewEsercizioComponent.salvaEsercizo")

    // Rimuove popover che puo' essere stato aperto
    NeuroApp.removePopover()
    
    //console.log(form.value)
    this.esercizio.id_pkt =  this.listaEsercizi.pacchetto.id
    this.esercizio.descr = $('#summernote-newex-descr').summernote('code')
    this.esercizio.testo = $('#summernote-newex-testo').summernote('code')
    this.esercizio.alert = $('#summernote-newex-alert').summernote('code')
    this.esercizio.limitazioni = $('#summernote-newex-limit').summernote('code')

    console.log("salvaEsercizio", this.esercizio)

    // trim dei campi
    this.esercizio.trim()

    // e controllo dei campi obbligatori
    let fields_empty = "";
    fields_empty += super.checkMandatory("Nome",this.esercizio.nome)
    fields_empty += super.checkMandatory("Descrizione",this.esercizio.descr)

    // Manca qualche campo => messaggio di errore ed esce
    if (fields_empty.length > 0 ) {
      NeuroApp.custom_error("Uno o pi&ugrave; campi obbligatori sono vuoti:<br> "+fields_empty,"Errore")
      return
    }

    NeuroApp.showWait();
    
    let serv = this.exService.salvaEsercizioPacchetto(this.esercizio)
    this.exSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info("Esercizio aggiunto al pacchetto")
        // Aggiorna la lista delle voci di glossario
        this.listaEsercizi.reloadEserciziPacchetto()
        this.exSubscr.unsubscribe()
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Errore")
        this.exSubscr.unsubscribe()
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
    console.log(this.esercizio)
    $('#summernote-newex-nome').summernote('reset')
    $('#summernote-newex-descr').summernote('reset')
    $('#summernote-newex-testo').summernote('reset')
    $('#summernote-newex-alert').summernote('reset')
    $('#summernote-newex-limit').summernote('reset')
  }

}
