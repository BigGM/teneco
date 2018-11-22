
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroApp } from '../../../neuro-app';
import { ListaEserciziComponent } from '../lista-esercizi/lista-esercizi.component';
import { RecordEsercizio } from '../../../classes/record-esercizio'
import { Gruppo } from '../../../classes/gruppo'
import { ActionEsercizio } from '../action-esercizio'


// questo e' per jQuery
declare var $: any;

/**
 * Attributi ereditadi dalla super classe
 *  esercizio : RecordEsercizio
 *  gruppi    : Array<Gruppo>
 *  exSubscr  : Subscription;
 */
  

@Component({
  selector: 'app-new-esercizio',
  templateUrl: './new-esercizio.component.html',
  styleUrls: ['./new-esercizio.component.css']
})
export class NewEsercizioComponent extends ActionEsercizio implements OnInit, OnDestroy {

  @Input() listaEsercizi: ListaEserciziComponent;

  
  constructor(private exService : RiabilNeuromotoriaService) {
    super()
  }

  ngOnInit() {
    super.init()
    this.initSummernote()
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
   * Legge dal DB le tipologie di gruppi e le inserisce nell'array this.gruppi
   */
  loadGruppi() {
    //console.log("NewEsercizioComponent.loadGruppi")
    
    NeuroApp.showWait();
    
    let serv = this.exService.loadGruppi()
    this.exSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.gruppi = result    
          this.gruppi.push ( <Gruppo>{id:-1,nome:"-- Nessun gruppo --",descr:""} )
          //console.log(this.gruppi)
          this.exSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.exSubscr.unsubscribe()
        }
      )
  } // loadGruppi()


  /**
   * Salva su db la nuova voce di glossario inserita via form
   * @param form 
   */
  salvaEsercizio(form) {
    alert("NewEsercizioComponent.salvaEsercizo")
  }



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
