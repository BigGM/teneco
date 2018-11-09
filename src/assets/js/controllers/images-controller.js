(function() {
    'use strict';
    
    var app = angular.module('neuroApp');
    
    // Aggiunge un servizio per le chiamate http
   app.service("imagesServices", function($http)
   {
   
      this.imageName = function(url) {
         console.log("imageName " + url);
         var k = url.lastIndexOf("/");
         return url.substring(k+1);
      }
   
      this.rimuoviImages = function(db_proc,image) {
         var nome = this.imageName(image.url);
         var url = G_URL_ROOT+"cgi-bin/rimuovi_media.php?proc="+db_proc+"&id_media="+image.id+"&nome_media="+nome+"&tipo_media=image";
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
   });
    
                       
                                                                                                  
    
    app.controller('imagesController', imagesController);
    function imagesController($scope, $http, FileUploader, serviceListNeuroApp, imagesServices)
    {
        var self = this;
        G_CTRL_IMAGE = this;
        
        var imageuploader = $scope.imageuploader = new FileUploader({
            url: G_URL_ROOT+'/cgi-bin/imagesupload.php'
        });
        console.log('ImagesController uploader creato **** ' );    
          
         // FILTERS          
         // a sync filter
         imageuploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
         });
       
         // an async filter
         imageuploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
         });
         
         imageuploader.filters.push({
            name: 'imagesFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
               //console.log("images-controller.js " + item.type);
               //var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
               //console.log("images-controller.js type " + type);
               //return '|jpeg|jpg|png|gif|'.indexOf(type) !== -1;
               return true;               
            }
         });
    
         // CALLBACKS     
         imageuploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
         };
         imageuploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
         };
         imageuploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
         };
         imageuploader.onBeforeUploadItem = function(item) {
            item.formData.push({imagesdesc: item.formData['imagesdesc']});				 		
            console.info('onBeforeUploadItem', item);
         };
         imageuploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
            $('#images-progress-bar').css('opacity', 1);
         };
         imageuploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
         };
         imageuploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
         };
         imageuploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);

            if ( response.startsWith('Exception') ) {
               custom_error(response,'Errore');
            }            
         };
         imageuploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
         };
         imageuploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);            

            if ( response.startsWith('Exception') ) {
               custom_error(response,'Errore');
            }
            else {
               custom_info("File di immagine inserito nel sistema");
            }
         };
         imageuploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $('#images-progress-bar').animate({'opacity':0}, 1000);
            // Aggiorna la lista dei file delle immagini e automaticamente aggiorna la pagina
            self.listaImages();
         };
         console.info('** imageuploader **', imageuploader);
         

      this.lista_images = [];
      
      this.confermaCancellaImages = function (image)
      {     
            var msg= "<h5>Conferma rimozione del file immagine <label style='color:rgb(180,0,0)'>"+this.imageName(image.url)+"</label>?</h5>";
            if ( image.usato == 1) {
               msg =  "<h5><b>L'immagine viene utilizzata in uno o pi&ugrave; esercizi. </b><br> " + msg;
            }
            
            bootbox.dialog (
            {
               title: "<h4>Cancella Immagine</h4>", 
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
                       self.cancellaImages(image);
                    } // end callback
                 } // end Rimuovi
               } // end buttons
            }); // bootbox.dialog
      } // this.confermaCancellaImages
         
     
      this.cancellaImages = function (image) {
         $('#waitDiv').show();         
         alert(image.url)        
         imagesServices.rimuoviImages('NeuroApp.rimuovi_media',image)
         .then (
            function successCallback(response) {
               console.log("successCallback ==>"  + response);
               $('#waitDiv').hide();
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  custom_info('Immagine cancellata');
                  // Aggiorna la lista dei file delle immagini e automaticamente aggiorna la pagina
                  self.listaImages();
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
      } // this.cancellaImages()
      
      this.listaImages = function() {
         self.lista_images = [];
         $('#waitDiv').show();
         var lista_id='';
         var tipo_media='image';				
         serviceListNeuroApp.listaMedia(lista_id, tipo_media)
         .then (
             function successCallback(response) {
                $('#waitDiv').hide();
                console.log(response.data);
                for (var j=0; j<response.data.length; j++) {
                   var item = response.data[j];
                   self.lista_images.push( {id:item.id_media, url:item.url_media, descr:item.descr_media, usato:item.usato_media} );
                }
                console.log(self.lista_images);
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
      } // this.listaImages
      //this.listaImages();
      
      /**Nome immagine dalla url in input **/
      this.imageName = function(url) {
         return imagesServices.imageName(url);
      }
      
    } // imagesController
})();