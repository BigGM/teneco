import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroAppService } from '../../../services/neuro-app.service'
import { NeuroApp } from '../../../neuro-app';
import { ListaPacchettiComponent } from '../../riabil-neuromotoria/lista-pacchetti/lista-pacchetti.component';
import { PacchettiFormazioneComponent } from '../../formazione/pacchetti-formazione/pacchetti-formazione.component';
import { PacchettiCognitiviComponent } from '../../riabil-cognitiva/pacchetti-cognitivi/pacchetti-cognitivi.component';
import { RecordPacchetto } from '../../../classes/record-pacchetto'
import { RecordMedia } from '../../../classes/record-media'

// questo e' per jQuery
declare var $: any;

// La libreria javascript
declare var NeuroAppJS : any;


@Component({
  selector: 'app-action-pacchetto',
  templateUrl: './action-pacchetto.component.html',
  styleUrls: ['./action-pacchetto.component.css']
})
export class ActionPacchettoComponent implements OnInit, OnDestroy {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug : boolean = false;

  @Input() listaPacchetti: ListaPacchettiComponent | PacchettiFormazioneComponent | PacchettiCognitiviComponent

  // questo e' il pacchetto all'apertura della finestra modale in modalita: modifica
  entryPacchetto : RecordPacchetto

  ambito    : number
  pacchetto : RecordPacchetto
  pktSubscr : Subscription
  azione    : string;         // azione richiesta: nuovo_esercizio, modifica_esercizio
  titolo    : string;         // questo e' il titolo da inserire nella finestra modale

  /** La lista degli elementi multimediali non collegati all'esercizio */
  listaSchede : Array<RecordMedia>
  
  // scheda di valutazione assegnata al pacchetto corrente
  schedaValutazione : RecordMedia


  constructor(private pktService : RiabilNeuromotoriaService,
              private neuroAppService : NeuroAppService) {
  }

  ngOnInit() {
      this.pacchetto = new RecordPacchetto()
      this.pacchetto.reset()
      this.entryPacchetto = new RecordPacchetto()
      this.pktSubscr = null
      this.ambito = this.listaPacchetti.AMBITO
      this.schedaValutazione = new RecordMedia()
      this.initSummernote()

      console.log("AMBITO from listaPacchetti", this.listaPacchetti.AMBITO)


      /**
       * Si sottoscrive al componente ListaPacchettiComponent o PacchettiFormazioneComponent 
       * per ricevere l'azione da eseguire.
       * Il campo 'obj' in input ha un campo azione che puo' essere "nuovo_pacchetto" o
       * "modifica_pacchetto",
       * nel secondo caso 'obj' avra' anche un campo 'pacchetto' con il pacchetto da modificare.
       */
      this.listaPacchetti.openActionPacchetto.subscribe (obj => {
        console.log("this.listaPacchetti.openActionPacchetto", obj)

        this.azione = obj.azione
        this.schedaValutazione.reset()

        if (this.azione=="nuovo_pacchetto") {
          
            if (this.ambito==1)
              this.titolo = "Nuovo pacchetto"
            else if (this.ambito==2) 
              this.titolo = "Nuovo pacchetto cognitivo"
            else if (this.ambito==3) 
              this.titolo = "Nuova procedura"
            this.pacchetto.reset()
        }
        else if (this.azione=="modifica_pacchetto") {
            
            if (this.ambito==1)
                this.titolo = "Modifica pacchetto"
            else if (this.ambito==2) 
              this.titolo = "Modifica pacchetto cognitivo"
            else if (this.ambito==3) 
              this.titolo = "Modifica procedura"
            
            this.pacchetto.copy(obj.pacchetto)
            this.entryPacchetto.copy(obj.pacchetto)

            // Se al pachetto e' assegnata una scheda di valutazione, la legge
            if ( this.pacchetto.id_scheda_val != -1 ) {
              this.readSchedaForId(this.pacchetto.id_scheda_val)
              this.entryPacchetto.id_scheda_val = this.pacchetto.id_scheda_val
            }
        }
        // inzializza i campi summernote (il bind angular non puo' funzionare per questi)
        $('#summernote-actpkt-descr').summernote('code', this.pacchetto.descr)
        $('#summernote-actpkt-prereq').summernote('code', this.pacchetto.pre_req)
        $('#summernote-actpkt-prereq-comp').summernote('code', this.pacchetto.pre_req_comp)
      })
  }

