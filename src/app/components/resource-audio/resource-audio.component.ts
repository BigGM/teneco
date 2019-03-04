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

declare var NeuroAppJS : any;
declare var $ : any;
declare var bootbox: any;

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/audio_upload.php";

@Component({
  selector: 'app-resource-audio',
  templateUrl: './resource-audio.component.html',
  styleUrls: ['./resource-audio.component.css']
})
export class ResourceAudioComponent implements OnInit, OnDestroy {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  // lista dei file audio presenti nel sistema
  lista_audio :  RecordMedia[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;

  // root path delle icone
  //readonly root_icons = NeuroApp.ROOT_ICONS

  // Vista a griglia o lista
  view_audio_as : string = "grid"

  // il file audio presentato sulla finestra modale
  curr_audio : RecordMedia = null

  // Accesso al tag ng-template referenziato come dynamic_container
  @ViewChild('dynamic_file_uploader', { read: ViewContainerRef }) entry: ViewContainerRef;
  
  componentUploadRef: any

  
  /**
   * Costruttore
   * @param neuroAppService 
   * @param audioService 
   */
  constructor (
    private neuroAppService : NeuroAppService,
    //private audioService    : ResourceAudioService,
    private resolver        : ComponentFactoryResolver
  ) {
    console.log( "ResourceAudioComponent=> constructor" )
    this.lista_audio = []
    this.mediaSubscr = null
  }


  ngOnInit() {
    console.log( "ResourceAudioComponent=> OnInit" )
    this.view_audio_as = "list"
    if (this.lista_audio)
      console.log( this.lista_audio.length )
    this.listaFileAudio()

    this.componentUploadRef = null;
    this.createComponentUpload (
      "Upload Audio",
      "file-audio-upload",
      "audio/*")
  }
    
  ngOnDestroy() {
    console.log( "ResourceAudioComponent => OnDestroy" )
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
      this.reloadAudioList(event)
    })
  }

  /**
   * Attiva la visualizzazione a lista
   */
  viewAsList(){
    console.log("viewAsList")
    if (this.view_audio_as=="list")
      return

    $('#div-view-audio-as-grid').animate({opacity:0},400, () =>{
      this.view_audio_as = "list"
    })
  }

  /**
   * Attiva la visualizzazione a griglia
   */
  viewAsGrid(){
    console.log("viewAsGrid")
    if (this.view_audio_as == "grid")
      return
    $('#div-view-audio-as-list').animate({opacity:0},400, () =>{
      this.view_audio_as = "grid"
    })
  }


  /**
  * Carica la lista dei file audio presenti sul database 
  */
  listaFileAudio() {
    console.log("ResourceAudioComponent.loadAudios")
    
    NeuroApp.showWait();
    this.lista_audio = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'audio'
  
    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {

          result.map(audio => {
            if (NeuroAppJS.DEVELOP_ENV)
              audio.url_media = NeuroApp.G_URL_ROOT +  "/" + audio.url_media
            console.log(audio.url_media)
          })

          NeuroApp.hideWait()
          this.lista_audio = result
          this.mediaSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.mediaSubscr.unsubscribe()
        }
    )
  } // listaFileAudio()

  
  /**
   * Ricarica la lista dei file audio. Il metodo viene richiamato quando la componente
   * child UploadAudioComponent invia l'evento reloadAudioEvent
   * @param msg 
   */
  reloadAudioList(msg) {
    console.log("ResourceAudioComponent.reloadAudioList => reloadAudioEvent received", msg)
    this.listaFileAudio()
  }


  /**
   * Richiede conferma di cancellazione di un file audio dal sistema e se confermato
   * esegue l'azione.
   * @param audio
   */
  confermaCancellaAudio(audio:RecordMedia) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione del file<br><label style='word-break:break-all;color:rgb(180,0,0);'>\""+NeuroApp.fileName(audio.url_media)+"\"&nbsp;?</label></h6>";
      if ( audio.usato_media == 1)
        msg = "<h6><b>Il file audio viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg + "</h6>"

      bootbox.dialog ({
        title: "<h3>Cancella Audio</h3>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-dark btn-md"
          },
          "Rimuovi" : { 
              className: "btn-danger btn-md",
              callback: function() {
                self.cancellaAudio(audio);
              } // end callback
          } // end Rimuovi
        } // end buttons
      }); // bootbox.dialog
    } // confermaCancellaAudio()


    /**
     * Rimuove un file audio dal DB.
     * @param audio l'audio da cancellare
     */
    cancellaAudio(audio:RecordMedia) {
      console.log("ResourceAudioComponent.cancellaAudio")
      $('#waitDiv').show()
    
      NeuroApp.showWait()
    
      let serv = this.neuroAppService.rimuoviMedia(audio,'audio')
      this.mediaSubscr = serv.subscribe (
        result => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info("Audio cancellato")
          // Aggiorna la lista dei file audio
          this.listaFileAudio()
        },
        error => {
          this.mediaSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
      )
    } // cancellaAudio()


    /**
     * 
     * @param audio l'elemento multimediale con l'audio
     */
    openModalAudio(audio:RecordMedia) {
      this.curr_audio = audio      
      $("#modalAudioList").modal();
    } // openModalAudio


    /**
     * @param video l'elemento multimediale con l'audio da avviare
     */
    closeModalAudio() {
      //console.log("closeModalAudio")
      $("#modalAudioList").modal('hide');
      this.curr_audio = null
    }

}
