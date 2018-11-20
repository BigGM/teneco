
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiabilNeuromotoriaService, RecordPacchetto} from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { NeuroApp } from '../../../neuro-app';

import { ListaPacchettiComponent } from '../lista-pacchetti/lista-pacchetti.component';

// questo e' per jQuery
declare var $: any;

@Component({
  selector: 'app-new-pacchetto',
  templateUrl: './new-pacchetto.component.html',
  styleUrls: ['./new-pacchetto.component.css']
})
export class NewPacchettoComponent implements OnInit, OnDestroy {

  readonly ambito = "1";

  pacchetto : RecordPacchetto
  pktSubscr : Subscription;
  @Input() listaPacchetti: ListaPacchettiComponent;

  constructor(private pktService : RiabilNeuromotoriaService) {
  }

  ngOnInit() {
    this.pacchetto = new RecordPacchetto()
    this.pacchetto.reset()
    this.pktSubscr = null
    this.initSummernote()
  }

  ngOnDestroy() {
    console.log( "NewPacchettoComponent => onDestroy" )
    if (this.pktSubscr)
      this.pktSubscr.unsubscribe()
  
    // Cancella i codice html creato da summernote
    $('#summernote-newpkt-descr').summernote('destroy')
    $('#summernote-newpkt-prereq').summernote('destroy')
  }


  /**
   * Inizializza i campi di testo ricoperti dalla libreria summernote
   */
  initSummernote() {
    let URL_ROOT = NeuroApp.G_URL_ROOT + "/cgi-bin";

    let note_options = {
      lang: "it-IT",
      height: "110px",
      minHeight: "110px",
      maxHeight: "110px",
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
            /*['color', ['color']],*/
            ['font', ['bold', 'italic', 'underline', 'clear']],
            /*['fontsize', ['fontsize']],
            ['fontname', ['fontname']],*/
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
    
    // imposta la descrizione come campo obbligatorio (serve per cambiare lo stile del campo di testo)
    note_options.required = true
    $('#summernote-newpkt-descr').summernote(note_options)

    // questo non e' obbligatorio
    note_options.required = false
    $('#summernote-newpkt-prereq').summernote(note_options)


  } // initSummernote()



  /**
   * Controlla se il campo in input e' vuoto, se e' così restituisce una stringa
   * formattata da presentare nel messaggio di errore; se e' valorizzata ritorna
   * una stringa vuota.
   * 
   * @param field_name nome del campo
   * @param field_value valore definito nell'interfaccia
   */
  private checkMandatory(field_name:string, field_value:string) : string {
    //console.log (field_name, field_value)
    if ( field_value==null || field_value=="undefined" || field_value==="" || field_value=="<p><br></p>") {
      return `<b>${field_name}</b><br>`
    }
    return ""
  }


  /**
   * Salva su db la nuova voce di glossario inserita via form
   * @param form 
   */
  salvaPacchetto(form) {
    console.log("NewPacchettoComponent.salvaPacchetto")

    // Rimuove popover che puo' essere stato aperto
    this.removePopover()
    
    //console.log(form.value)
    this.pacchetto.descr = $('#summernote-newpkt-descr').summernote('code')
    this.pacchetto.pre_req =  $('#summernote-newpkt-prereq').summernote('code')
    
    // trim dei campi
    this.pacchetto.trim()

    //console.log(this.pacchetto)

    // e controllo dei campi obbligatori
    let fields_empty = "";
    fields_empty += this.checkMandatory("Nome",this.pacchetto.nome)
    fields_empty += this.checkMandatory("Descrizione",this.pacchetto.descr)

    // Manca qualche campo => messaggio di errore ed esce
    if (fields_empty.length > 0 ) {
      NeuroApp.custom_error("Uno o pi&ugrave; campi obbligatori sono vuoti:<br> "+fields_empty,"Errore")
      return
    }

    //return;
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
  }

  /**
   * Ripulisce i campi della form
   * @param form 
   */
  reset(form) {
      console.log(form)
      this.pacchetto.reset()
      form.reset()
      this.removePopover()
      $('#summernote-newpkt-descr').summernote('reset')
      $('#summernote-newpkt-prereq').summernote('reset')
  }


  /**
   * Questo serve a rimuovere una eventuale popover aperta
   */
  private removePopover() {
    console.log("removePopover")
    $('.my-popover-glossario').remove()
    $('.my-popover-video').remove()
    $('.my-popover-audio').remove()
    $('.my-popover-image').remove()
  }
  
}
