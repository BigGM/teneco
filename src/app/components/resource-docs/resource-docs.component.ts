import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { NeuroAppService } from '../../services/neuro-app.service'
import { ResourceDocsService } from '../../services/resource-docs/resource-docs.service'
import { NeuroApp } from '../../neuro-app';
import { RecordMedia } from '../../record-media'

declare var $ : any;
declare var bootbox: any;


@Component({
  selector: 'app-resource-docs',
  templateUrl: './resource-docs.component.html',
  styleUrls: ['./resource-docs.component.css']
})
export class ResourceDocsComponent implements OnInit {
  
  // lista dei documenti presenti nel DB
  lista_docs :  RecordMedia[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;
  
  // l'array 'icons' associa una icona ad un estensione
  readonly icons: { [id: string]: string } = {
    '.txt'  :  "txt-icon.png",
    '.doc'  :  "word-icon.png",
    '.docx' :  "word-icon.png",
    '.docm' :  "word-icon.png",
    '.rtf'  :  "word-icon.png",
    '.pdf'  :  "pdf-icon.png",
    '.xls'  :  "xls-icon.png",
    '.xlsx' :  "xls-icon.png"
  }

  // path delle immagini
  readonly root_images = "../../../assets/images/"


  /**
   * Costruttore
   * @param neuroAppService 
   * @param docService 
   */
  constructor (
      private neuroAppService : NeuroAppService,
      private docService      : ResourceDocsService
  ) {
    console.log( "ResourceDocsComponent=> constructor" )
    this.lista_docs = []
    this.mediaSubscr = null
  }


  ngOnInit() {
    console.log( "ResourceDocsComponent=> OnInit" )
    if (this.lista_docs)
      console.log( this.lista_docs.length )
    this.loadDocs()
  }


  ngOnDestroy() {
    console.log( "ResourceDocsComponent => OnDestroy" )
    if (this.mediaSubscr)
      this.mediaSubscr.unsubscribe()
  }
  

  /**
  * Carica la lista dei documenti presenti sul database 
  */
  loadDocs() {
    console.log("ResourceDocsComponent.loadDocs")
    
    $('#waitDiv').show();
    this.lista_docs = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'doc'
    NeuroApp.showWait();
    
    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {
          NeuroApp.hideWait()
          this.lista_docs = result
          this.mediaSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.mediaSubscr.unsubscribe()
        }
      )
  } // loadDocs()


  /**
   * Ricarica la lista dei documenti. Il metodo viene richiamato quando la componente
   * child UploadDocComponent invia l'evento reloadDocsEvent
   * @param msg 
   */
  reloadDocsList(msg) {
    console.log("ResourceDocsComponent.reloadDocsList => reloadDocsEvent ", msg)
    this.loadDocs()
  }


  /**
   * Nome del documento dalla url in input
   */
  docName(url) {
    return this.docService.docName(url)
  }

  /**
  * Estensione del documento (compreso il '.') dalla url in input
  */
  docExt(url) {
    return this.docService.docExt(url)
  }  


  /**
   * Restituise l'icona da inserire sulla pagina html in base all'estensione del documento. 
   * @param url
   */
  docIcon(url) {
    //console.log("docIcon", url)
    if ( this.icons[this.docExt(url)] == undefined )
      return this.root_images + "generic-doc-icon.png"
    else
      return this.root_images + this.icons[ this.docExt(url) ]
  }


  /**
   * Cancella dal database e dal file sistem il documento specificato.
   * @param doc 
   */
  confermaCancellaDoc(doc:RecordMedia) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione del documento <label style='color:rgb(180,0,0);'>\""+this.docName(doc.url_media)+"\"</label> ?</h6>";
      if ( doc.usato_media == 1)
        msg = "<h6><b>Il documento viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg + "</h6>"

      bootbox.dialog ({
        title: "<h4>Cancella Documento</h4>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-secondary btn-md"
          },
          "Rimuovi" : { 
              className: "btn-danger btn-md",
              callback: function() {
                self.cancellaDocumento(doc);
              } // end callback
          } // end Rimuovi
        } // end buttons
      }); // bootbox.dialog
    } // confermaCancellaDoc()



    cancellaDocumento(doc:RecordMedia) {
      console.log("ListaGlossarioComponent.cancellaDocumento")
      $('#waitDiv').show()
    
      NeuroApp.showWait()
    
      let serv = this.docService.rimuoviDocumento(doc)
      this.mediaSubscr = serv.subscribe (
        result => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info("Documento cancellato")
          // Aggiorna la lista delle voci di glossario
          this.loadDocs()
        },
        error => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
      )
    } // cancellaDocumento()
}
