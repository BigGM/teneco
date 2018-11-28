import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroApp } from '../../../neuro-app';
import { NeuroAppService } from '../../../services/neuro-app.service';
import { ListaEserciziComponent } from '../lista-esercizi/lista-esercizi.component';
import { Subscription } from 'rxjs';
import { RecordEsercizio } from '../../../classes/record-esercizio'
import { Gruppo } from '../../../classes/gruppo'



// questo e' per jQuery
declare var $: any;

@Component({
  selector: 'app-action-esercizio',
  templateUrl: './action-esercizio.component.html',
  styleUrls: ['./action-esercizio.component.css']
})
export class ActionEsercizioComponent implements OnInit, OnDestroy {

  @Input() listaEsercizi: ListaEserciziComponent

  entryEsercizio: RecordEsercizio   // questo e' l'esercizio all'apertura della finestra
  esercizio : RecordEsercizio
	gruppi    : Array<Gruppo>
  exSubscr  : Subscription
  azione    : string;         // azione richiesta: nuovo_esercizio, modifica_esercizio
  titolo    : string;         // questo e' il titolo da inserire nella finestra modale


  constructor (
    private exService    : RiabilNeuromotoriaService,
    private neuroService : NeuroAppService )
  {
      this.neuroService = neuroService
      this.entryEsercizio = new RecordEsercizio()
      this.esercizio = new RecordEsercizio()
      this.gruppi = Array<Gruppo>()
  }


  ngOnInit() {
      this.esercizio = new RecordEsercizio
      this.esercizio.reset()
      this.exSubscr = null
      this.initSummernote()

      // Se la lista dei gruppi e' gia' inserita nell'array globale usa quello,
      // così evita un accesso non necessario al server
      if ( NeuroApp.gruppi ) 
        this.gruppi = NeuroApp.gruppi
      else
        this.loadGruppi()


      /**
       * Si sottoscrive al componente ListaEserciziComponent per ricevere l'azione da eseguire.
       * Il campo 'obj' in input ha un campo azione che puo' essere "nuovo_esercizio" o
       * "modifica_esercizio", 
       * nel primo caso 'obj'  posside un second campo 'id_pkt' con l'id del pacchetto a cui il
       * nuovo esercizio verra' associato;
       * nel secondo caso 'obj' avra' anche un campo 'esercizio' con l'esercizio da modificare
       */
      this.listaEsercizi.openActionEsercizio.subscribe (obj => {
        console.log("this.listaEsercizi.openActionEsercizio.subscribe", obj)

        this.azione = obj.azione

        if (this.azione=="nuovo_esercizio") {
            this.titolo = "Nuovo esercizio"
            this.esercizio.reset()
            this.esercizio.id_pkt = obj.id_pkt
            this.entryEsercizio.reset()
        }

        else if (this.azione=="modifica_esercizio") {
            this.titolo = "Modifica esercizio"
            this.esercizio.copy(obj.esercizio)
            this.entryEsercizio.copy(obj.esercizio)
        }
       
        // inzializza i campi summernote (il bind angular non puo' funzionare per questi)
        $('#summernote-actex-descr').summernote('code', this.esercizio.descr)
        $('#summernote-actex-testo').summernote('code', this.esercizio.testo)
        $('#summernote-actex-alert').summernote('code', this.esercizio.alert)
        $('#summernote-actex-limit').summernote('code', this.esercizio.limitazioni)
      })
  } // ngOnInit()


 ngOnDestroy() {
    console.log( "NewEsercizioComponent => onDestroy" )
    if (this.exSubscr) this.exSubscr.unsubscribe()
    this.listaEsercizi.openActionEsercizio.unsubscribe()
    this.gruppi   = null
    this.esercizio = null
    this.entryEsercizio = null

    // Cancella dal DOM il codice inserito da summernote
    $('#summernote-actex-descr').summernote('destroy')
    $('#summernote-actex-testo').summernote('destroy')
    $('#summernote-actex-alert').summernote('destroy')
    $('#summernote-actex-limit').summernote('destroy')
  }


  /**
   * Inizializza i campi di testo ricoperti dalla libreria summernote
   */
  initSummernote() {
    let note_options = this.getSummernoteOptions()

    // descrizione (obbligatorio)
    note_options.required = true
    $('#summernote-actex-descr').summernote(note_options)

    note_options.required = false
    $('#summernote-actex-testo').summernote(note_options)
    $('#summernote-actex-alert').summernote(note_options)
    $('#summernote-actex-limit').summernote(note_options)

  } // initSummernote()


