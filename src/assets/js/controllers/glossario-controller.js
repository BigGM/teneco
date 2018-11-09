
/*
 * ==================================================================
 *
 *             Controller del pannello GLOSSARIO
 * Questo script viene incluso in index.html dopo NeuroApp.js
 * percio' eredita funzioni e parametri definiti in quel javascript.
 *
 * app.service: glossaryService
 * app.controller: glossaryController
 * ==================================================================
 **/
   
(function() {
  'use strict';
  
   /* crea il modulo angularjs con due controller */
   var app = angular.module('neuroApp');
   
   // Aggiunge un servizio per le chiamate http
   app.service("glossaryService", function($http)
   {     
      // Carica le voci del glossario dal db
      this.loadGlossario = function(db_proc) {
         var url = G_URL_ROOT+"/cgi-bin/lista_glossario.php?proc="+db_proc;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      // Salva nel db una nuova voce nel glossario
      this.salvaGlossario = function(db_proc,glossario) {
         var url = G_URL_ROOT+"/cgi-bin/salva_glossario.php?proc="+db_proc+"&voce="+glossario.voce+"&definizione="+glossario.definizione;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      // Salva sul db la modifica alla definizione della voce in input
      this.salvaGlossarioModificato = function(db_proc,glossario) {
         var url = G_URL_ROOT+"/cgi-bin/salva_glossario_modificato.php?proc="+db_proc+"&id_voce="+glossario.id_voce+"&voce="+glossario.voce+"&definizione="+glossario.definizione;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }

      // Cancella dal db la voce specificata
      this.cancellaGlossario = function(db_proc,glossario) {
         var url = G_URL_ROOT+"/cgi-bin/cancella_glossario.php?proc="+db_proc+"&id_voce="+glossario.id_voce;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
   }); // end servizio "glossaryService"

   // Aggiunge il controller della pagina del glossario
   app.controller('glossaryController', glossaryController);
   function glossaryController($scope, NgTableParams, $http, glossaryService)
   {
      var self = this;
      
      // Asseggna questa istanza del controller alla variabile globale
      G_CTRL_GLOS = this;

      // questo e' la voce su cui si sta lavorando
	  this.voce_glossario  = { id_voce:-1, voce:"", definizione:"", full_definizione:"" }
	  
      // Lista glossario
      this.glossario  = [];
                  
      this.view_glossario_visible = false;
      
      // Record attualmente visualizzato 
      this.id_voce = -1;
      this.voce = "";
      this.definizione = "";
      this.full_definizione = "";
            
      this.debug = function(msg) {
         alert(msg);
      }
      
      /**
       * tronca la stringa in input ai prima max_chars caratteri
       **/
      this.truncDescr = function(descr,max_chars) {
         if (descr!=null && descr.length > max_chars-3) {
            return descr.substring(0,max_chars) + "...";
         } else {
            return descr;
         }
      }
      
      /**
       * Carica la lista delle voci dal DB (tabella glossario)
       **/
      this.loadGlossario = function() {
         
         console.log('load glossario');
         $('#waitDiv').show();
         
         glossaryService.loadGlossario('NeuroApp.lista_glossario')		 
         .then (
            function successCallback(response)
            {
			   console.log(response.data);
               
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide();
                  custom_error(response.data,'Errore');
                  return;
               }
               var values = response.data;
               for (var j=0; j<values.length; j++) {
                  var voce_glossario = {
                     id_voce          : values[j].id,
                     voce             : values[j].voce,
                     definizione      : self.truncDescr(values[j].definizione,100),
                     full_definizione : values[j].definizione
                  }
                  self.glossario.push( voce_glossario );				  
               }
			   //console.log(self.glossario);
               $('#waitDiv').hide(); 
            },
            function errorCallback(response) {
               // TO_DEL
			   console.log("***response***" + response.data );
               $('#waitDiv').hide();
               self.view_glossario_visible = false;
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.loadGlossario
      
	  
      /**
       * Riaggiorna la lista delle voci nel glossario
       */
      this.reloadGlossario = function()
      {
         console.log("DEBUG: reloadGlossario");
         this.glossario = [];
         this.loadGlossario();
         //self.view_glossario_visible = false;
      } // this.reloadGlossario
      
	  
      /**
       * Visualizza la form per l'inserimento di una nuova voce
       **/
      this.formNuovaVoceGlossario = function() {
         //console.log("insert formNuovaVoceGlossario");
		 this.voce_glossario = { id_voce:-1, voce:"", definizione:"", full_definizione:"" };
         $('#nuovaVoceGlossario').modal('show');
      } // this.formNuovaVoceGlossario
      
      /**
       * Visualizza la form per l'inserimento di una nuova voce nel glossario
       **/
      this.formModifVoceGlossario = function(p_voce_glossario) {
         this.voce_glossario = p_voce_glossario;
         console.log("formModifVoceGlossario ");
         console.log(p_voce_glossario)
         $('#modifVoceGlossario').modal('show');
      } // this.formModifVoceGlossario
      
      /**
       * Salva sul DB la nuova voce del glossario inserita nella form
       */
      this.salvaGlossario = function() {
         
         $('#waitDiv').show();
         
         glossaryService.salvaGlossario('NeuroApp.salva_glossario',self.voce_glossario)
         .then (
            function successCallback(response) {
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadGlossario();
                  custom_info('Voce salvata');
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
      } // this.salvaGlossario
      
      
      /**
       * Salva sul DB la voce in input modificata
       */
      this.salvaGlossarioModificato = function(p_voce_glossario) {
         
         $('#waitDiv').show();
                  
         glossaryService.salvaGlossarioModificato('NeuroApp.salva_glossario_modificato',p_voce_glossario)
         .then (
            function successCallback(response) {
                  console.log(response);
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadGlossario();
                  // chiude la finestra modale di modifica
                  //TBV_PP $('#modifVoceGlossario').modal('hide');
                  custom_info('Modifiche salvate');
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
      } // this.salvaGlossarioModificato
      
      
      /**
       * Apre la finestra per confermare la richiesta di cancellazione di una voce,
       * e in caso positivo richiama this.cancellaGlossario
       */
      this.confermaCancellaGlossario = function (p_voce_glossario)
      {
         bootbox.dialog ({
             title: "<h3>Cancella voce glossario</h3>", 
             message: "<h4>Conferma rimozione della voce <label style='color:rgb(180,0,0);'>"+p_voce_glossario.voce+"</label></h4>",
             draggable:true,
             buttons:{
               "Annulla":{
                   className:"btn-default btn-md"
               }, 
               "Rimuovi" : { 
                  className:"btn-danger btn-md",
                  callback: function(){
                     self.cancellaGlossario(p_voce_glossario);
                  } // end callback
               } // end Rimuovi
            } // end buttons
         }); // bootbox.dialog
      } // this.confermaCancellaGlossario
      
	  
      this.cancellaGlossario = function (p_voce_glossario) {
         
         $('#waitDiv').show();
         
         glossaryService.cancellaGlossario('NeuroApp.cancella_glossario',p_voce_glossario)
         .then (
            function successCallback(response) {
                  console.log(response);
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadGlossario();
                  custom_info('Voce cancellata dal glossario');
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
      } // this.cancellaGlossario()
      
	  
      // Ripulisce i campi della form per l'inserimento di una nuova voce
      this.pulisciformNuovaVoceGlossario = function() {
         //alert('DEBUG: pulisciformNuovaVoceGlossario');
         this.voce_glossario  = { id_voce:-1, voce:"", definizione:"", full_definizione:"" }
         // questo funziona perche' ho usato la direttiva ng-import e non ng-include
         $scope.formNuovaVoceGlossario.$setPristine('true');
      }
      
      // Ripulisce i campi della form per l'inserimento di una nuova voce
      this.pulisciformModifVoceGlossario = function() {
         //alert('DEBUG: pulisciformModifVoceGlossario');
         this.voce_glossario  = { id_voce:-1, voce:"", definizione:"", full_definizione:"" }
         // Vedi nota qui sopra
         $scope.formModifVoceGlossario.$setPristine('true');
      }
             			 
      this.initialized = false;
      this.setGlossarioVisible = function () {
		 
         //console.log(this.initialized);
		 
		 if  ( !this.initialized ) {
            this.initialized = true;
            this.init();
         }
         this.view_glossario_visible = true;
      }
      
      this.init = function() {
         console.log("init");
         this.loadGlossario();
      }

   } // end controller glossaryController
   
   /**
    * Questa direttiva serve a cambiare il valore della url per il video
    * perché scrivendo semplicemente src={{url_media}} il video non viene caricato
    **/
   app.directive('dynamicUrl', function () {
      return {
         restrict: 'A',
         link: function postLink(scope, element, attr) {
            element.attr('src', attr.dynamicUrlSrc);
         }
      };
   });
   
   
   /**
    * Definisce la direttiva ngImport, che inietta un sorgente nel codice come ng-include
    * ma non crea un nuovo scope come ng-include e definisce gli attributi controller e 
    * controllerAs in modo da importare il controller dell'app
    **/
   app.directive ('ngImportGlos', function($templateRequest, $anchorScroll, $animate, $sce){
    return {
      restrict: 'ECA',
      priority: 400,
      terminal: true,
      transclude: 'element',
      controller: 'glossaryController',
      controllerAs: 'glos',
      compile: function(element, attr) {
        
        var srcExp = attr.ngInsert || attr.src,
            onloadExp = attr.onload || '',
            preserveScope = attr.preserveScope || true,
            autoScrollExp = attr.autoscroll;
           
        return function(scope, $element, $attr, $ctrl0, $transclude) {
          var changeCounter = 0,
              currentScope,
              previousElement,
              currentElement;

          var cleanupLastInsertContent = function() {
            if (previousElement) {
              previousElement.remove();
              previousElement = null;
            }
            if (currentScope) {
              currentScope.$destroy();
              currentScope = null;
            }
            if (currentElement) {
              $animate.leave(currentElement).then(function() {
                previousElement = null;
              });
              previousElement = currentElement;
              currentElement = null;
            }
          };

          scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
            var afterAnimation = function() {
              if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                $anchorScroll();
              }
            };
            var thisChangeId = ++changeCounter;

            if (src) {
              $templateRequest(src, true).then(function(response) {
                if (thisChangeId !== changeCounter) return;

                var newScope = scope;
                //if (!preserveScope)
                //  newScope = scope.$new();

                $ctrl0.template = response;

                var clone = $transclude(newScope, function(clone) {
                  cleanupLastInsertContent();
                  $animate.enter(clone, null, $element).then(afterAnimation);
                });

                currentScope = newScope;
                currentElement = clone;

                currentScope.$emit('$insertContentLoaded', src);
                scope.$eval(onloadExp);
              }, function() {
                if (thisChangeId === changeCounter) {
                  cleanupLastInsertContent();
                  scope.$emit('$insertContentError', src);
                }
              });
              scope.$emit('$insertContentRequested', src);
            } else {
              cleanupLastInsertContent();
              $ctrl0.template = null;
            }
          });
        };
      }
    };
  }); // directive: ngImport
  
   app.directive('ngImportGlos', function ($compile) {
    return {
      restrict: 'ECA',
      priority: -400,
      require: 'ngImportGlos',

      link: function(scope, $element, $attr, $ctrl) {
   
        if (/SVG/.test($element[0].toString())) {
          // WebKit: https://bugs.webkit.org/show_bug.cgi?id=135698 --- SVG elements do not
          // support innerHTML, so detect this here and try to generate the contents
          // specially.
          $element.empty();
          $compile(jqLiteBuildFragment($ctrl.template, document).childNodes)(scope,
              function namespaceAdaptedClone(clone) {
            $element.append(clone);
          }, {futureParentElement: $element});
          return;
        }

        $element.html($ctrl.template);       
        $compile($element.contents())(scope);
      }
    };
  });  // directive: ngImport
  
})();