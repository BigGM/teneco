var NeuroApp = {

  G_URL_ROOT : "http://localhost:8080/",

    
  /**
  * Popup per i messaggi di errore
  **/
  custom_error : function(output_msg, title_msg) { 
    if (!title_msg) 
      title_msg = 'Error'; 
    bootbox.alert({  
      size: 'large', 
      title: '<H3 style="color:white;">'+title_msg+"</H3>", 
      message: '<h4><label class="alert alert-danger" style="width:100%;font-weight:normal;">'+output_msg+'</label></h4>',
      draggable:true
    })
  }, // function custom_error(output_msg, title_msg) 

    
  /**
   * Una popup per i messaggi di successo
   **/
  custom_success : function (output_msg) { 
    bootbox.alert({  
      size: 'medium', 
      title: '<H3 style="color:white;">Success</H3>', 
      message: '<h4><label class="alert alert-success" style="width:100%;font-weight:normal;">'+output_msg+'</label></h4>',
      draggable:true
    });
  }, // function custom_success(output_msg)

  /**
   * Una popup per i messaggi di info
   **/
  custom_info : function(output_msg) { 
    bootbox.alert({  
      size: 'medium', 
      title: '<H3 style="color:white;">Info</H3>', 
      message: '<h4><label class="alert alert-info" style="width:100%;font-weight:normal;">'+output_msg+'</label></h4>',
      draggable:true,
    }); 
  }, // function custom_info(output_msg)

  /**
   * Estrae il testo plain da una stringa di testo che contiene tag html
   **/
  html_to_plain: function(str_html) {
    var temp = document.createElement("div");
    temp.innerHTML = str_html;
    return temp.textContent || temp.innerText || "";
  },

  truncString : function(descr,max_chars) {
    if (descr!=null && descr.length > max_chars-3) {
       return descr.substring(0,max_chars) + "...";
    } else {
       return descr;
    }
  }
}






/**
 * Apre l'immagine di un esercizio su una finestra modale
 **/
function openImageEsercizio(title,url) {
   $("#myModalImg .modal-title").html(title);
   $("#myModalImg").modal();
   var img = document.getElementById("img-exercice");
   img.src = url;
}

/**
 * Attiva la riproduzione del video su una finestra modale
 **/
function playVideo(title,url) {
   $("#myModalVideo .modal-title").html(title);
   $("#myModalVideo").modal();
   var video = document.getElementById("video-play");
   video.src = url;
   video.currentTime = 0;
   video.play();
}

/**
 * Ferma il video in esecuzione sulla pagina di dettaglio esercizio
 * NB. Ci puo' essere un solo video in esecuzione
 */ 
function stopVideo() {
   var video = document.getElementById("video-play");
   if (video.currentTime >0) {
      video.pause();
      video.currentTime = 0;
   }
   
   
}

/**
 * Ferma i video in esecuzione sulla pagina di aggiunta video.
 * NB. Ci possono essere piu' video in esecuzione
 */
function stopAllVideos() {
   var videos = document.getElementsByTagName('video');
   for(var i=0; i<videos.length; i++) {
      if ( videos[i].currentTime > 0) {
         videos[i].pause();
         videos[i].currentTime=0;
      }
   }
}

/**
 * Ferma tutti i file audio in esecuzione.
 * NB. possono esserci piu' file audio in esecuzione.
 */
function stopAllAudio() {
   var sounds = document.getElementsByTagName('audio');
   for(var i=0; i<sounds.length; i++) {
      if ( sounds[i].currentTime > 0) {
         sounds[i].pause();
         sounds[i].currentTime=0;
      }
   }
}


var bridge = {
   /**
    * Per cancellare un elemento multimediale di un esercizio
    **/
   cancellaMedia: function(id_media) {
      console.log(G_CTRL_PKG);
      //angular.element(document.getElementById('div_pkg_controller')).controller().confermaCancellaMedia(id_media);
      G_CTRL_PKG.confermaCancellaMedia(id_media);
   }
};


/**
 * Legge dal DB il nome e la definizione della voce di glossario con l'id_voce
 * specificato e le mostra come tooltipo sul link '_anchor_'.
 */
var popovers = [];
function loadDefGlossario(_anchor_, id_voce) {
   console.log('loadDefGlossario');
   console.log(_anchor_);
   
   // popover gia' creato per l'ancora: basta visualizzarlo
   /*if (_anchor_ in popovers) {
      console.log('_anchor_ in popovers');
      $(_anchor_).popover('toggle');
      return;
   }*/

   $.get( G_URL_ROOT + "/cgi-bin/def_glossario.php?proc=NeuroApp.def_glossario&id_voce="+id_voce)
   .done(function(data) { 
      this_content = data;
      //console.log(this_content);
      $(_anchor_).popover({content:this_content, html:true, placement: "auto", animation:true});
      
      if ( !(_anchor_ in popovers) ) {
         popovers[_anchor_] = 1;
         $(_anchor_).trigger('click');
      }
   })
   .fail(function(error) {
      alert( error );
   })
};