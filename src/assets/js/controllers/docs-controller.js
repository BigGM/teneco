(function() {
   'use strict';
    
   var app = angular.module('neuroApp');
    
   // Aggiunge un servizio per le chiamate http
   app.service("docServices", function($http)
   {
      
      this.docName = function(url) {
         //console.log("doc icon " + url);
         var k = url.lastIndexOf("/");
         return url.substring(k+1);
      }
      
      this.docExt = function(url) {
         var k = url.lastIndexOf(".");
         return url.substring(k);
      }
      
      this.rimuoviDocumento = function(db_proc, doc) {
         var nome = this.docName(doc.url);
         var url = G_URL_ROOT+"cgi-bin/rimuovi_media.php?proc="+db_proc+"&id_media="+doc.id+"&nome_media="+nome+"&tipo_media=doc";
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
   });
    
    
   app.controller('docsController', docsController);
   function docsController($scope, $http, FileUploader, serviceListNeuroApp, docServices)
   {
      var self = this;
      
      // Assegna questo controller sulla variabile globale
      G_CTRL_DOCS = this;
        
      var docs_uploader = $scope.docs_uploader = new FileUploader({
         url: G_URL_ROOT+'/cgi-bin/docs_upload.php'
      });
     //console.log('DocController uploader creato **** ' );    
          
      // FILTERS          
      // a sync filter
      docs_uploader.filters.push({
         name: 'syncFilter',
         fn: function(item /*{File|FileLikeObject}*/, options) {
             console.log('syncFilter');
             return this.queue.length < 10;
         }
      });
    
      // an async filter
      docs_uploader.filters.push({
         name: 'asyncFilter',
         fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
             //console.log('asyncFilter');
             setTimeout(deferred.resolve, 1e3);
         }
      });
      
      docs_uploader.filters.push({
         name: 'docFilter',
         fn: function (item /*{File|FileLikeObject}*/, options) {
            //console.log("docs-controller.js " + item.type);
            //var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            //console.log("docs-controller.js type " + type);
            //return '|pdf|mp3|wav|aiff|'.indexOf(type) !== -1;
            return true;
         }
      });
 
      // CALLBACKS  
      docs_uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
         //console.info('onWhenAddingFileFailed', item, filter, options);
      };
      docs_uploader.onAfterAddingFile = function(fileItem) {
         //console.info('onAfterAddingFile', fileItem);
      };
      docs_uploader.onAfterAddingAll = function(addedFileItems) {
         //console.info('onAfterAddingAll', addedFileItems);
      };
      docs_uploader.onBeforeUploadItem = function(item) {
         item.formData.push({docdesc: item.formData['docdesc']});				 		
         //console.info('onBeforeUploadItem', item);
      };
      docs_uploader.onProgressItem = function(fileItem, progress) {
         //console.info('onProgressItem', fileItem, progress);
         $('#doc-progress-bar').css('opacity', 1);
      };
      docs_uploader.onProgressAll = function(progress) {
         //console.info('onProgressAll', progress);
      };
      docs_uploader.onSuccessItem = function(fileItem, response, status, headers) {
         //console.info('onSuccessItem', fileItem, response, status, headers);
      };
      docs_uploader.onErrorItem = function(fileItem, response, status, headers) {
         //console.info('onErrorItem', fileItem, response, status, headers);
         if ( response.startsWith('Exception') ) {
            custom_error(response,'Errore');
         }            
      };
      docs_uploader.onCancelItem = function(fileItem, response, status, headers) {
         console.info('onCancelItem', fileItem, response, status, headers);
      };
      docs_uploader.onCompleteItem = function(fileItem, response, status, headers) {
         //console.info('onCompleteItem', fileItem, response, status, headers);            
         if ( response.startsWith('Exception') ) {
            custom_error(response,'Errore');
         }
         else {
            custom_info("Documento inserito nel sistema");
         }
      };
      docs_uploader.onCompleteAll = function() {
         //console.info('onCompleteAll');
         $('#doc-progress-bar').animate({'opacity':0}, 1000);
         // Aggiorna la lista dei documenti e automaticamente aggiorna la pagina html
         self.listaDocumenti();
      };
      //console.info('** uploader **', docs_uploader);



      /**
       * Cancella dal database e dal file sistem il documento specificato.
       * doc - id, url, descr, usato
       **/
      this.confermaCancellaDoc = function (doc)
      {     
         var msg= "<h5>Conferma rimozione del documento <label style='color:rgb(180,0,0)'>"+this.docName(doc.url)+"</label>?</h5>";
         if ( doc.usato == 1) {
            msg =  "<h5><b>Il documento viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg;
         }

         bootbox.dialog (
         {
            title: "<h4>Cancella Documento</h4>", 
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
                    self.cancellaDocumento(doc);
                 } // end callback
              } // end Rimuovi
            } // end buttons
         }); // bootbox.dialog
      } // this.confermaCancellaDoc
     
     
      this.cancellaDocumento = function (doc) {
         $('#waitDiv').show();

         docServices.rimuoviDocumento('NeuroApp.rimuovi_media',doc)
         .then (
            function successCallback(response) {
               //console.log("successCallback ==>"  + response);
               $('#waitDiv').hide();
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  custom_info('Documento cancellato');
                  // Aggiorna la lista dei documenti e automaticamente aggiorna la pagina html
                  self.listaDocumenti();
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
      } // this.cancellaDocumento()

      
      // Lista dei documenti inseriti nel sistema
      this.lista_docs = [];

      /**
       * Legge dal db la lista dei documenti disponibili e li inserisce nell'array this.lista_docs
       */
      this.listaDocumenti = function() {
         this.lista_docs = [];
         $('#waitDiv').show();
         var lista_id='';
         var tipo_media='doc';				
         serviceListNeuroApp.listaMedia(lista_id, tipo_media)
         .then (
            function successCallback(response) {
               $('#waitDiv').hide();
               for (var j=0; j<response.data.length; j++) {
                  var item = response.data[j];
                  self.lista_docs.push( {id:item.id_media, url:item.url_media, descr:item.descr_media, usato:item.usato_media} );
               }
               console.log(self.lista_docs);
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
      } // this.listaDocumenti

      // Caricamento iniziale
      //this.listaDocumenti();
      
      
      /**
       * Nome del documento dalla url in input **/
      this.docName = function(url) {
         return docServices.docName(url);
      }

      /**
       * Estensione del documento (compreso il '.' iniziale) dalla url in input **/
      this.docExt = function(url) {
         return docServices.docExt(url);
      }
      

      
      // l'array 'icons' associa una icona ad un estensione
      this.icons = [];
      this.icons['.txt' ]  =  "images/txt-icon.png";
      this.icons['.doc' ]  =  "images/word-icon.png";
      this.icons['.docx']  =  "images/word-icon.png";
      this.icons['.docm']  =  "images/word-icon.png";
      this.icons['.rtf' ]  =  "images/word-icon.png";
      this.icons['.pdf' ]  =  "images/pdf-icon.png";
      this.icons['.xls' ]  =  "images/xls-icon.png";
      this.icons['.xlsx']  =  "images/xls-icon.png";
      
      /**
       * Restituise I'icona da inserire sulla pagina html in base all'estensione del documento.
       */
      this.docIcon = function(url) {
         if ( this.icons[this.docExt(url)] == undefined )
            return "images/generic-doc-icon.png";
         else
            return this.icons[this.docExt(url)];
      }
   } // docsController
    
})();