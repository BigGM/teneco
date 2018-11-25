
import { Gruppo } from './classes/gruppo'


declare var bootbox:any;
declare var $:any;

declare var NeuroAppJS:any;

/**
 * Classe di utilita'. 
 * Espone  metodi e attributi statici.
 */
export class NeuroApp {
   
   // la ROOT del progetto e' definita nell'oggetto NeuroAppJS (source: assets/js/neuro-app.js)
   static G_URL_ROOT = NeuroAppJS.G_URL_ROOT;

   // la directory con le icone di progetto
   static ROOT_ICONS = "../../../assets/images"


   // Gruppi di esercizi (passivi, autonomi, etc.).
   // La lista viene caricata dal componente main (AppComponent.ts) richiamando
   // nel suo costruttore il metodo loadGruppi del servizio NeuroAppService
   static gruppi : Gruppo[]
   
   
   
   /**
    * Scrolla la pagina alla posizione dell'elemento specificato.
    */
   static scrollTo(id_element) {
      console.log("scrollTo ", id_element )
      
      let retries = 0
      
      let checkExist = setInterval( () => {
         ++retries
         let elem = $('#'+id_element).offset()
         if ( elem ) {
            clearInterval(checkExist)
            $('html,body').animate({
               scrollTop: elem.top
            },'slow')
         }
         else if (retries >= 10 ) {
            clearInterval(checkExist)
         }
      }, 200) // check every 200ms
   }



   /**
   * Popup per i messaggi di errore
   **/
   static custom_error (output_msg:string, title_msg:string) { 
      title_msg = title_msg.trim()
      if (!title_msg) 
         title_msg = 'Errore';
      bootbox.alert({  
         size: 'large', 
         title: '<H3 style="color:white;">'+title_msg+"</H3>", 
         message: '<h5><label class="alert alert-danger p-4" style="line-height:1.5em;width:100%;font-weight:normal;word-break:break-all;">'+output_msg+'</label></h5>',
         draggable:true,
         buttons : {
            ok: {
              className: "btn-info"
            }
         }
      })
   }


  /**
   * Una popup per i messaggi di successo
   **/
   static custom_success(output_msg:string) { 
      bootbox.alert({
         size: 'large', 
         title: '<H3 style="color:white;">Success</H3>', 
         message: '<h5><label class="alert alert-success p-4" style="line-height:1.5em;width:100%;font-weight:normal;word-break:break-all;">'+output_msg+'</label></h5>',
         draggable:true
      })
   }


   /**
   * Una popup per i messaggi di info
   **/
   static custom_info (output_msg:string) { 
      bootbox.alert({  
         size: 'large', 
         title: '<H3 style="color:white;">Info</H3>', 
         message: '<h5><label class="alert alert-info p-4" style="line-height:1.5em;width:100%;font-weight:normal;word-break:break-all;">'+output_msg+'</label></h5>',
         draggable:true,
         buttons : {
          ok: {
            className: "btn-info"
          }
       }
      }) 
   }


   /**
    * Estrae il testo plain da una stringa di testo che contiene tag html
    **/
   static html_to_plain (str_html:string) {
      var temp = document.createElement("div");
      temp.innerHTML = str_html;
      return temp.textContent || temp.innerText || "";
   }


  /**
  * Tronca la stringa in input ai primi max_chars caratteri aggiungendo 3 punti.
  * @param descr 
  * @param max_chars 
  */
  static truncString(descr:string, max_chars:number) {
    if (descr!=null && descr.length > max_chars-3) {
        return descr.substring(0,max_chars) + "...";
    } else {
        return descr;
    }
  }

  /**
   * Mostra l'immagine di loading ..
   */
  static showWait() {
    $('#waitDiv').show();
  }
   
  /**
   * Nasconde l'immagine di loading
   */
  static hideWait() {
    $('#waitDiv').hide();
  }


  static fileName(url:string) : string {
    let k = url.lastIndexOf("/")
    return decodeURI ( url.substring(k+1) )
  }
 
  static fileExt(url:string) :string {
    var k = url.lastIndexOf(".")
    return url.substring(k)
  }

  static trim_nbsp(s:string) : string {
      return s.replace(/^(&nbsp;)+|(&nbsp;)+$/gm,'');
  }


  /**
   * Questo serve a rimuovere eventuali popover aperte
   */
  static removePopover() {
      console.log("removePopover")
      $('.my-popover-glossario').remove()
      $('.my-popover-video').remove()
      $('.my-popover-audio').remove()
      $('.my-popover-image').remove()
   }


   /**
    * Elimina gli spazi bianchi laterali dalla stringa in input considerando
    * che la stringa puo' essere contenuta tra i tag <p>...</p>.
    * @param s 
    */
   static trimField (s:string) {
      if (s==null || s=="undefined" || s==="")
        return s;
  
      let start_s = "";
      let end_s   = "";
      
      if (s.startsWith("<p>" ) ) {
        start_s = "<p>"
          s = s.substring(3)
      }
      if (s.endsWith("</p>" ) ) {
        end_s = "</p>"
          s = s.substring(0,s.length-4)
      }
      // il metodo trim_nbsp() toglie gli spazi laterali scritti come "&nbsp;"
      s = NeuroApp.trim_nbsp(s)
  
      // rimette tutto insieme
      return (start_s + s + end_s).trim();
   }


   /**
    * Restituisce il nome del gruppo con l'id specificato
    */
   static nomeGruppo (id_gruppo:number) {
      //console.log("nome gruppo per l'id " + id_gruppo)
      if ( id_gruppo==-1 )
         return "";

      for (let j=0; j< this.gruppi.length; j++)
         if ( NeuroApp.gruppi[j].id == id_gruppo )
            return "(" + NeuroApp.gruppi[j].nome+ ")";
      return "(Nessun gruppo)";
   }
}
