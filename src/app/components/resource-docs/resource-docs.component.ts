import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
}  from '@angular/core';
import { Subscription } from 'rxjs';

import { NeuroAppService } from '../../services/neuro-app.service'
//import { ResourceDocsService } from '../../services/resource-docs/resource-docs.service'
import { NeuroApp } from '../../neuro-app';
import { RecordMedia } from '../../classes/record-media'
import { DynamicUploadComponent } from '../dynamic-upload/dynamic-upload.component'

declare var $ : any;
declare var bootbox: any;
declare var NeuroAppJS: any;

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/docs_upload.php";

@Component({
  selector: 'app-resource-docs',
  templateUrl: './resource-docs.component.html',
  styleUrls: ['./resource-docs.component.css']
})
export class ResourceDocsComponent implements OnInit {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;
  
  // lista dei documenti presenti nel DB
  lista_docs :  RecordMedia[];

  // Registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;
  
  // Accesso al tag ng-template referenziato nel .html come 'dynamic_file_uploader'
  @ViewChild('dynamic_file_uploader', { read: ViewContainerRef }) entry: ViewContainerRef;
  

  // Riferimento al componente dinamico per effettuare l'upload
  componentUploadRef: any


  /**
   * Costruttore
   * @param neuroAppService 
   * @param docService 
   */
  constructor (
      private neuroAppService : NeuroAppService,
      //private docService      : ResourceDocsService,
      private resolver        : ComponentFactoryResolver
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

    this.componentUploadRef = null;
    this.createComponentUpload (
      "Upload Documenti",
      "file-doc-upload",
      ".xlsx,.xls,.doc,.docx,.txt,.pdf, .rtf")
  }

  ngOnDestroy() {
    console.log( "ResourceDocsComponent => OnDestroy" )
    if (this.mediaSubscr)
      this.mediaSubscr.unsubscribe()
    
      if ( this.componentUploadRef ) {
        this.componentUploadRef.destroy()  
      }
  }


  /**
   * Crea una istanza del componente dinamico di upload.
   * 
   * @param title           : il titolo inserito nella interfaccia di upload
   * @param id_file_upload  : identificativo del campo html di <input type=file ...>
   * @param accept          : il valore dell'attributo accept per il campp di input
   */
  createComponentUpload ( title:string,
                          id_file_upload:string,
                          accept:string )
  {

    if ( this.componentUploadRef ) {
      this.componentUploadRef.destroy()  
    }
    
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(DynamicUploadComponent);
    this.componentUploadRef = this.entry.createComponent(factory);
    let component = <DynamicUploadComponent>this.componentUploadRef.instance
    component.title = title;
    component.id_file_upload = id_file_upload
    component.accept = accept
    component.uploader.options.url = URL_UPLOAD

    // Si sottoscrive al componente per ricevere messaggi emessi dal child
    component.messageEvent.subscribe( event => {
      console.log("Messaggio ricevuto dal child =>", event)
      this.reloadDocsList(event)
    })
  }


  /**
  * Carica la lista di tutti i documenti presenti sul sistema. 
  */
  loadDocs() {
    console.log("ResourceDocsComponent.loadDocs")
    NeuroApp.showWait();
    this.lista_docs = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'doc'
    
    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {

          result.map(doc => {
            if (NeuroAppJS.DEVELOP_ENV)
              doc.url_media = NeuroApp.G_URL_ROOT +  "/" + doc.url_media
            console.log(doc.url_media)
          })

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
    return NeuroApp.fileName(url)
  }

  /**
  * Estensione del documento (compreso il '.') dalla url in input
  */
  docExt(url) {
    return NeuroApp.fileExt(url)
  }


  /**
   * Restituise l'icona da inserire sulla pagina html in base all'estensione del documento. 
   * @param url
   */
  docIcon(url) {
    if ( NeuroApp.icons[NeuroApp.fileExt(url)] == undefined )
      return NeuroApp.ROOT_ICONS + "/generic-doc-icon.png"
    else
      return NeuroApp.ROOT_ICONS + "/" + NeuroApp.icons[ NeuroApp.fileExt(url) ]
  }


  /**
   * Cancella dal database e dal file sistem il documento specificato.
   * @param doc 
   */
  confermaCancellaDoc(doc:RecordMedia) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione del documento<br><label style='word-break:break-all;color:rgb(180,0,0);'>\""+NeuroApp.fileName(doc.url_media)+"\"&nbsp;?</label></h6>";
      if ( doc.usato_media == 1)
        msg = "<h6><b>Il documento viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg + "</h6>"

      bootbox.dialog ({
        title: "<h3>Cancella Documento</h3>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-dark btn-md"
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


    /**
     * Rimuove un documento dal DB.
     * @param doc il documento da cancellare
     */
    cancellaDocumento(doc:RecordMedia) {
      console.log("ListaGlossarioComponent.cancellaDocumento")
    
      NeuroApp.showWait()
    
      let serv = this.neuroAppService.rimuoviMedia(doc,'doc')
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
