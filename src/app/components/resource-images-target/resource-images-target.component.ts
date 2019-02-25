import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroAppService } from '../../services/neuro-app.service'
import { NeuroApp } from '../../neuro-app';
import { RecordImageTarget } from '../../classes/record-image-target'
import { UploadImagesTargetComponent } from './upload-images-target/upload-images-target.component';

declare var NeuroAppJS : any
declare var $ : any
declare var bootbox: any

@Component({
  selector: 'app-resource-images-target',
  templateUrl: './resource-images-target.component.html',
  styleUrls: ['./resource-images-target.component.css']
})
export class ResourceImagesTargetComponent implements OnInit, OnDestroy, AfterViewInit  {

  // lista dei documenti presenti nel DB
  lista_images :  RecordImageTarget[];

  // per la registrazione al servizio di accesso alle procedure del DB
  imgSubscr:  Subscription;

    // Accesso alla component child che esegue l'upload
  @ViewChild(UploadImagesTargetComponent) uploadComponent: UploadImagesTargetComponent;


  constructor( private neuroAppService : NeuroAppService) {
    //console.log( "ResourceImagesTargetComponent=> constructor" )
    this.lista_images = []
    this.imgSubscr = null
  }


  ngAfterViewInit() {
    //console.log( "ResourceImagesTargetComponent=> AfterViewInit" )
    //console.log("*** uploadComponent **** ", this.uploadComponent);

    // Si sottoscrive al component child di upload che emette un messaggio
    // alla fine dell'upload, in questo modo si puo' aggiornare la lista delle immagini
    this.uploadComponent.messageEvent.subscribe ( (msg:string) => {
      this.listaImmagini()
    })
  }  

  
  ngOnInit() {
    //console.log( "ResourceImagesTargetComponent=> OnInit" )
    if (this.lista_images)
      console.log( this.lista_images.length )
    this.listaImmagini()
  }

  ngOnDestroy() {
    //console.log( "ResourceImagesTargetComponent => OnDestroy" )
    if (this.imgSubscr)
      this.imgSubscr.unsubscribe()
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
    this.imgSubscr = serv.subscribe(
        result => {
          result.map(image => {
            RecordImageTarget.decode(image)
            if (NeuroAppJS.DEVELOP_ENV)
              image.url = NeuroApp.G_URL_ROOT +  "/" +image.url
            //console.log(image)
          })

          NeuroApp.hideWait()
          this.lista_images = result
          this.imgSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.imgSubscr.unsubscribe()
        }
    )
  } // listaImmagini()


  /**
   * Richiede conferma di cancellazione di una immagine dal database e se confermato
   * esegue l'azione.
   * @param image
   */
  confermaCancellaTarget(image:RecordImageTarget) {
    let self = this

      let msg="<h6 style='line-height:1.6'>Conferma rimozione dell'immagine<br><label style='word-break:break-all;color:rgb(180,0,0);'>\""+NeuroApp.fileName(image.nome)+"\"&nbsp;?</label></h6>";
      
      bootbox.dialog ({
        title: "<h4>Cancella Immagine</h4>", 
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
    } // confermaCancellaTarget()


    /**
     * Rimuove una immagine dal DB e dal file sistem.
     * @param image l'immagine da cancellare
     */
    cancellaImage(image: RecordImageTarget) {
      $('#waitDiv').show()
    
      NeuroApp.showWait()
    
      let serv = this.neuroAppService.cancellaTarget(image)
      this.imgSubscr = serv.subscribe (
        result => {
          this.imgSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info("Immagine target cancellata")
          // Aggiorna la lista delle immagini
          this.listaImmagini()
        },
        error => {
          this.imgSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
      )
    } // cancellaImage()
}