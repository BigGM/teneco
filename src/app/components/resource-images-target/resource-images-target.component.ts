import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroAppService } from '../../services/neuro-app.service'
import { NeuroApp } from '../../neuro-app';
import { RecordImageTarget } from '../../classes/record-image-target'

declare var NeuroAppJS : any
declare var $ : any
declare var bootbox: any

@Component({
  selector: 'app-resource-images-target',
  templateUrl: './resource-images-target.component.html',
  styleUrls: ['./resource-images-target.component.css']
})
export class ResourceImagesTargetComponent implements OnInit, OnDestroy {

  // lista dei documenti presenti nel DB
  lista_images :  RecordImageTarget[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;

  // root path delle icone
  readonly root_images = NeuroApp.ROOT_ICONS

  // Vista a griglia o lista
  view_images_as : string = "grid"

  // l'imagine da mostrare sulla finetra modale
  curr_image: RecordImageTarget = null

  constructor( private neuroAppService : NeuroAppService) {
    console.log( "ResourceImagesTargetComponent=> constructor" )
    this.lista_images = []
    this.mediaSubscr = null
  }

  ngOnInit() {
    console.log( "ResourceImagesTargetComponent=> OnInit" )
    this.view_images_as = "grid"
    if (this.lista_images)
      console.log( this.lista_images.length )
    this.listaImmagini()
  }

  ngOnDestroy() {
    console.log( "ResourceImagesTargetComponent => OnDestroy" )
    if (this.mediaSubscr)
      this.mediaSubscr.unsubscribe()
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
    console.log("ResourceImagesTargetComponent.listaImmagini")

    $('#waitDiv').show();
    this.lista_images = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'image'
    NeuroApp.showWait();

    let serv = this.neuroAppService.listaImagesTarget()
    this.mediaSubscr = serv.subscribe(
        result => {
          result.map(image => {
            RecordImageTarget.decode(image)
            if (NeuroAppJS.DEVELOP_ENV)
              image.url = NeuroApp.G_URL_ROOT +  "/" +image.url
            //console.log(image)
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
   *
  reloadImages(msg) {
    console.log("ResourceImagesTargetComponent.reloadImages => reloadImagesEvent received", msg)
    this.listaImmagini()
  } */

  /**
   * 
   * @param audio l'elemento multimediale con l'audio
   */
  openModalImage(image:RecordImageTarget) {
    this.curr_image = image
    // e la attiva
    $("#modalImageList").modal();

    $('#modalImageList').on('hidden.bs.modal', (e) => {
        this.curr_image = null
    })
  } // openModalImage

}