  ngOnDestroy() {
    console.log( "ActionPacchettoComponent => onDestroy" )

    if (this.pktSubscr) this.pktSubscr.unsubscribe()
  
    // Cancella i codice html creato da summernote
    $('#summernote-actpkt-descr').summernote('destroy')
    $('#summernote-actpkt-prereq').summernote('destroy')
    $('#summernote-actpkt-prereq-comp').summernote('destroy')
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
    $('#summernote-actpkt-prereq-comp').summernote(note_options)

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
            //$('.note-editable').css('border', '2px solid rgb(144,164,174)'); 
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
    $('#summernote-actpkt-prereq-comp').summernote('reset')
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
    $('#summernote-actpkt-prereq-comp').summernote('code', this.pacchetto.pre_req_comp)
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
    this.pacchetto.pre_req_comp =  $('#summernote-actpkt-prereq-comp').summernote('code')

    //console.log("this.pacchetto.pre_req_comp", this.pacchetto.pre_req_comp)
    //console.log("this.pacchetto.valuatazione", this.pacchetto.valutazione)
    
    // trim dei campi e assegnazione scheda di valutazione
    this.pacchetto.trim()
    this.pacchetto.id_scheda_val = this.schedaValutazione.id_media;

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

    // Sostituisce &nbsp; con spazio
    this.pacchetto.replace_nbsp()

    console.log(this.pacchetto);
    
    // Codifica i caratteri speciali
    let encoded_pkt = this.pacchetto.encode()

    let serv = this.pktService.salvaPacchetto(encoded_pkt, php_script, db_proc, this.ambito)
    this.pktSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info(info_msg)
        // Aggiorna la lista dei pacchetti
        this.listaPacchetti.reloadPacchetti()
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


  /**
   * Apre la finestra modale per la selezione della scheda di valutazione
   */
  openModalScheda() {

    let serv = this.neuroAppService.listaMedia('', 'doc')
    this.pktSubscr = serv.subscribe (
        result => {
          result.map(item => {
            if (NeuroAppJS.DEVELOP_ENV )
              item.url_media = NeuroApp.G_URL_ROOT +  "/" + item.url_media
          })

          // Questa sara' la lista delle schede
          this.listaSchede = result

          // Apre la finestra modale
          $("#myFetch_scheda").modal('show');
          this.pktSubscr.unsubscribe()
          NeuroApp.hideWait()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
          this.pktSubscr.unsubscribe()
        }
    )
  } // openModalScheda()


  /**
   * Legge dal DB la scheda di valutazione con l'id specificato.
   * @param id_scheda id della scheda di valutazione
   */
  readSchedaForId(id_scheda: number) {
    let schedaSubscr : Subscription
    let serv = this.pktService.getSchedaValutazione(id_scheda)

    schedaSubscr = serv.subscribe (
      result => {
        schedaSubscr.unsubscribe()
        this.schedaValutazione.copy(result)
        RecordMedia.decode(this.schedaValutazione)
      },
      error => {
        schedaSubscr.unsubscribe()
      }
    )
  }

  /**
   * Chiude la finestra modale per la scelta della scheda di valutazione.
   */
  closeModalScheda() {
    $("#myFetch_scheda").modal('hide');
  }


  /**
   * Restituise l'icona da inserire per il documento secondo la sua estensione
   * @param url
   */
  docIcon(url) {
    if ( NeuroApp.icons[NeuroApp.fileExt(url)] == undefined )
      return NeuroApp.ROOT_ICONS + "/generic-doc-icon.png"
    else
      return NeuroApp.ROOT_ICONS + "/" + NeuroApp.icons[ NeuroApp.fileExt(url) ]
  }


  /**
  * Apre il documento specificato tramite url in una nuova finestra
  * @param url 
  */
  open(event:MouseEvent, scheda:RecordMedia) {
    event.stopPropagation()
    window.open(scheda.url_media)
  }

  

}
