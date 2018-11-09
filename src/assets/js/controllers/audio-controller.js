(function() {
    'use strict';
    
    var app = angular.module('neuroApp');
    
    // Aggiunge un servizio per le chiamate http
   app.service("audioServices", function($http)
   {

      this.audioName = function(url) {
         console.log("audioName " + url);
         var k = url.lastIndexOf("/");
         return url.substring(k+1);
      }
   
      this.rimuoviAudio = function(db_proc, audio) {
         var nome = this.audioName(audio.url);
         var url = G_URL_ROOT+"cgi-bin/rimuovi_media.php?proc="+db_proc+"&id_media="+audio.id+"&nome_media="+nome+"&tipo_media=audio";         
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
   });
    
   //var desc_video="";
   //app.controller('AudioController', ['$scope', 'FileUploader', function($scope, FileUploader) {
    
    app.controller('audioController', audioController);
    function audioController($scope, $http, FileUploader, serviceListNeuroApp, audioServices)
    {
        var self = this;
        G_CTRL_AUDIO = this;
        
        var audiouploader = $scope.audiouploader = new FileUploader({
            url: G_URL_ROOT+'/cgi-bin/audioupload.php'
        });
        console.log('AudioController uploader creato **** ' );    
          
         // FILTERS          
         // a sync filter
         audiouploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
         });
       
         // an async filter
         audiouploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
         });
         
         audiouploader.filters.push({
            name: 'audioFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
               //console.log("audio-controller.js " + item.type);
               //var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
               //console.log("audio-controller.js type " + type);
               //return '|mpeg|mp3|wav|aiff|'.indexOf(type) !== -1;
               return true;
            }
         });
    
         // CALLBACKS     
         audiouploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
         };
         audiouploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
         };
         audiouploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
         };
         audiouploader.onBeforeUploadItem = function(item) {
            item.formData.push({audiodesc: item.formData['audiodesc']});				 		
            console.info('onBeforeUploadItem', item);
         };
         audiouploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
            $('#audio-progress-bar').css('opacity', 1);
         };
         audiouploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
         };
         audiouploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
         };
         audiouploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);

            if ( response.startsWith('Exception') ) {
               custom_error(response,'Errore');
            }            
         };
         audiouploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
         };
         audiouploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);            
 
            if ( response.startsWith('Exception') ) {
               custom_error(response,'Errore');
            }
            else {
               custom_info("File audio inserito nel sistema");
            }
         };
         audiouploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $('#audio-progress-bar').animate({'opacity':0}, 1000);
            // Aggiorna la lista dei file audio e automaticamente aggiorna la pagina
            self.listaAudio();
         };
         console.info('** audiouploader **', audiouploader);
         

      this.lista_audio = [];
      
      this.confermaCancellaAudio = function (audio)                                               
      {                 
            var msg= "<h5>Conferma rimozione del file audio <label style='color:rgb(180,0,0)'>"+this.audioName(audio.url)+"</label>?</h5>";
            if ( audio.usato == 1) {
               msg =  "<h5><b>L'audio viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg;
            }
            
            bootbox.dialog (                    
            {
               title: "<h4>Cancella Audio</h4>", 
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
                       self.cancellaAudio(audio);
                    } // end callback
                 } // end Rimuovi
               } // end buttons
            }); // bootbox.dialog
      } // this.confermaCancellaAudio
         
     
      this.cancellaAudio = function (audio) {
         $('#waitDiv').show();         
                 
         audioServices.rimuoviAudio('NeuroApp.rimuovi_media',audio)
         .then (
            function successCallback(response) {
               console.log("successCallback ==>"  + response);
               $('#waitDiv').hide();
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  custom_info('Audio cancellato');
                  // Aggiorna la lista dei file audio e automaticamente aggiorna la pagina
                  self.listaAudio();
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
      } // this.cancellaAudio()
      
      this.listaAudio = function() {
         self.lista_audio = [];
         $('#waitDiv').show();
         var lista_id='';
         var tipo_media='audio';				
         serviceListNeuroApp.listaMedia(lista_id, tipo_media)
         .then (
             function successCallback(response) {
                $('#waitDiv').hide();
                console.log(response.data);
                for (var j=0; j<response.data.length; j++) {
                   var item = response.data[j];
                   self.lista_audio.push( {id:item.id_media, url:item.url_media, descr:item.descr_media, usato:item.usato_media} );
                }
                console.log(self.lista_audio);
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
      } // this.listaAudio
      //this.listaAudio();    
      
      /**Nome immagine dalla url in input **/
      this.audioName = function(url) {
         return audioServices.audioName(url);
      }
      
    } // audioController   
})();