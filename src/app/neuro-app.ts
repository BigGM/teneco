
declare var bootbox:any;
declare var $:any;

/**
 * Classe di utilita'. 
 * Espone  metodi e attributi statici.
 */
export class NeuroApp {
   
   static G_URL_ROOT = "http://localhost:8080/"

   /**
   * Popup per i messaggi di errore
   **/
   static custom_error (output_msg:string, title_msg:string) { 
      title_msg = title_msg.trim()
      if (!title_msg) 
         title_msg = 'Error';
      bootbox.alert({  
         size: 'large', 
         title: '<H3 style="color:white;">'+title_msg+"</H3>", 
         message: '<h5><label class="alert alert-danger p-4" style="width:100%;font-weight:normal;">'+output_msg+'</label></h5>',
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
         message: '<h5><label class="alert alert-success p-4" style="width:100%;font-weight:normal;">'+output_msg+'</label></h5>',
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
         message: '<h5><label class="alert alert-info p-4" style="width:100%;font-weight:normal;">'+output_msg+'</label></h5>',
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
}
