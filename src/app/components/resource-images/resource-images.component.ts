import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
}  from '@angular/core';
import { Subscription } from 'rxjs';

import { NeuroAppService } from '../../services/neuro-app.service'
import { NeuroApp } from '../../neuro-app';
import { RecordMedia } from '../../classes/record-media'
import { DynamicUploadComponent } from '../dynamic-upload/dynamic-upload.component'

declare var NeuroAppJS : any
declare var $ : any
declare var bootbox: any

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/images_upload.php"

@Component({
  selector: 'app-resource-images',
  templateUrl: './resource-images.component.html',
  styleUrls: ['./resource-images.component.css']
})
export class ResourceImagesComponent implements OnInit, OnDestroy {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  // lista delle immagini presenti nel DB
  lista_images :  RecordMedia[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;

  // root path delle icone
  readonly root_images = NeuroApp.ROOT_ICONS


  // Vista a griglia o lista
  view_images_as : string = "grid"

  // l'imagine da mostrare sulla finetra modale
  curr_image: RecordMedia = null

  // Accesso al tag ng-template referenziato come dynamic_container
  @ViewChild('dynamic_file_uploader', { read: ViewContainerRef }) entry: ViewContainerRef;
  
  componentUploadRef: any

  
  /**
   * Costruttore
   * @param neuroAppService 
   * @param docService 
   */
  constructor (
    private neuroAppService : NeuroAppService,
    //private imageService    : ResourceImagesService,
    private resolver        : ComponentFactoryResolver
  ) {
    console.log( "ResourceImagesComponent=> constructor" )
    this.lista_images = []
    this.mediaSubscr = null
  }

  ngOnInit() {
    console.log( "ResourceImagesComponent=> OnInit" )
    this.view_images_as = "grid"
    if (this.lista_images)
      console.log( this.lista_images.length )
    this.listaImmagini()

    this.componentUploadRef = null;
    this.createComponentUpload (
      "Upload Immagini",
      "file-image-upload",
      "image/*")
  }
    
  ngOnDestroy() {
    console.log( "ResourceImagesComponent => OnDestroy" )
    if (this.mediaSubscr)
      this.mediaSubscr.unsubscribe()

    if ( this.componentUploadRef ) {
      this.componentUploadRef.destroy()  
    }
  }

  createComponentUpload (
    title:string,
    id_file_upload:string,
    accept:string) {

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
      this.reloadImages(event)
    })
  }

  /**
   * Attiva la visualizzazione a lista
   */
  viewAsList(){
    console.log("viewAsList")
    if (this.view_images_as=="list")
      return

    $('#div-view-images-as-grid').animate({opacity:0},400, () =>{
      this.view_images_as = "list"
    })
  }

  /**
   * Attiva la visualizzazione a griglia
   */
  viewAsGrid(){
    console.log("viewAsGrid")
    if (this.view_images_as == "grid")
      return
    $('#div-view-images-as-list').animate({opacity:0},400, () =>{
      this.view_images_as = "grid"
    })
  }


  /**
  * Carica la lista delle immagini presenti sul sistema
  */
  listaImmagini() {
    console.log("ResourceImagesComponent.listaImmagini")

    $('#waitDiv').show();
    this.lista_images = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'image'
    NeuroApp.showWait();

    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {
          
          result.map(image => {
            if (NeuroAppJS.DEVELOP_ENV)
              image.url_media = NeuroApp.G_URL_ROOT +  "/" +image.url_media
            console.log(image.url_media)
          })

          NeuroApp.hideWait()
          this.lista_images = result
          this.mediaSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.mediaSubscr.unsubscribe()
        }
    )
  } // listaImmagini()


  /**
   * Ricarica la lista delle immagini. Il metodo viene richiamato quando la componente
   * child UploadImagesComponent invia l'evento reloadImagesEvent
   * @param msg 
   */
  reloadImages(msg) {
    console.log("ResourceImagesComponent.reloadImages => reloadImagesEvent received", msg)
    this.listaImmagini()
  }

   /**
   * Richiede conferma di cancellazione di una immagine dal database e se confermato
   * esegue l'azione.
   * @param image
   */
  confermaCancellaImage(image:RecordMedia) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione dell'immagine<br><label style='word-break:break-all;color:rgb(180,0,0);'>\""+NeuroApp.fileName(image.url_media)+"\"&nbsp;?</label></h6>";
      if ( image.usato_media == 1)
        msg = "<h6><b>L'immagine viene usata in uno o pi&ugrave; esercizi. </b><br> " + msg + "</h6>"

      bootbox.dialog ({
        title: "<h3>Cancella Immagine</h3>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-dark btn-md"
          },
          "Rimuovi" : { 
              className: "btn-danger btn-md",
              callback: function() {
                self.cancellaImage(image);
              } // end callback
          } // end Rimuovi
        } // end buttons
      }); // bootbox.dialog
    } // confermaCancellaImage()


    /**
     * Rimuove una immagine dal DB e dal file sistem.
     * @param image l'immagine da cancellare
     */
    cancellaImage(audio:RecordMedia) {
      console.log("ResourceImagesComponent.cancellaImage")
      $('#waitDiv').show()
    
      NeuroApp.showWait()
    
      let serv = this.neuroAppService.rimuoviMedia(audio,'audio')
      this.mediaSubscr = serv.subscribe (
        result => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info("Immagine cancellata")
          // Aggiorna la lista delle immagini
          this.listaImmagini()
        },
        error => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
      )
    } // cancellaImage()


    /**
     * 
     * @param audio l'elemento multimediale con l'audio
     */
    openModalImage(image:RecordMedia) {
      this.curr_image = image
      // e la attiva
      $("#modalImageList").modal();

      $('#modalImageList').on('hidden.bs.modal', (e) => {
          this.curr_image = null
      })
    } // openModalImage


    showTrashcan(id_media:number) {
      console.log("showTrashcan", id_media)
      $('#'+id_media).animate({opacity:1}, 400)
    }
    hideTrashcan(id_media:number) {
      $('#'+id_media).animate({opacity:0}, 400)
    }
}
