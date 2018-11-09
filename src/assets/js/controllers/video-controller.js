(function() {
   'use strict';
    
   var app = angular.module('neuroApp');
    
   // Aggiunge un servizio per le chiamate http
   app.service("videoServices", function($http)
   {
      this.docName = function(url) {
         //console.log("doc icon " + url);
         var k = url.lastIndexOf("/");
         return url.substring(k+1);
      }
      
      this.rimuoviVideo = function(db_proc, video) {
         var nome = this.docName(video.url);
         var url = G_URL_ROOT+"cgi-bin/rimuovi_media.php?proc="+db_proc+"&id_media="+video.id+"&nome_media="+nome+"&tipo_media=video";
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
   });
    
     
   app.controller('videoController', videoController);
   function videoController($scope, $http, FileUploader, serviceListNeuroApp, videoServices)
   {
      var self = this;
      
      // Assegna questa istanza del controller alla variabile globale
      G_CTRL_VIDEO = this;
        
      var video_uploader = $scope.video_uploader = new FileUploader({
         url: G_URL_ROOT+'/cgi-bin/videoupload.php'
      });
      //console.log('VideoController uploader creato **** ' );    
          
      // FILTERS          
      // a sync filter
      video_uploader.filters.push({
         name: 'syncFilter',
         fn: function(item /*{File|FileLikeObject}*/, options) {
             console.log('syncFilter');
             return this.queue.length < 10;
         }
      });
       
      // an async filter
      video_uploader.filters.push({
         name: 'asyncFilter',
         fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
             console.log('asyncFilter');
             setTimeout(deferred.resolve, 1e3);
         }
      });
         
      video_uploader.filters.push({
         name: 'videoFilter',
         fn: function (item /*{File|FileLikeObject}*/, options) {
            /*console.log("video-controller.js " + item.type);
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            console.log("video-controller.js type " + type);
            return '|flv|avi|mp4|mpg'.indexOf(type) !== -1;*/
            return true;
         }
      });
    
      // CALLBACKS     
      video_uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
         //console.info('onWhenAddingFileFailed', item, filter, options);
      };
      video_uploader.onAfterAddingFile = function(fileItem) {
         //console.info('onAfterAddingFile', fileItem);
      };
      video_uploader.onAfterAddingAll = function(addedFileItems) {
         //console.info('onAfterAddingAll', addedFileItems);
      };
      video_uploader.onBeforeUploadItem = function(item) {
         item.formData.push({videodesc: item.formData['videodesc']});				 		
         //console.info('onBeforeUploadItem', item);
      };
      video_uploader.onProgressItem = function(fileItem, progress) {
         //console.info('onProgressItem', fileItem, progress);
         $('#video-progress-bar').css('opacity', 1);
      };
      video_uploader.onProgressAll = function(progress) {
         //console.info('onProgressAll', progress);
      };
      video_uploader.onSuccessItem = function(fileItem, response, status, headers) {
         //console.info('onSuccessItem', fileItem, response, status, headers);
      };
      video_uploader.onErrorItem = function(fileItem, response, status, headers) {
         //console.info('onErrorItem', fileItem, response, status, headers);
         if ( response.startsWith('Exception') ) {
            custom_error(response,'Errore');
         }            
      };
      video_uploader.onCancelItem = function(fileItem, response, status, headers) {
         //console.info('onCancelItem', fileItem, response, status, headers);
      };
      video_uploader.onCompleteItem = function(fileItem, response, status, headers) {
         //console.info('onCompleteItem', fileItem, response, status, headers);            
         if ( response.startsWith('Exception') ) {
            custom_error(response,'Errore');
         }
         else {
            custom_info("File video inserito nel sistema");
         }
      };
      video_uploader.onCompleteAll = function() {
         //console.info('onCompleteAll');
         $('#video-progress-bar').animate({'opacity':0}, 1000);
         self.listaVideo();
      };
      //console.info('** uploader **', video_uploader);


      /**
       * Apre la finestra di dialogo per confermare la cancellazione del video, e se accettata, procede alla rimozione
       * video - l'oggetto video da cancellare:
       *         id, url, descr, usato
       **/
      this.confermaCancellaVideo = function (video)
      {
         var msg= "<h5>Conferma rimozione del file video <label style='color:rgb(180,0,0)'>"+video.descr+"</label>?</h5>";
         if ( video.usato == 1) {
            msg =  "<h5><b>Il video viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg;
         }
         
         bootbox.dialog (
         {
            title: "<h4>Cancella Video</h4>", 
            message: msg,
            draggable:true,
            buttons:
            {
              "Annulla":{
                 className: "btn-default btn-md"
              }, 
              "Rimuovi" : { 
                 className: "btn-danger btn-md",
                 callback: function() {
                    self.cancellaVideo(video);
                 } // end callback
              } // end Rimuovi
            } // end buttons
         }); // bootbox.dialog
      } // this.confermaCancellaVideo
         
      this.cancellaVideo = function (video) {
         //alert(p_VideoIdCanc)
         $('#waitDiv').show();         
                 
         videoServices.rimuoviVideo('NeuroApp.rimuovi_media',video)
         .then (
            function successCallback(response) {
               //console.log("successCallback ==>"  + response);
               $('#waitDiv').hide();
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  custom_info('Video cancellato');
                  // Aggiorna la lista dei file video e automaticamente aggiorna la pagina
                  self.listaVideo();
               }
            },
            function errorCallback(response) {
               $('#waitDiv').hide();
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.cancellaVideo()
      
      
      
      // lista dei video presenti sul sistema
      this.lista_video = [];

      
      /**
       * Legge dal DB la lista dei video disponibili sul sistema.
       * La lista viene inserita sull'array this.lista_video
       **/      
      this.listaVideo = function() {
         self.lista_video = [];
         $('#waitDiv').show();
         var lista_id   = '';
         var tipo_media = 'video';		
         serviceListNeuroApp.listaMedia(lista_id, tipo_media)
         .then (
             function successCallback(response) {
                $('#waitDiv').hide();
                //console.log(response.data);
                for (var j=0; j<response.data.length; j++) {
                   var item = response.data[j];
                   self.lista_video.push( { id   : item.id_media,
                                            url  : item.url_media,
                                            descr: item.descr_media,
                                            usato: item.usato_media
                                          });
                }
                console.log(self.lista_video);
             },
             function errorCallback(response) {
                $('#waitDiv').hide();
                if ( angular.isString(response.data) ) {
                   custom_error(response.data,'Errore');
                } else {
                   custom_error("Server error",'Errore');
                }
             }
         );
      }
      // caricamento iniziale
      //self.listaVideo();

   } // videoController
	
})();