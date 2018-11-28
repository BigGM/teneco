import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';

import { Subscription } from 'rxjs';

import { NeuroAppService } from '../../services/neuro-app.service'
//import { ResourceVideoService } from '../../services/resource-video/resource-video.service'
import { NeuroApp } from '../../neuro-app';

import { RecordMedia } from '../../record-media'
import { DynamicUploadComponent } from '../dynamic-upload/dynamic-upload.component'

declare var $ : any;
declare var bootbox: any;
declare var NeuroAppJS:any;

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/video_upload.php";

@Component({
  selector: 'app-resource-video',
  templateUrl: './resource-video.component.html',
  styleUrls: ['./resource-video.component.css']
})
export class ResourceVideoComponent implements OnInit {

  // lista dei video presenti nel sistema
  lista_video :  RecordMedia[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;

    // Vista a griglia o lista
  view_video_as : string = "grid"

  // il file video presentato sulla finestra modale
  curr_video : RecordMedia = null

  // Accesso al tag ng-template referenziato come dynamic_container
  @ViewChild('dynamic_file_uploader', { read: ViewContainerRef }) entry: ViewContainerRef;
  
  componentUploadRef: any
  
  /**
   * Costruttore
   * @param neuroAppService 
   * @param videoService 
   */
  constructor (
    private neuroAppService : NeuroAppService,
    //private videoService    : ResourceVideoService,
    private resolver        : ComponentFactoryResolver
  ) {
    console.log( "ResourceVideoComponent=> constructor" )
    this.lista_video = []
    this.mediaSubscr = null
  }


  ngOnInit() {
    console.log( "ResourceVideoComponent=> OnInit" )
    this.view_video_as = "list"
    if (this.lista_video)
      console.log( this.lista_video.length )
    this.listaFileVideo()

    this.componentUploadRef = null;
    this.createComponentUpload (
      "Upload Video",
      "file-video-upload",
      "video/*")
  }
    
  ngOnDestroy() {
    console.log( "ResourceVideoComponent => OnDestroy" )
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
      this.reloadVideoList(event)
    })
  }

  /**
   * Attiva la visualizzazione a lista
   */
  viewAsList(){
    console.log("viewAsList")
    if (this.view_video_as=="list")
      return

    $('#div-view-video-as-grid').animate({opacity:0},400, () =>{
      this.view_video_as = "list"
    })
  }

  /**
   * Attiva la visualizzazione a griglia
   */
  viewAsGrid(){
    console.log("viewAsGrid")
    if (this.view_video_as == "grid")
      return
    $('#div-view-video-as-list').animate({opacity:0},400, () =>{
      this.view_video_as = "grid"
    })
  }


    /**
    * Carica la lista dei file video presenti sul database 
    */
  listaFileVideo() {
    console.log("ResourceVideoComponent.listaFileVideo")

    NeuroApp.showWait()
    this.lista_video = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'video'
    NeuroApp.showWait();

    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {

          result.map(video => {
            if ( NeuroAppJS.DEVELOP_ENV )
               video.url_media = NeuroApp.G_URL_ROOT +  "/" + video.url_media
            //.log(video.url_media)
          })

          NeuroApp.hideWait()
          this.lista_video = result
          this.mediaSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.mediaSubscr.unsubscribe()
        }
    )
  } // listaFileVideo()


  /**
   * Ricarica la lista dei file video. Il metodo viene richiamato quando la componente
   * child UploadVideoComponent invia l'evento reloadVideoEvent
   * @param msg 
   */
  reloadVideoList(msg) {
    console.log("ResourceVideoComponent.reloadVideoList => reloadVideoEvent received", msg)
    this.listaFileVideo()
  }


  /**
   * Richiede conferma di cancellazione di un file video dal sistema e se confermato
   * esegue l'azione.
   * @param video
   */
  confermaCancellaVideo(video:RecordMedia) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione del file<br> <label style='word-break:break-all;color:rgb(180,0,0);'>\""+NeuroApp.fileName(video.url_media)+"\"&nbsp;?</label></h6>";
      if ( video.usato_media == 1)
        msg = "<h6><b>Il file video viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg + "</h6>"

      bootbox.dialog ({
        title: "<h4>Cancella Video</h4>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-secondary btn-md"
          },
          "Rimuovi" : { 
              className: "btn-danger btn-md",
              callback: function() {
                self.cancellaVideo(video);
              } // end callback
          } // end Rimuovi
        } // end buttons
      }); // bootbox.dialog
    } // confermaCancellaVideo()


    /**
     * Rimuove un file video dal sistema
     * @param video il video da cancellare
     */
    cancellaVideo(video:RecordMedia) {
      console.log("ResourceVideoComponent.cancellaVideo")
      NeuroApp.showWait()
    
      let serv = this.neuroAppService.rimuoviMedia(video,'video')
      this.mediaSubscr = serv.subscribe (
        result => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info("Video cancellato")
          // Aggiorna la lista dei file video
          this.listaFileVideo()
        },
        error => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
      )
    } // cancellaVideo()


    /**
     * @param video l'elemento multimediale con il video da avviare
     */
    openModalVideo(video:RecordMedia) {
      this.curr_video = video
      //console.log("openModalVideo", video)
      $("#modalVideoList").modal('show');
    } // openModalVideo


    /**
     * @param video l'elemento multimediale con il video da chiudere
     */
    closeModalVideo() {
      //console.log("closeModalVideo")
      $("#modalVideoList").modal('hide');
      this.curr_video = null
    }

}
