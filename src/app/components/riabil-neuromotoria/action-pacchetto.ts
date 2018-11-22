
import { Subscription } from 'rxjs';
import { RecordPacchetto } from '../../classes/record-pacchetto'
import { NeuroApp } from '../../neuro-app';


// questo e' per jQuery
declare var $: any;


export class ActionPacchetto {

   readonly ambito = "1";
   pacchetto : RecordPacchetto
   pktSubscr : Subscription;

   constructor() {
   }


   init() {
      this.pacchetto = new RecordPacchetto()
      this.pacchetto.reset()
      this.pktSubscr = null
   }

   unsubscribe() {
      if (this.pktSubscr)
         this.pktSubscr.unsubscribe()
   }

   /**
    * Restituisce l'oggetto con le opzioni per la libreria summernote
    */
   getSummernoteOptions() : any {
      let URL_ROOT = NeuroApp.G_URL_ROOT + "/cgi-bin";
      return  {
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
      //console.log(this.pacchetto)
      
      // NB. il metodo reset() della form mette a null i campi del modello,
      // per questo motivo il metodo reset del pacchetto viene chiamato dopo.

      form.reset()
      this.pacchetto.reset()
      NeuroApp.removePopover()
   }
}

