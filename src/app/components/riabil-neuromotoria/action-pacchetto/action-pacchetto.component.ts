import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroApp } from '../../../neuro-app';
import { ListaPacchettiComponent } from '../lista-pacchetti/lista-pacchetti.component';
import { RecordPacchetto } from '../../../classes/record-pacchetto'


// questo e' per jQuery
declare var $: any;


@Component({
  selector: 'app-action-pacchetto',
  templateUrl: './action-pacchetto.component.html',
  styleUrls: ['./action-pacchetto.component.css']
})
export class ActionPacchettoComponent implements OnInit, OnDestroy {

  @Input() listaPacchetti: ListaPacchettiComponent;

  // questo e' il pacchetto all'apertura della finestra modale in modalita: modifica
  entryPacchetto : RecordPacchetto

  readonly ambito = "1"
  pacchetto : RecordPacchetto
  pktSubscr : Subscription
  azione    : string;         // azione richiesta: nuovo_esercizio, modifica_esercizio
  titolo    : string;         // questo e' il titolo da inserire nella finestra modale


  constructor(private pktService : RiabilNeuromotoriaService) {
  }

  ngOnInit() {
      this.pacchetto = new RecordPacchetto()
      this.pacchetto.reset()
      this.entryPacchetto = new RecordPacchetto()
      this.pktSubscr = null
      this.initSummernote()

      /**
       * Si sottoscrive al componente ListaEserciziComponent per ricevere l'azione da eseguire.
       * Il campo 'obj' in input ha un campo azione che puo' essere "nuovo_esercizio" o
       * "modifica_esercizio", 
       * nel primo caso 'obj'  posside un second campo 'id_pkt' con l'id del pacchetto a cui il
       * nuovo esercizio verra' associato;
       * nel secondo caso 'obj' avra' anche un campo 'esercizio' con l'esercizio da modificare
       */
      this.listaPacchetti.openActionPacchetto.subscribe (obj => {
        console.log("this.listaPacchetti.openActionPacchetto", obj)

        this.azione = obj.azione

        if (this.azione=="nuovo_pacchetto") {
            this.titolo = "Nuovo pachetto"
            this.pacchetto.reset()
        }
        else if (this.azione=="modifica_pacchetto") {
            this.titolo = "Modifica pacchetto"
            this.pacchetto.copy(obj.pacchetto)
            this.entryPacchetto.copy(obj.pacchetto)
        }
        // inzializza i campi summernote (il bind angular non puo' funzionare per questi)
        $('#summernote-actpkt-descr').summernote('code', this.pacchetto.descr)
        $('#summernote-actpkt-prereq').summernote('code', this.pacchetto.pre_req)
      })
  }

  ngOnDestroy() {
    console.log( "ActionPacchettoComponent => onDestroy" )

    if (this.pktSubscr) this.pktSubscr.unsubscribe()
  
    // Cancella i codice html creato da summernote
    $('#summernote-actpkt-descr').summernote('destroy')
    $('#summernote-actpkt-prereq').summernote('destroy')
  }


  /**
   * Inizializza i campi di testo ricoperti dalla libreria summernote
   */
  initSummernote() {
    let note_options = this.getSummernoteOptions()

    // imposta la descrizione come campo obbligatorio (serve per cambiare lo stile del campo di testo)
    note_options.required = true
    $('#summernote-actpkt-descr').summernote(note_options)

    // questo non e' obbligatorio
    note_options.required = false
    $('#summernote-actpkt-prereq').summernote(note_options)

  } // initSummernote()


  /**
    * Restituisce l'oggetto con le opzioni per la libreria summernote
    */
  private getSummernoteOptions() : any {
    let URL_ROOT = NeuroApp.G_URL_ROOT + "/cgi-bin";
    return  {
      lang: "it-IT",
      height: "90px",
      minHeight: "90px",
      maxHeight: "90px",
      dialogsInBody: true,
      dialogsFade: true,
      airMode:true,
      required: false,
      //disableLinkTarget: true, non usato dalle dialog video, audio e glossario aggiunte
      videoLinkFunction: URL_ROOT + "/lista_media2.php?proc=NeuroApp.lista_media&tipo_media=video&lista_id=-1",
      audioLinkFunction: URL_ROOT + "/lista_media2.php?proc=NeuroApp.lista_media&tipo_media=audio&lista_id=-1",
      imageLinkFunction: URL_ROOT + "/lista_media2.php?proc=NeuroApp.lista_media&tipo_media=image&lista_id=-1",
      glossarioLinkFunction: URL_ROOT + "/lista_glossario2.php?proc=NeuroApp.glossario",
      popover: {
         air: [
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['linkVideo', ['linkVideo']],
            ['linkAudio', ['linkAudio']],
            ['linkImage', ['linkImage']],
            ['linkGlossario', ['linkGlossario']],
            ['link', ['unlink']],
         ]
      },
      callbacks: {
         onInit: function() {
         console.log('Summernote is launched');
         $('.note-editable').addClass('form-control');
         $('.note-editable').css('height', '300px'); 
         }
      }
    }
  } // getSummernoteOptions()



