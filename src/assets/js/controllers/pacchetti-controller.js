
/*
 * ==================================================================
 *
 *             Controller del pannello dei pacchetti
 * Questo script viene incluso in index.html dopo NeuroApp.js
 * percio' eredita funzioni e parametri definiti in quel javascript.
 *
 * ==================================================================
 **/
   
(function() {
  'use strict';
  
   /* Riferimento all'app creata in neuro-app.js */
   var app = angular.module('neuroApp');
   
   
   // Aggiunge un servizio per le chiamate http
   app.service("serviceListNeuroApp", function($http)
   {
      // Sostituisce i caratteri '\n' con <br>
      this.protectNewLine = function(s) {
         s = s.replace(/(?:\r\n|\r|\n)/g, '<br>');
         console.log("protectNewLine " + s );
         return s;
      }
      
      
      // Carica il glossario
      this.loadGlossario = function(db_proc) {
         var url = G_URL_ROOT+"/cgi-bin/glossario.php?proc="+db_proc;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      
      // Carica la lista dei gruppi
      this.loadGruppi = function(db_proc) {
         var url = G_URL_ROOT+"/cgi-bin/lista_gruppi.php?proc="+db_proc;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      // Carica la lista dei gruppi delle patologie
      this.loadGruppiPatologie = function(db_proc) {
         var url = G_URL_ROOT+"/cgi-bin/lista_gruppi_patologie.php?proc="+db_proc;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      
      // Carica la lista delle patologie del gruppo patologie code_gruppo
      this.loadPatologiePerGruppo = function(db_proc,code_gruppo) {
         var url = G_URL_ROOT+"/cgi-bin/lista_patologie_gruppo.php?proc="+db_proc + "&code_gruppo="+code_gruppo;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }

      
      // Carica la lista dei pacchetti dal db
      this.loadPacchetti = function(db_proc,ambito) {
         var url = G_URL_ROOT+"/cgi-bin/lista_pacchetti.php?proc="+db_proc+"&ambito="+ambito;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }

      
      // Salva sul db il nuovo pacchetto in input
      this.salvaNuovoPacchetto = function(db_proc,pacchetto,ambito) {
         var url = G_URL_ROOT+"/cgi-bin/salva_pacchetto.php?proc="+db_proc+"&nome="+pacchetto.nome +
                   "&descr="+pacchetto.descr.replace(/&amp;/,'0x26').replace(/#/,'0x23') +
                   "&pre_req="+this.protectNewLine(pacchetto.pre_req) +
                   "&contro_ind="+this.protectNewLine(pacchetto.contro_ind) +
                   "&alert_msg="+pacchetto.alert_msg +
                   "&ambito="+ambito;
         console.log( url );
         return $http.get(url,{timeout:30000});
      }

      
      // Salva sul db le modifica al pacchetto in input
      this.salvaPacchettoModificato = function(db_proc,pacchetto) {
         var url = G_URL_ROOT+"/cgi-bin/salva_pacchetto_modificato.php?proc="+db_proc+"&id_pkt="+pacchetto.id_pkt+"&nome="+pacchetto.nome+"&descr="+pacchetto.descr;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }


      // Cancella dal db il pacchetto specificato
      this.cancellaPacchetto = function(db_proc,pacchetto) {
         var url = G_URL_ROOT+"/cgi-bin/cancella_pacchetto.php?proc="+db_proc+"&id_pkt="+pacchetto.id_pkt;
         //console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      
      // Salva sul db il nuovo pacchetto in input
      this.salvaEsercizio = function(db_proc,ex) {
         var url = G_URL_ROOT+"/cgi-bin/salva_esercizio.php?proc="+db_proc+"&id_pkt="+ex.id_pkt+"&nome="+ex.nome+"&descr="+ex.descr+"&id_grp="+ex.id_grp;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      // Salva sul db le modifiche ad un esercizio esistente
      this.salvaEsercizioModificato = function(db_proc,ex) {
         var url = G_URL_ROOT+"/cgi-bin/salva_esercizio_modificato.php?proc="+db_proc+"&id_pkt="+ex.id_pkt+"&id_ex="+ex.id_ex+"&descr="+ex.descr+"&id_grp="+ex.id_grp;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }

      
      // Cancella dal db l'esercizio specificato
      this.cancellaEsercizio = function(db_proc,ex) {
         var url = G_URL_ROOT+"/cgi-bin/cancella_esercizio.php?proc="+db_proc+"&id_pkt="+ex.id_pkt+"&id_ex="+ex.id_ex;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }// Cancella dal db l'esercizio specificato


      // Cancella un elemento multimediale dall'esercizio attuamente mostrato in dettaglio
      this.cancellaMedia = function(db_proc, id_pkt, id_ex, id_media) {
         var url = G_URL_ROOT+"/cgi-bin/cancella_media_esercizio.php?proc="+db_proc+"&id_pkt="+id_pkt+"&id_ex="+id_ex+"&id_media="+id_media;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      
      // Aggiunge un elemento multimediale all'esercizio attuamente mostrato in dettaglio
      this.aggiungiMedia = function(db_proc, id_pkt, id_ex, id_media) {
         var url = G_URL_ROOT+"/cgi-bin/aggiungi_media_esercizio.php?proc="+db_proc+"&id_pkt="+id_pkt+"&id_ex="+id_ex+"&id_media="+id_media;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      
      // Carica la lista degli esercizi dal db per il pacchetto in input
      this.loadEserciziPacchetto = function(db_proc,id_pkt) {
         var url = G_URL_ROOT+"/cgi-bin/lista_esercizi.php?proc="+db_proc+"&id_pkt="+id_pkt;
         //console.log(url);
         return $http.get(url,{timeout:30000});
      }
      
      // Carica la lista degli esercizi dal db per il pacchetto in input
      this.loadDetailExercice = function(db_proc,id_pkt,id_ex) {
         var url = G_URL_ROOT+"/cgi-bin/lista_dettaglio_esercizio.php?proc="+db_proc+"&id_pkt="+id_pkt+"&id_ex="+id_ex;
         console.log(url);
         return $http.get(url,{timeout:30000});
      }


      // Questo fornisce la lista dei video inseriti nella tabella GCA_MULTIMEDIA escludendo
      // quelli i cui id sono nella lista  in input (valori separati da virgole)
      // tipo_media: video, audio, image
      this.listaMedia = function(lista_id, tipo_media)
      {
         var url = G_URL_ROOT+"/cgi-bin/lista_media.php?proc=NeuroApp.lista_media&tipo_media="+tipo_media+"&lista_id=";
         if (lista_id != "")
            url += lista_id;
         else
            url += "-1"; // non ci sono id negativi nella tabella percio' questo funziona
         console.log(url);
         return $http.get(url,{timeout:30000});
      }

   }); // end servizio "serviceListNeuroApp"

   
   
   // Controller della pagina del pacchetti
   app.controller('pacchettiController', pacchettiController);
   
   function pacchettiController($scope,  $sce, NgTableParams, $http, serviceListNeuroApp)
   {
      var self = this;
      
      // Assegna questa istanza del controller alla variabile globale
      G_CTRL_PKG = this;
      
      /**
       * Per bypassare ngSanitize in ng-bind-html quando si rende necessario
       **/
      this.trustThisHtml = function(code) {
         return $sce.trustAsHtml(code);
      }

      // questo e' il pacchetto su cui si sta lavorando
      this.pacchetto  = { id_pkt:-1, nome:"", descr:"", full_descr:"", pre_req:"", contro_ind:"", alert_msg:"", patologia:"" }
      
      // e questo e' l'esercizio su cui si sta lavorando
      this.esercizio  = { id_pkt:-1, id_ex:-1, nome:"", descr:"", id_grp:-1, nome_grp:"", count_media: -1 }
      
      
      this.patologia = {id_patologia: -1, code_patologia:"", patologia:""}
      
      // Lista dei pacchetti
      this.pacchetti  = [];
      
      // Lista dei gruppi patologie (array di this.patologia)
      this.patologie  = [];
      
      // Lista delle patologie di un gruppo
      this.patologie_gruppo  = [];
      
      
      // Lista degli esercizi di un pacchetto 
      //this.esercizi   = [];
      
      // La Lista dei gruppi viene precaricata in fase di init
      this.gruppo = { id_gruppo:-1, nome_gruppo:"", descr_gruppo:"" }
      this.gruppi = []
      
      
      // Lista delle immagini
      this.img_esercizio = [];
      
      // Lista dei file video presenti per un esercizio
      this.video_esercizio = [];
      
      // Lista dei file audio presenti per un esercizio
      this.audio_esercizio = [];
      
      this.view_pacchetti_visible = false;
      this.view_esercizi_visible = false;
      this.dett_esercizio_visible = false;
      
      
      /***** VARIABILI PER IL PACCHETTO DI ESERCIZI ATTUALMENTE VISUALIZZATO ***/
      this.idPacchetto        = -1;    // Id del pacchetto
      this.nomePacchetto      = "";    // Nome del pacchetto    (obbligatorio)
      this.descrPacchetto     = "";    // Descrizione completa  (opzionale)
      this.prereqPacchetto    = "";    // Pre requisiti         (opzionale)
      this.controIndPacchetto = "";    // Contro indicazioni    (opzionale)
      this.alertPacchetto     = "";    // Messaggio di alert    (opzionale)
      
      /***** VARIABILI PER IL PACCHETTO ATTUALMENTE VISUALIZZATO ***/
      
      
      // Attributi per la pagina di dettaglio dell'esercizio
      this.idDettaglioPacchetto = -1;
      this.idDettaglioEsercizio = -1;
      this.idDettaglioGruppo    = -1;
      this.titoloDettaglioEsercizio = "";
      this.descrDettaglioEsercizio = "";
      //this.alertDettaglioEsercizio = "Alert: Eseguire questo esercizio se ....";
      this.alertDettaglioEsercizio = "";
      

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
       * Restituisce il nome del gruppo con l'id specificato
       */
      this.nomeGruppo = function(id_gruppo) {
         //console.log("nome gruppo per l'id " + id_gruppo)
         if ( id_gruppo==-1 )
            return "";
         
         for (var j=0; j< this.gruppi.length; j++)
            if ( this.gruppi[j].id_gruppo == id_gruppo )
               return "(" + this.gruppi[j].nome_gruppo + ")";
            
         return "(Nessun gruppo)";
      }
      

      /**
       * Carica la lista dei gruppi
       **/
      this.loadGruppi = function() {
         //console.log('load gruppi');
         
         serviceListNeuroApp.loadGruppi('NeuroApp.lista_gruppi')
         .then (
            function successCallback(response)
            {
               //console.log(response.data);
               self.gruppi = [];
               self.gruppi.push( {id_gruppo:-1, nome_gruppo:"-- Nessun gruppo --", descr_gruppo:"-"} );
               
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               var values = response.data;
               for (var j=0; j<values.length; j++) {
                  var gruppo = {
                     id_gruppo    : values[j].id_gruppo,
                     nome_gruppo  : values[j].nome_gruppo,
                     descr_gruppo : values[j].descr_gruppo,
                  }
                  self.gruppi.push( gruppo );
               }
               //console.log(self.gruppi);
            },
            function errorCallback(response) {
               console.log("DEBUG: loadGruppi ***response***" + response.data );
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.loadGruppi
      
      
      /**
       * Carica la lista dei gruppi delle patologie
       **/
      this.loadGruppiPatologie = function() {
         console.log('load gruppi patologie');
         
         serviceListNeuroApp.loadGruppiPatologie('NeuroApp.lista_gruppi_patologie')
         .then (
            function successCallback(response)
            {
               //console.log(response.data);
               self.patologie = [];
               
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               var values = response.data;
               for (var j=0; j<values.length; j++) {
                  var patologia = {
                     id_patologia   : values[j].id_patologia,
                     code_patologia : values[j].code_patologia,
                     patologia      : values[j].patologia
                  }
                  self.patologie.push( patologia );
               }
               //console.log(self.gruppi);
            },
            function errorCallback(response) {
               console.log("DEBUG: loadGruppi ***response***" + response.data );
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.loadGruppiPatologie
      
      
      
      this.loadPatologiePerGruppo = function(id_patologia, code_patologia, patologia) {
         console.log('load gruppi patologie');
         console.log(id_patologia);
         console.log(code_patologia);
         console.log(this.patologia);

         this.patologia = { id_patologia: id_patologia, code_patologia: code_patologia, patologia: patologia };
         
         serviceListNeuroApp.loadPatologiePerGruppo('NeuroApp.lista_patologie_gruppo', code_patologia)
         .then (
            function successCallback(response)
            {
               //console.log(response.data);
               self.patologie_gruppo = [];
               
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               var values = response.data;
               for (var j=0; j<values.length; j++) {
                  var patologia = {
                     id_patologia   : values[j].id_patologia,
                     code_patologia : values[j].code_patologia,
                     patologia      : values[j].patologia
                  }
                  self.patologie_gruppo.push( patologia );
               }
               //console.log(self.gruppi);
            },
            function errorCallback(response) {
               console.log("DEBUG: loadGruppi ***response***" + response.data );
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.loadPatologiePerGruppo
      
      
      this.setPatologia = function(p) {
         console.log('setPatologia');
         console.log(p);
         this.patologia = angular.copy(p)
         //this.patologia.id_patologia = p.id_patologia;
         //this.patologia.code_patologia = p.code_patologia;
         //this.patologia.patologia = p.patologia;
         // questo e' il bind sull'interfaccia modale inserimento/modifica pacchetto
         this.pacchetto.patologia = p.code_patologia + " - " + p.patologia;
      }
      
      
      /**
       * Carica la lista del pacchetti dal DB
       **/
      this.loadPacchetti = function() {
         
         //console.log('load pacchetti');
         $('#waitDiv').show();
         
         serviceListNeuroApp.loadPacchetti('NeuroApp.lista_pacchetti', G_AMBITO)
         .then (
            function successCallback(response)
            {
               //console.log(response.data);
               
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide();
                  custom_error(response.data,'Errore');
                  return;
               }
               
               var values = response.data;
               for (var j=0; j<values.length; j++) {
                  var pacchetto = {
                     id_pkt     : values[j].id,
                     nome       : values[j].nome,
                     descr      : self.truncDescr(values[j].descr,140),
                     full_descr : values[j].descr,
                     pre_req    : values[j].pre_req,
                     contro_ind : values[j].contro_ind,
                     alert_msg  : values[j].alert_msg
                  }
                  self.pacchetti.push( pacchetto );
               }
               $('#waitDiv').hide(); 
            },
            function errorCallback(response) {
               //console.log("***response***" + response.data );
               $('#waitDiv').hide();
               self.view_pacchetti_visible = false;
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.loadPacchetti
      
      
      /**
       * Carica la lista degli esercizi del pacchetto 'pkt' e la visualizza nel pannello
       **/
      this.loadEserciziPacchetto = function(pkt)
      {
         //console.log(pkt);
 
         $('#waitDiv').show();
         
         serviceListNeuroApp.loadEserciziPacchetto('NeuroApp.lista_esercizi',pkt.id_pkt)
         .then (
            function successCallback(response)
            {
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide();
                  custom_error(response.data,'Errore');
                  return;
               }

               self.data = response.data;
               var initialParams = {
                   noPager: true,
                   count: self.data.length // initial page size
               };
               var initialSettings = {
                   counts: [],
                   dataset: self.data
               };
               self.tableParams = new NgTableParams( initialParams, initialSettings);
               self.tableParams.reload();
               
               /**
               var values = response.data;
               console.log("loadEserciziPacchetto values " + values);
               for (var j=0; j<values.length; j++) {
                  var esercizio = {
                     id_pkt      : parseInt(values[j].id_pkt),
                     id_ex       : parseInt(values[j].id_ex),
                     nome        : values[j].nome,
                     descr       : self.truncDescr(values[j].descr,100),
                     id_grp      : parseInt(values[j].id_grp),
                     nome_grp    : values[j].nome_grp,
                     count_media : parseInt(values[j].count_media)
                  }
                  //console.log(item);
                  self.esercizi.push( esercizio );
               }**/

               // aggiorna id,nome e descrizione del pacchetto di esercizi
               self.idPacchetto        = pkt.id_pkt;
               self.nomePacchetto      = pkt.nome;
               self.descrPacchetto     = pkt.full_descr;
               self.prereqPacchetto    = pkt.pre_req;
               self.controIndPacchetto = pkt.contro_ind;
               self.alertPacchetto     = pkt.alert_msg;
               self.patologia          = pkt.alert_msg;
               
               //console.log( "**** " + self.descrPacchetto );
               
               self.view_esercizi_visible = true;
               $('#waitDiv').hide(); 
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
      } // this.loadEserciziPacchetto
      
      
      
      /**
       * Riaggiorna la lista dei pacchetti di esercizi
       */
      this.reloadPacchetti = function()
      {
         console.log("DEBUG: reloadPacchetti");
         this.pacchetti = [];
         this.pacchetti = [];
         this.idPacchetto = -1;
         this.nomePacchetto      = "";
         this.descrPacchetto     = "";
         this.prereqPacchetto    = "";
         this.controIndPacchetto = "";
         this.alertPacchetto     = "";
         //this.patologia          = "";
         this.loadPacchetti();
         this.view_esercizi_visible = false;
      }
      
      /**
       * Riaggiorna la lista degli esercizi del pacchetto selezionato
       */
      this.reloadEserciziPacchetto = function() {
         this.esercizi = [];
         var pacchetto = null;
         // trova nella lista dei pacchetti quello attuale
         for (var j=0; j<self.pacchetti.length; j++) {
            if ( self.pacchetti[j].id_pkt==self.idPacchetto) {
               pacchetto = self.pacchetti[j];
               break;
            }
         }
         if (pacchetto!=null) {
            console.log("DEBUG: reloadEserciziPacchetto " + pacchetto.nome);
            this.loadEserciziPacchetto(pacchetto);
         }
      }
      
      
      /**
       * Visualizza la forma per l'inserimento di un nuovo pacchetto
       **/
      this.formNuovoPacchetto = function() {
         this.pacchetto  = { id_pkt:-1, nome:"", descr:"", full_descr:"", pre_req:"", contro_ind:"", alert_msg:"", patologia:"" }
         $('#nuovoPacchetto').modal('show');
      }
      
      /**
       * Visualizza la forma per l'inserimento di un nuovo pacchetto
       **/
      this.formModifPacchetto = function(pkt) {
         this.pacchetto = pkt
         console.log("formModifPacchetto ");
         console.log(pkt)
         $('#modifPacchetto').modal('show');
      }
      
            
      /**
       * Visualizza la forma per l'inserimento di un nuovo pacchetto
       **/
      this.formNuovoEsercizio = function() {
         this.esercizio  = { id_pkt:-1, id_ex:-1, nome:"", descr:"", id_grp:-1, nome_grp:"", count_media: -1 }
         $('#nuovoEsercizio').modal('show');
      }
      
      
      /**
       * Visualizza la forma per l'inserimento di un nuovo pacchetto
       **/
      this.formModifEsercizio = function(ex) {
         console.log('DEBUG: formModifEsercizio');
         console.log(ex)
         $('#modifEsercizio').modal('show');
      }
      

      /**
       * Salva sul DB il nuovo pacchetto specificato nella form
       **/
      this.salvaNuovoPacchetto = function() {
         
         console.log(this.pacchetto);
         console.log( $('#summernote-descr-new-pkt').summernote('code') );
         //return;
         this.pacchetto.descr = $('#summernote-descr-new-pkt').summernote('code');
 
         $('#waitDiv').show();
         
         serviceListNeuroApp.salvaNuovoPacchetto('NeuroApp.salva_pacchetto',this.pacchetto, G_AMBITO)
         .then (
            function successCallback(response) {
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadPacchetti();
                  custom_info('Pacchetto salvato');
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
      } // this.salvaNuovoPacchetto
      
      
      /**
       * Salva sul DB il pacchetto in input modificato
       **/
      this.salvaPacchettoModificato = function(pkt) {
         
         $('#waitDiv').show();
                  
         serviceListNeuroApp.salvaPacchettoModificato('NeuroApp.salva_pacchetto_modificato',pkt)
         .then (
            function successCallback(response) {
                  console.log(response);
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadPacchetti();
                  // chiude la finestra modale di modifica
                  $('#modifPacchetto').modal('hide');
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
      } // this.salvaPacchettoModificato
      
      
      /**
       * Apre la finestra per confermare la richiesta di cancellazione di una pacchetto,
       * e in caso positivo richiama this.cancellaPacchetto
       */
      this.confermaCancellaPacchetto = function (pkt)
      {
         bootbox.dialog ({
             title: "<h3>Cancella Pacchetto</h3>", 
             message: "<h4>Conferma rimozione del pacchetto <label style='color:rgb(180,0,0);font-size:16px;'>"+pkt.nome+"</label></h4>",
             draggable:true,
             buttons:{
               "Annulla":{
                   className:"btn-default btn-md"
               }, 
               "Rimuovi" : { 
                  className:"btn-danger btn-md",
                  callback: function(){
                     self.cancellaPacchetto(pkt);
                  } // end callback
               } // end Rimuovi
            } // end buttons
         }); // bootbox.dialog
      } // this.cancellaPacchetto
      
      this.cancellaPacchetto = function (pkt) {
         
         $('#waitDiv').show();
         
         serviceListNeuroApp.cancellaPacchetto('NeuroApp.cancella_pacchetto',pkt)
         .then (
            function successCallback(response) {
                  console.log(response);
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadPacchetti();
                  custom_info('Pacchetto cancellato');
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
      } // this.cancellaPacchetto()
      
      
      /**
       * Salva sul DB un nuovo esercizio definito nella form
       **/
      this.salvaEsercizio = function() {
         
         $('#waitDiv').show();
         
         self.esercizio.id_pkt = self.idPacchetto;
         
         serviceListNeuroApp.salvaEsercizio('NeuroApp.salva_esercizio',self.esercizio)
         .then (
            function successCallback(response) {
               $('#waitDiv').hide(); 
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadEserciziPacchetto();
                  custom_info('Esercizio salvato');
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
      } // this.salvaEsercizio
      
       
      /**
       * Salva sul DB le modifiche all'esercizio mostrato nel pannello di dettaglio.
       * Si possono cambiare solo la descrizione e/o il gruppo
       **/
      this.salvaEsercizioModificato = function(ex) {
         console.log('DEBUG: salvaEsercizioModificato')
         console.log(ex);
         
         $('#waitDiv').hide(); 
         
         self.esercizio = angular.copy(ex);
         
         serviceListNeuroApp.salvaEsercizioModificato('NeuroApp.salva_esercizio_modificato',self.esercizio)
         .then (
            function successCallback(response) {
               $('#waitDiv').hide(); 
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  // aggiorna la descrizione e il gruppo sulle variabili in bind con la grafica
                  self.descrDettaglioEsercizio = self.esercizio.descr;
                  self.idDettaglioGruppo = self.esercizio.id_grp;
                  $('#modifEsercizio').modal('hide');
                  custom_info('Esercizio salvato');
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
      } // this.salvaEsercizioModificato
      
      
      /**
       * Rimuove il pacchetto di esercizi specificato in input
       */
      this.confermaCancellaEsercizio = function (ex) {
         bootbox.dialog ({
             title: "<h3>Cancella Esercizio</h3>", 
             message: "<h4>Conferma rimozione del pacchetto <label style='color:rgb(180,0,0)'>"+ex.nome+"</label></h4>",
             draggable:true,
             buttons:{
               "Annulla":{
                   className:"btn-default btn-md"
               }, 
               "Rimuovi" : { 
                  className:"btn-danger btn-md",
                  callback: function(){
                     self.cancellaEsercizio(ex);
                  } // end callback
               } // end Delete
            } // end buttons
         }); // bootbox.dialog
      } // this.confermaCancellaEsercizio
      
      this.cancellaEsercizio = function (ex) {
         console.log("DEBUG: cancellaEsercizio");
         console.log(ex);
         
         $('#waitDiv').hide();
         
         serviceListNeuroApp.cancellaEsercizio('NeuroApp.cancella_esercizio',ex)
         .then (
            function successCallback(response) {
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide(); 
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.reloadEserciziPacchetto();
                  custom_info('Esercizio cancellato');
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
      } // this.cancellaEsercizio()
      
  
      // Ripulisce i campi della form per l'inserimento di un nuovo pacchetto
      this.pulisciFormNuovoPacchetto = function() {
         //alert('DEBUG: pulisciFormNuovoPacchetto');
         $('#summernote-descr-new-pkt').summernote('reset');
         this.pacchetto  = { id_pkt:-1, nome:"", descr:"", full_descr:"", pre_req:"", contro_ind:"", alert_msg:"", patologia:"" }
         // questo funziona perche' ho usato la direttiva ng-import e non ng-include
         $scope.formNuovoPacchetto.$setPristine('true');
      }
      
      // Ripulisce i campi della form per l'inserimento di un nuovo pacchetto
      this.pulisciFormModifPacchetto = function() {
         alert('DEBUG: pulisciFormModifPacchetto');
         this.pacchetto  = { id_pkt:-1, nome:"", descr:"", full_descr:"", pre_req:"", contro_ind:"", alert_msg:"", patologia:"" }
         // Vedi nota qui sopra
         $scope.formModifPacchetto.$setPristine('true');
      }
      
      // Ripulisce i campi della form per l'inserimento di un nuovo esercizio
      // del pacchetto corrente
      this.pulisciFormEsercizio = function() {
         alert('DEBUG: pulisciFormEsercizio');
         this.esercizio = { id_pkt:self.idPacchetto, id_ex:-1, nome:"", descr:"", id_grp:-1, nome_grp:"", count_media: -1 }
         // Vedi nota qui sopra
         $scope.formNuovoEsercizio.$setPristine('true'); 
      }
      
      
      // Ripulisce i campi della form per la modifica dell'esercizio attualmente mostrato nel dettaglio.
      // I campi in bind sono quelli di this.esercizio
      this.pulisciFormModifEsercizio = function() {
         this.esercizio.descr  = "";
         this.esercizio.id_grp = "-1";
         // Vedi nota qui sopra
         $scope.formModifEsercizio.$setPristine('true');
      }
      
      
      /**
       * Dettaglio di un esercizio
       */
      this.dettaglioEsercizio = function(ex, success_callback)
      {
         console.log("DEBUG: dettaglioEsercizio");
         console.log(ex);
         
         $('#waitDiv').hide();
         
         this.esercizio = angular.copy(ex);
         this.idDettaglioPacchetto     = this.esercizio.id_pkt;
         this.idDettaglioEsercizio     = this.esercizio.id_ex;
         this.idDettaglioGruppo        = this.esercizio.id_grp;
         this.titoloDettaglioEsercizio = this.esercizio.nome;
         this.descrDettaglioEsercizio  = this.esercizio.descr;
         
         console.log("DEBUG: dettaglioEsercizio " + this.idDettaglioPacchetto + " " + this.idDettaglioEsercizio);
            
         serviceListNeuroApp.loadDetailExercice('NeuroApp.lista_dettaglio_esercizio', ex.id_pkt, ex.id_ex)
         .then (
            function successCallback(response)
            {
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  $('#waitDiv').hide();
                  custom_error(response.data,'Errore');
                  return;
               }
               
               self.img_esercizio = [];
               self.video_esercizio = [];
               self.audio_esercizio = [];
               
               var values = response.data;
               for (var j=0; j<values.length; j++)
               {
                  var dettaglio = {
                     id_pkt     : values[j].id_pkt,
                     id_ex      : values[j].id_ex,
                     id_media   : values[j].id_media,
                     url_media  : values[j].url_media,
                     media_tipo : values[j].media_tipo,
                     media_descr: values[j].media_descr
                  }
                  if (dettaglio.media_tipo=='video')
                     self.video_esercizio.push( dettaglio );
                  else if (dettaglio.media_tipo=='audio')
                     self.audio_esercizio.push( dettaglio );
                  else if (dettaglio.media_tipo=='image')
                     self.img_esercizio.push( dettaglio );
               }
               
               var pagina = self.buildPaginaDettaglioEsercizio();
               //console.log(pagina);
               $('#div_media_list').html(pagina);
               
               self.view_pacchetti_visible = false;
               self.view_esercizi_visible = false;
               self.dett_esercizio_visible = true;
               
               if (success_callback !=null)
                  success_callback();
               
               $('#waitDiv').hide();
            },
            function errorCallback(response) {
               console.log("***response***" + response.data );
               $('#waitDiv').hide();
               if ( angular.isString(response.data) ) {
                  custom_error(response.data,'Errore');
               } else {
                  custom_error("Server error",'Errore');
               }
            }
         );
      } // this.dettaglioEsercizio
      
      
      /**
       * Crea la pagina html di dettaglio dell'esercizio selezionato con la 
       * parte contenente la lista dei suoi elementi multimediali
       **/
      this.buildPaginaDettaglioEsercizio = function()
      {
         //console.log("DEBUG: buildPaginaDettaglioEsercizio " + this.idDettaglioPacchetto + " " + this.idDettaglioEsercizio);
         
         var html= "";
         
         if ( this.img_esercizio.length > 0 )
         {
            html = "<label class='tipo-media'>Immagini</label>"+
                   "<div class='row' style='background-color:rgb(55,62,94);border-radius:6px;padding-top:20px'>";
            
            // IMMAGINI
            for (var j=0; j<this.img_esercizio.length; j++)
            {
               var img = this.img_esercizio[j];
               
               var s =
                "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3' style='margin-bottom:20px'>"+
                "  <div class='thumbnail thumbnail-2 shadow'>"+
                "       <img class='img-responsive' src='"+img.url_media+"' onclick=\"openImageEsercizio('"+img.media_descr+"','"+img.url_media+"')\">"+
                "    <div class='caption'>"+

                "<table width=100%><tr>"+
                "   <td><label class='descr-media'>"+self.truncDescr(img.media_descr,100)+"</td>"+
                "  <td valign=top style='width:32px;'><span class='glyphicon glyphicon-trash trash-2' onclick=\"bridge.cancellaMedia("+img.id_media+")\"></span></td>"+
                "</tr></table>"+
                "    </div>"+
                "  </div>"+
                "</div>";

               /***
               var s =
                  "<div class='col-xs-6 col-sm-6 col-md-3 col-lg-3' style='cursor:pointer'>"+
                  "   <table>"+
                  "   <tr><td><img src='./images/remove-icon1.png' style='z-index:100;width:28px;position:relative;top:30px;left:2px'"+
                  "   onclick=\"bridge.cancellaMedia("+img.id_media+")\"></td></tr>"+
                  "   <tr><td><img class='shadow video' src='"+img.url_media+"' onclick=\"openImageEsercizio('"+img.media_descr+"','"+img.url_media+"')\"></td></tr>"+
                  "   <tr><td><p class='descr-media'>"+img.media_descr+"</p></td></tr>"+
                  "   </table>"+
                  "</div>";
               **/
               html += s;
            }
            html += "</div>";
         } // IMMAGINI
         
         
         if ( this.video_esercizio.length > 0 )
         {
            html += "<br>"+
                    "<label class='tipo-media'>Video</label>"+
                    "<div class='row display-flex' style='background-color:rgb(55,62,94);border-radius:6px;padding-top:20px;'>";
            
            // VIDEO  
            for (var j=0; j<this.video_esercizio.length; j++)
            {
               var video = this.video_esercizio[j];
               var s =
                "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3' style='cursor:pointer;margin-bottom:20px'>"+
                "  <div class='thumbnail thumbnail-2 shadow'>"+
                "     <div class='embed-responsive embed-responsive-16by9'>"+
                "       <video onclick=\"playVideo('"+video.media_descr+"','"+video.url_media+"')\"><source class='embed-responsive-item' src='"+video.url_media+"#t=3'></video>"+
                "     </div>"+
                "    <div class='caption'>"+
                "       <table width=100%><tr>"+
                "         <td><label class='descr-media'>"+self.truncDescr(video.media_descr,100)+"</td>"+
                "         <td valign=top style='width:32px;'><span class='glyphicon glyphicon-trash trash-2' onclick=\"bridge.cancellaMedia("+video.id_media+")\"></span></td>"+
                "       </tr></table>"+
                "    </div>"+
                "  </div>"+
                "</div>";
                
               html += s;
            }
            html += "</div>";
         } // VIDEO
         
         
         if ( self.audio_esercizio.length)
         {
            html +=  "<br>"+
                     "<label class='tipo-media'>Audio</label>"+
                     "<div class='row display-flex' style='padding-top:20px;background-color:rgb(55,62,94);border-radius:6px'>";
            
            // AUDIO
            for (var j=0; j<self.audio_esercizio.length; j++)
            {
               var audio = self.audio_esercizio[j];
               var s= 
                  "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-4' style='cursor:pointer;margin-bottom:20px'>"+
                  "<div class='thumbnail thumbnail-2 shadow' style='padding-top:10px;'>"+
                  "    <center>"+
                  "    <audio controls> <source src='"+audio.url_media+"'></audio>"+
                  "    </center>"+
                  "    <div class='caption'>"+
                  "    <table width=100%><tr>" +
                  "      <td><label class='descr-media'>"+self.truncDescr(audio.media_descr,100)+"</td>"+
                  "      <td valign=top style='width:32px;'><span class='glyphicon glyphicon-trash trash-2' onclick=\"bridge.cancellaMedia("+audio.id_media+")\"></span></td>"+
                  "    </tr></table>"+
                  "    </div>"+
                  "</div>"+
                  "</div>";
               html += s;
               //console.log (s);
            }
            html += "</div>";
         }
         return html;
      } // this.buildPaginaDettaglioEsercizio

      
      
      /**
       * Apre la finestra modale con la lista dei video o audio o immagini disponibili sullo store,
       * esclude gli elementi gia' inseriti sull'esercizio.
       *
       * tipo_media: 'video', 'audio', 'image'
       */
      this.openModalAggiungiMedia = function(tipo_media)
      {
         // Costruisce la lista con gli id dei video/audio/image gia' assegnati all'esercizio corrente,
         // lista di interi separati da virgola
         
         var lista_id = "";
         var media;
         
         if (tipo_media=='video')
            media = self.video_esercizio;
         else if (tipo_media=='audio') 
            media = self.audio_esercizio;
         else if (tipo_media=='image') 
            media = self.img_esercizio;
         else {
            custom_error("Tipo media sconosciuto: <i>"+tipo_media+"</i>",'Errore');
            return;
         }
            
         for (var j=0; j< media.length; j++) {
            lista_id += ( media[j].id_media + "," );
         }
         // toglie la ultima virgola
         if (lista_id.length > 0) {
            lista_id = lista_id.substring(0,lista_id.length-1);
         }

         $('#waitDiv').show();
         serviceListNeuroApp.listaMedia(lista_id, tipo_media)
         .then (
            function successCallback(response) {            
               $('#waitDiv').hide();
               
               console.log(response.data);

               // Tutti gli elementi disponibili gia' inseriti
               if (response.data.length == 0) {
                  
                  if (tipo_media=='video')
                     custom_info("L'esercizio contiene tutti i file video nello store");
                  else if (tipo_media=='audio')
                     custom_info("L'esercizio contiene tutti i file audio nello store");
                  else
                     custom_info("L'esercizio contiene tutte le immagini nello store");
               }
               else {
                  $("#myFetch_"+tipo_media).modal();
               }
            
               var initialParams = {
                  noPager: true,
                  count: response.data.length
               };
               var initialSettings = {
                  counts: [],
                  dataset: response.data
               };
               
               if (tipo_media=='video') {
                  self.tableParamsVideo = new NgTableParams( initialParams, initialSettings);
                  self.tableParamsVideo.reload();
               }
               else if (tipo_media=='audio') {
                  self.tableParamsAudio = new NgTableParams( initialParams, initialSettings);
                  self.tableParamsAudio.reload();
               }
               else {
                  self.tableParamsImage = new NgTableParams( initialParams, initialSettings);
                  self.tableParamsImage.reload();
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
      } // this.openModalAggiungiMedia
   
      /**
       * Aggiunge all'esercizio attuamente mostrato in dettaglio l'elemento multimediale cliccato
       * tipo_media : video, audio, image
       */
      this.aggiungiMedia = function(id_media, tipo_media) {
         console.log('DEBUG: aggiungi video ' + this.idDettaglioPacchetto + " " + this.idDettaglioEsercizio + " " + id_media);
         
         $('#waitDiv').show();
         
         serviceListNeuroApp.aggiungiMedia('NeuroApp.aggiungi_media_esercizio', this.idDettaglioPacchetto, this.idDettaglioEsercizio, id_media)
         .then (
            function successCallback(response) {
               $('#waitDiv').hide();
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  // aggiorna il pannello con gli elementi multimediali dell'esercizio
                  self.dettaglioEsercizio(self.esercizio, function() {
                     
                     // aggiorna, in caso di successo, la finestra con la lista dei video, o audio, o immagini
                     if (tipo_media=='video')
                        self.openModalAggiungiMedia('video');
                     else if (tipo_media=='audio')
                        self.openModalAggiungiMedia('audio');
                     else if (tipo_media=='image')
                        self.openModalAggiungiMedia('image');
                  });

                  custom_info('Elemento multimediale aggiunto');
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
      } // this.aggiungiMedia
      

      /**
       * Rimuove un elemento multimediale da un esercizio dopo averne chiesto
       * la conferma con una popup
       */
      this.confermaCancellaMedia = function (id_media)
      {
         console.log("DEBUG: confermaCancellaMedia " + this.idDettaglioPacchetto + " " + this.idDettaglioEsercizio + " " + id_media);
         console.log("DEBUG: video len " +this.video_esercizio.length);
         
         bootbox.dialog ({
             title: "<h3>Cancella Media</h3>", 
             message: "<h4>Conferma rimozione elemento multimediale</h4>",
             draggable:true,
             buttons:{
               "Annulla":{
                  className:"btn-default btn-md"
               }, 
               "Rimuovi" : { 
                  className:"btn-danger btn-md",
                  callback: function(){
                     self.cancellaMedia(id_media);
                  } // end callback
               } // end Delete
            } // end buttons
         }); // bootbox.dialog
      } // this.confermaCancellaMedia
      

      /**
       * Cancella un elemento multimediale dall'esercizio attualmente mostrato in dettaglio
       **/
      this.cancellaMedia = function (id_media)
      {
         console.log("DEBUG: cancellaMedia " + this.idDettaglioPacchetto + " " + this.idDettaglioEsercizio + " " + id_media);
         
         $('#waitDiv').show();
         
         serviceListNeuroApp.cancellaMedia('NeuroApp.cancella_media_esercizio', this.idDettaglioPacchetto, this.idDettaglioEsercizio, id_media)
         .then (
            function successCallback(response) {
               $('#waitDiv').hide();
               if ( angular.isString(response.data) && response.data.startsWith('Exception') ) {
                  custom_error(response.data,'Errore');
                  return;
               }
               else {
                  self.dettaglioEsercizio(self.esercizio);
                  custom_info('Elemento multimediale cancellato');
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
      } // this.cancellaMedia()
      

      // Stato di inizializzazione della lista dei pacchetti
      this.initialized = false;
      
      
      /**
       * Richiamata quando si preme il pulsante "Pacchetti" nella barra di navigazione,
       * usata per inizializzare la lista dei pacchetti che viene mostrata nella pagina.
       */
      this.initPagePacchetti = function () {
         if  ( !this.initialized ) {
            this.initialized = true;
            this.init();
            this.view_pacchetti_visible = true;
            this.view_esercizi_visible  = false;
            this.dett_esercizio_visible = false;
         }
      }

      
      /**
       * Richiamata quando, nella pagina di dettaglio, si preme l'icona di back
       * per tornare a visualizzare la lista dei pacchetti di esercizi.
       */
      this.setPacchettiVisible = function () {
         this.view_pacchetti_visible = true;
         this.view_esercizi_visible  = false;
         this.dett_esercizio_visible = false;
      }
      
      
      this.setEserciziPacchettoVisible = function(value) {
         this.view_esercizi_visible = value;
      }
      
      this.init = function() {
         //console.log("init");
         this.loadGruppi();
         this.loadGruppiPatologie();
         this.loadPacchetti();
      }
   } // end controller pacchettiController
   
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
   app.directive ('ngImport', function($templateRequest, $anchorScroll, $animate, $sce){
    return {
      restrict: 'ECA',
      priority: 400,
      terminal: true,
      transclude: 'element',
      controller: 'pacchettiController',
      controllerAs: 'ctrl',
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
          
          //console.log(' direttiva ngImport ' + srcExp);

          //scope.$watch($sce.trustAsResourceUrl($sce.parseAsResourceUrl(srcExp)), function ngIncludeWatchAction(src) {
            scope.$watch( $sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {

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
              //console.log("prima di emit insertContentRequested ");
              scope.$emit('$insertContentRequested', src);
              //console.log("dopo di emit insertContentRequested ");
            } else {
              cleanupLastInsertContent();
              $ctrl0.template = null;
            }
          });
        };
      }
    };
  }); // directive: ngImport
  
   app.directive('ngImport', function ($compile) {
    return {
      restrict: 'ECA',
      priority: -400,
      require: 'ngImport',

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


