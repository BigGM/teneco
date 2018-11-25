
import { Subscription } from 'rxjs';
import { RecordEsercizio } from '../../classes/record-esercizio'
import { NeuroApp } from '../../neuro-app';
import { Gruppo } from '../../classes/gruppo'
import { NeuroAppService } from '../../services/neuro-app.service'


// questo e' per jQuery
declare var $: any;

export class ActionEsercizio {

	esercizio : RecordEsercizio
	gruppi    : Array<Gruppo>
   exSubscr  : Subscription;
   neuroService : NeuroAppService


   constructor(neuroService: NeuroAppService) {
      this.neuroService = neuroService
		this.esercizio = new RecordEsercizio()
    	this.gruppi = Array<Gruppo>()
   }


   init() {
      this.esercizio = new RecordEsercizio
      this.esercizio.reset()
      this.exSubscr = null
   }

   unsubscribe() {
      if (this.exSubscr)
         this.exSubscr.unsubscribe()
   }

   /**
    * Restituisce l'oggetto con le opzioni per la libreria summernote
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
    * Ripulisce i campi della form e il modello this.pacchetto.
    * @param form 
    */
   reset(form) {
      //console.log(this.esercizio)

      // NB. il metodo reset() della form mette a null i campi del modello,
      // per questo motivo il metodo reset del pacchetto viene chiamato dopo.
      form.reset()
      this.esercizio.reset()
      NeuroApp.removePopover()
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