 /**
  * Ripulisce i campi della form.
  * Richiama il metodo corrispondente della superclasse.
  * @param form 
  */
  reset(form) {
    // NB. il metodo reset() della form mette a null i campi del modello,
    // per questo motivo il metodo reset del pacchetto viene chiamato dopo.
    form.reset()
    this.pacchetto.reset()
    NeuroApp.removePopover()
    $('#summernote-actpkt-descr').summernote('reset')
    $('#summernote-actpkt-prereq').summernote('reset')
  }


 /**
  * Riassegna al pacchetto collegato con l'interfaccia (this.pacchetto) i valori
  * che aveva all'apertura della finestra modale.
  */
  reloadEntryPkt() {
    // Rimuove eventuali popover aperti
    NeuroApp.removePopover()
    this.pacchetto.copy(this.entryPacchetto)
    $('#summernote-actpkt-descr').summernote('code', this.pacchetto.descr)
    $('#summernote-actpkt-prereq').summernote('code', this.pacchetto.pre_req)
  }


 /**
  * Salva su db il nuovo pacchetto o il pacchetto modificato
  * @param form
  */
  salvaPacchetto(form) {
    console.log("ActionPacchettoComponent.salvaPacchetto")

    // Rimuove popover che puo' essere stato aperto
    NeuroApp.removePopover()
    
    //console.log(form.value)
    this.pacchetto.descr = $('#summernote-actpkt-descr').summernote('code')
    this.pacchetto.pre_req =  $('#summernote-actpkt-prereq').summernote('code')
    
    // trim dei campi
    this.pacchetto.trim()

    // e controllo dei campi obbligatori
    let fields_empty = "";
    fields_empty += this.checkMandatory("Nome",this.pacchetto.nome)
    fields_empty += this.checkMandatory("Descrizione",this.pacchetto.descr)

    // Manca qualche campo => messaggio di errore ed esce
    if (fields_empty.length > 0 ) {
      NeuroApp.custom_error("Uno o pi&ugrave; campi obbligatori sono vuoti:<br> "+fields_empty,"Errore")
      return
    }

    NeuroApp.showWait();

    let php_script = this.azione=="nuovo_pacchetto" 
                    ? "salva_pacchetto2.php" 
                    : "salva_pacchetto_modificato2.php"

    let db_proc = this.azione=="nuovo_pacchetto" 
                    ? "NeuroApp.salva_pacchetto" 
                    : "NeuroApp.salva_pacchetto_modificato"

    let info_msg = this.azione=="nuovo_pacchetto" 
                    ? "Pacchetto creato"
                    : "Pacchetto modificato"


    let serv = this.pktService.salvaPacchetto(this.pacchetto, php_script, db_proc, this.ambito)
    this.pktSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info(info_msg)
        // Aggiorna la lista delle voci di glossario
        this.listaPacchetti.reloadPacchetti(this.ambito)
        this.pktSubscr.unsubscribe()
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Errore")
        this.pktSubscr.unsubscribe()
      }
    )
  } // salvaPacchetto(form)


   /**
    * Controlla se il campo in input e' vuoto, se e' così restituisce una stringa
    * formattata da presentare nel messaggio di errore; se e' valorizzata ritorna
    * una stringa vuota.
    * 
    * @param field_name nome del campo
    * @param field_value valore definito nell'interfaccia
    */
   protected checkMandatory(field_name:string, field_value:string) : string {
    //console.log (field_name, field_value)
    if ( field_value==null || field_value=="undefined" || field_value==="" || field_value=="<p><br></p>") {
       return `<b>${field_name}</b><br>`
    }
    return ""
 }


}
