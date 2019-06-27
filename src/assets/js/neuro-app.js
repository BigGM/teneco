
var NeuroAppJS = {

  //G_URL_ROOT : "http://5.158.168.233:51000/",       // visibile dall'esterno
  //G_URL_ROOT : "http://5.158.168.233:47000/",       // visibile dall'esterno
  G_URL_ROOT : "http://192.168.2.63:47000/",          // ambiente di sviluppo su cristal
  //G_URL_ROOT : "http://localhost:8080/apache2/",    // per il sito interno su chiavetta usb


  // Cosi' dovrebbe funzionare per tutti i casi poiche' window.location.origin conterra'
  // l'indirizzo digitato sul browser cioe' uno di quelli scritti sopra
  //G_URL_ROOT : window.location.origin,
  
  DEVELOP_ENV : true,      // true: sono in ambiente locale di sviluppo

  /* Flag per Mostrare/Nascondere la label del debug. Il valore viene
   * cambiato cliccando sull'immagine a sinistra nella barra del menu.
   */
  DEBUG : false,


  /**
   * Controlla se l'ambiente di esecuzione del sito e' un device mobile
   */
  isMobileDevice: function() {
   return   navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) || 
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
  }, 
  
   /**
   * Attiva il full screen, usa la libreria fullscreen.js nella directory assets
   **/
   fullscreen: function() {
      if (screenfull.enabled) {
         screenfull.request();
         return true;
      }
      return false;
   },
   
   fullscreenExit: function() {
      screenfull.exit();
   },
  
   /**
    * Controlla periodicamente la connessione col server
    */
   checkServerConnection: function() {
      $.ajax({
        type: "HEAD",
        cache: false,
        async: true,
        timeout: 20000,
        // il valore appeso allo script php serve a fare in modo che il browser non utilizzi la cache
        url: NeuroAppJS.G_URL_ROOT + "/cgi-bin/internet_conn.php?rand=" + Math.round(Math.random() * 100000),
        //url: "script/internet_conn.php?rand=" + Math.round(Math.random() * 100000),
      })
      .done(function(message) {
         NeuroAppJS.showAlertConnection('hide');
      })
      .fail(function(message) {
         NeuroAppJS.showAlertConnection('show');
      })
   },
   
   
   /**
    * Mostra il messaggio di connesione persa o lo nasconde quando la connessione e' di nuovo funzionante.
    **/
   showAlertConnection: function (value) {
     var opacity = $('#div-lost-internet').css('opacity');
     
     if (value=='show' && opacity==0) {
        $('#div-lost-internet').animate( {'top': '+=380px', 'opacity':1}, 350);
        $('#waitDiv').hide();
     }
     else if (value=='hide' && opacity==1)
        $('#div-lost-internet').animate( {'top': '-=380px', 'opacity':0}, 350);
   } ,
  


  /**
   * Popup per i messaggi di errore
   **/
   custom_error: function(output_msg, title_msg) { 
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
   custom_success: function (output_msg) { 
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
   custom_info: function(output_msg) { 
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

  
   /**
    * Tronca la stringa 's' a 'max_chars' caratteri e aggiunge tre puntini alla fine.
    */
   truncString: function(s,max_chars) {
      if (s!=null && s.length > max_chars-3) {
         return s.substring(0,max_chars) + "...";
      } else {
         return s;
      }
   },

   /**
    * Validazione formale di un indirizzo di email.
    * @param {*} email - la stringa dell'indirizzo di posta.
    * @returns boolean
    */
   validateEmail: function (email) {
      return ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) )
   },
   
   
   /**
    * Scrolla la pagina alla posizione dell'elemento specificato.
    */
   scrollTo: function(id) {
      $('html,body').animate({
         scrollTop: $('#'+id).offset().top
      },'slow');
   },



   /*======================================================================================================
    * Il gruppo di funzioni che seguono vengono usate assieme alla libreria summernote modificata per 
    * creare finestre di popup informative cliccando su particolari parole marcate durante la fase di
    * inserimento del testo. Le finestre di popup includono:
    * 1 - Descrizione di una voce di glossario,
    * 2 - Visualizzazione di un video,
    * 3 - Apertura di un file audio,
    * 4 - Visualizzazione di una immagine.
    * =====================================================================================================*/

   /**
    * Chiude (hide) il popover specificato
    * @param {*} id_popover 
    */
   closePopover: function(id_popover)  {
      //console.log("closePopover", id_popover)
      $(NeuroAppJS.gloss_anchor[id_popover]).popover('hide');
      $(NeuroAppJS.video_anchor[id_popover]).popover('hide');
      $(NeuroAppJS.audio_anchor[id_popover]).popover('hide');
      $(NeuroAppJS.image_anchor[id_popover]).popover('hide');
   },
  
  
   /**
    * Legge dal DB il nome e la definizione della voce di glossario corrispondente 
    * all'id_voce specificato e costruisce un popover sul link _anchor_.
    */
   gloss_popovers  : [],
   gloss_anchor : [],
   loadDefGlossario: function (_anchor_, id_voce) {
      //console.log('loadDefGlossario');
      var id_anchor = $(_anchor_).attr("id") 
      console.log( id_anchor )

      $.get( NeuroAppJS.G_URL_ROOT + "/cgi-bin/def_glossario2.php?proc=NeuroApp.def_glossario&id_voce="+id_voce)
      .done(function(data) {
      
         data = JSON.parse(data)
         //console.log( data );
         
         if ( data.voce==="exception" ) 
            return;

         id_popover = "this-popover-glossario-"+ Date.now()

         close_btn =
            "<button type='button' class='close' aria-label='Close' style='margin-top:5px'" +
            "onclick=\"NeuroAppJS.closePopover('"+id_popover+"')\">" +
            "<span aria-hidden='true'>&times;</span></button>";

         this_content =
            "<div class='voce-glossario'><i>" + data.voce + ":</i>" + close_btn + "</div>" +
            "<div class='descr-glossario' style='max-height:360px;overflow-y:auto'>" + data.descr + "</div>";

         $(_anchor_).popover({
            //container: '#'+id_anchor, 
            content: this_content,
            boundary : 'window',
            placement: "bottom", 
            html: true,
            animation: true, 
            trigger: 'click',
            template: '<div class="popover my-popover-glossario" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body my-popover-body"></div></div>'
         })

         NeuroAppJS.gloss_anchor [id_popover] = _anchor_

         if ( !(_anchor_ in NeuroAppJS.gloss_popovers) ) {
            NeuroAppJS.gloss_popovers[_anchor_] = 1
            $(_anchor_).trigger('click')
         }
      })
      .fail(function(error) {
         alert( error );
      })  
   }, // loadDefGlossario()
   
   
   video_popovers : [],
   video_anchor : [],
   prepareVideoPopover: function (_anchor_, url_video, descr_video) { 
      console.log('prepareVideoPopover');
      //console.log(_anchor_);

      if  ( NeuroAppJS.DEVELOP_ENV )
         url_video = NeuroAppJS.G_URL_ROOT + "/" +  url_video;
      
      id_popover = "this-popover-video-"+ Date.now()

      close_btn =
            "<button type='button' class='close' aria-label='Close' style='margin: -6px -18px;' " +
            "onclick=\"NeuroAppJS.closePopover('"+id_popover+"')\">" +
            "<span aria-hidden='true'>&times;</span></button>";

      this_content = 
         "<div class='voce-video'><video style='width:100%' controls> <source src='"+url_video+"'></video></div>"+
         "<div class='popover-video-descr'>"+NeuroAppJS.html_to_plain(descr_video)+close_btn+"</div>";
   
      $(_anchor_).popover({
         //container: 'body', 
         content: this_content, 
         boundary : 'window',
         placement: "bottom", 
         html:true, 
         animation: true, 
         trigger: 'click',
         template: '<div class="popover my-popover-video" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body my-popover-body"></div></div>'
      });
      
      NeuroAppJS.video_anchor [id_popover] = _anchor_

      if ( !(_anchor_ in NeuroAppJS.video_popovers) ) {
         NeuroAppJS.video_popovers[_anchor_] = 1;
         $(_anchor_).trigger('click');
      }   
   }, // prepareVideoPopover()
   
   
   audio_popovers : [],
   audio_anchor : [],
   prepareAudioPopover: function (_anchor_, url_audio, descr_audio) { 
      console.log('prepareAudioPopover');
      //console.log(_anchor_);

      if ( NeuroAppJS.DEVELOP_ENV )
         url_audio = NeuroAppJS.G_URL_ROOT + "/" +  url_audio;

      id_popover = "this-popover-audio-"+ Date.now()

      close_btn =
            "<button type='button' class='close' aria-label='Close' style='margin: -6px -18px;' " +
            "onclick=\"NeuroAppJS.closePopover('"+id_popover+"')\">" +
            "<span aria-hidden='true'>&times;</span></button>";
      
      this_content = 
         //"<label class='voce-audio'><i>Audio:</i></label><br>" +
         "<div class='voce-audio'><audio style='width:100%' controls> <source src='"+url_audio+"'></audio></div>"+
         "<div class='popover-audio-descr'>"+NeuroAppJS.html_to_plain(descr_audio)+close_btn+"</div>";
   
      $(_anchor_).popover({
         //container: 'body', 
         content: this_content, 
         boundary : 'window',
         placement: "bottom", 
         html: true, 
         animation: true, 
         trigger: 'click',
         template: '<div class="popover my-popover-audio" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body my-popover-body"></div></div>'
      });
      
      NeuroAppJS.audio_anchor [id_popover] = _anchor_

      if ( !(_anchor_ in NeuroAppJS.audio_popovers) ) {
         NeuroAppJS.audio_popovers[_anchor_] = 1;
         $(_anchor_).trigger('click');
      }   
   }, // prepareAudioPopover()
   

   image_popovers : [],
   image_anchor : [],
   prepareImagePopover: function (_anchor_, url_image, descr_image) { 
      //console.log('prepareIMagePopover');
      //console.log(_anchor_);

      //let id = $(_anchor_).attr('aria-describedby')
      //console.log(id);

      if ( NeuroAppJS.DEVELOP_ENV )
         url_image = NeuroAppJS.G_URL_ROOT + "/" +  url_image;

      id_popover = "this-popover-image-"+ Date.now()

      close_btn =
            "<button type='button' class='close' aria-label='Close' style='margin: -6px -18px;' " +
            "onclick=\"NeuroAppJS.closePopover('"+id_popover+"')\">" +
            "<span aria-hidden='true'>&times;</span></button>";
   
      this_content = 
         "<div class='voce-image'><img src='"+url_image+"' class='img-fluid'></div>"+
         "<div class='popover-image-descr'>"+NeuroAppJS.html_to_plain(descr_image)+close_btn+"</div>";
   
      $(_anchor_).popover({
         //container: 'body', 
         content :this_content, 
         boundary : 'window',
         placement: "bottom",
         html: true, 
         animation: true, 
         trigger: 'click',
         template: '<div class="popover my-popover-image" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body my-popover-body"></div></div>'
      });

      NeuroAppJS.image_anchor [id_popover] = _anchor_

      if ( !(_anchor_ in NeuroAppJS.image_popovers) ) {
         NeuroAppJS.image_popovers[_anchor_] = 1;
         $(_anchor_).trigger('click');
      }   
   }, // prepareImagePopover()

} // var NeuroApp