  /**
   * Crea l'oggetto con le opzioni di inizializzazione della libreria summernote
   */
  getSummernoteOptions() : any {
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
   * Salva sul db il nuovo esercizio o un esercizio modificato, per distinguere i due casi
   * e' sufficente controllare il valore dell'attributo 'this.azione' che puo' valere
   * "nuovo_esercizio" o "modifica_esercizio"
   * @param form
   */
  salvaEsercizio(form) {
    console.log("ActionEsercizioComponent.salvaEsercizo")

    // Rimuove popover che puo' essere stato aperto
    NeuroApp.removePopover()

    // console.log(form.value)
    this.esercizio.descr = $('#summernote-actex-descr').summernote('code')
    this.esercizio.testo = $('#summernote-actex-testo').summernote('code')
    this.esercizio.alert = $('#summernote-actex-alert').summernote('code')
    this.esercizio.limitazioni = $('#summernote-actex-limit').summernote('code')

    // trim dei campi
    this.esercizio.trim()

    // e controllo dei campi obbligatori
    let fields_empty = "";
    fields_empty += this.checkMandatory("Nome",this.esercizio.nome)
    fields_empty += this.checkMandatory("Descrizione",this.esercizio.descr)

    // Manca qualche campo => messaggio di errore ed esce
    if (fields_empty.length > 0 ) {
      NeuroApp.custom_error("Uno o pi&ugrave; campi obbligatori sono vuoti:<br> "+fields_empty,"Errore")
      return
    }

    console.log("salvaEsercizio", this.esercizio)
    NeuroApp.showWait();

    let php_script = this.azione=="nuovo_esercizio" 
                  ? "salva_esercizio2.php" 
                  : "salva_esercizio_modificato2.php"

    let db_proc = this.azione=="nuovo_esercizio" 
                  ? "NeuroApp.salva_esercizio" 
                  : "NeuroApp.salva_esercizio_modificato"

    let info_msg = this.azione=="nuovo_esercizio" 
                  ? "Esercizio aggiunto al pacchetto"
                  : "Esercizi modificato"

    let serv = this.exService.salvaEsercizio(this.esercizio, php_script, db_proc)
    this.exSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        
        NeuroApp.custom_info(info_msg)
        // Aggiorna la lista degli esercizi del pacchetto
        this.listaEsercizi.reloadEserciziPacchetto()
        this.exSubscr.unsubscribe()
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Errore")
        this.exSubscr.unsubscribe()
      }
    )
  } // salvaEsercizio(form)



  /**
   * Ripulisce i campi della form.
   * @param form 
   */
  reset(form) {
    console.log("reset", this.esercizio)
    form.reset()
    this.esercizio.reset()
    NeuroApp.removePopover()
    
    // re-inzializza i campi summernote (il bind angular non puo' funzionare per questi)
    $('#summernote-actex-descr').summernote('code', this.esercizio.descr)
    $('#summernote-actex-testo').summernote('code', this.esercizio.testo)
    $('#summernote-actex-alert').summernote('code', this.esercizio.alert)
    $('#summernote-actex-limit').summernote('code', this.esercizio.limitazioni)
  }


  /**
   * Riassegna all'esercizio  (this.eserczio) i valori iniziali.
   */
  reloadEntryEsercizio() {
    // Rimuove eventuali popover aperti
    NeuroApp.removePopover()
    this.esercizio.copy(this.entryEsercizio)
    this.esercizio.descr = $('#summernote-actex-descr').summernote('code')
    this.esercizio.testo = $('#summernote-actex-testo').summernote('code')
    this.esercizio.alert = $('#summernote-actex-alert').summernote('code')
    this.esercizio.limitazioni = $('#summernote-actex-limit').summernote('code')
  }


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


 /**
 * Legge dal DB le tipologie di gruppi e le inserisce nell'array this.gruppi
 */
  loadGruppi() {
    //console.log("NewEsercizioComponent.loadGruppi")
    NeuroApp.showWait();
    
    let serv = this.neuroService.loadGruppi()
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
          NeuroApp.custom_error(error,"Errore")
          this.exSubscr.unsubscribe()
       }
    )
  } // loadGruppi()

}
