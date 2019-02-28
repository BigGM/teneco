import { Component, OnInit, Input,  Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { NeuroApp} from '../../../neuro-app'
import { NeuroAppService } from '../../../services/neuro-app.service'
import { CommonUpload } from '../../../classes/common-upload'
import { Categoria } from '../../../classes/categoria'


// jQuery
declare var $ : any;

// libreria javascript
declare var NeuroAppJS : any;

// La url dello script php che esegue l'upload sul server
const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/images_target_upload.php"

@Component({
  selector: 'app-upload-images-target',
  templateUrl: './upload-images-target.component.html',
  styleUrls: ['./upload-images-target.component.css']
})
export class UploadImagesTargetComponent implements OnInit {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;


  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false
  public hasAnotherDropZoneOver:boolean = false

  // Lista delle categorie configurate sul db
  public lista_categorie: Categoria[]


  // per la registrazione al servizio di accesso alle procedure del DB
  subscr:  Subscription;


  // Evento destinato al parent per richiede di aggiornare la lista dei file dopo
  // un inserimento o una cancellazione
  @Output() messageEvent = new EventEmitter();

  constructor(private neuroAppService : NeuroAppService) {
    this.uploader = new FileUploader( {url: URL_UPLOAD} )
    this.lista_categorie = [];
    this.subscr = null
  }

  /**
   * Esegue l'upload sul server del FileItem in input usando il metodo comune della
   * classe Common.
   * @param item item da inviare al server
   */
  upload(item:FileItem) {
    UploadTarget.upload(item)
  }

  /**
   * Upload di tutti i file usando il metodo corrispondente della classe Common.
   */
  uploadAll() {
    UploadTarget.uploadAll(this.uploader)
  } // uploadAll()


  
  ngOnInit() {
    // Recupera la lista delle categorie dal DB
    this.listaCategorie()
    
    // CALLBACKS
    this.uploader.onWhenAddingFileFailed = (item /*{File|FileLikeObject}*/, filter, options) => {
      console.info('onWhenAddingFileFailed', item, filter, options);
    }
    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false
      console.info('onAfterAddingFile', fileItem)
        
    }
    this.uploader.onAfterAddingAll = (addedFileItems) => {
      console.info('onAfterAddingAll', addedFileItems)
    }
    this.uploader.onBeforeUploadItem = (fileItem) => {
      fileItem.formData.push( {descrizione: fileItem.formData['descrizione']} )
      fileItem.formData.push( {nome_target: fileItem.formData['nome_target'].trim() })
      fileItem.formData.push( {categoria: fileItem.formData['categoria']})
      console.info('onBeforeUploadItem', fileItem)
    }
    this.uploader.onProgressItem = (fileItem, progress) => {
      //console.info('onProgressItem', fileItem, progress)
      $('#file-upload-progress-bar').css('opacity', 1)
    }
    this.uploader.onProgressAll = (progress) => {
      //console.info('onProgressAll', progress);
    }
    this.uploader.onSuccessItem = (fileItem, response, status, headers) => {
      //console.info('onSuccessItem', fileItem, response, status, headers)
    }
    this.uploader.onErrorItem = (fileItem, response, status, headers) => {
      console.info('onErrorItem', fileItem, response, status, headers)

      if ( response.startsWith('Exception') ) {
        NeuroApp.custom_error(response,'Errore')
      }            
    }
    this.uploader.onCancelItem = (fileItem, response, status, headers) => {
      console.info('onCancelItem', fileItem, response, status, headers)
    }
    this.uploader.onCompleteItem = (fileItem, response, status, headers) => {
      if ( response.toLowerCase().startsWith('exception') ) {
        fileItem.isError=false
        fileItem.isSuccess=false
        fileItem.isCancel=true
        NeuroApp.custom_error(response,'Errore')
      }
      else {
        NeuroApp.custom_info("Immagine target inserita nel sistema");
      }
    }

    this.uploader.onCompleteAll = () => {
      console.info('onCompleteAll');
      $('#file-upload-progress-bar').animate({'opacity':0}, 600)

      // Invia il messaggio al parent per ricaricare la lista delle immagini,
      // il contenuto del messaggio non e' significativo, eventualmente si puo'
      // usare per un log
      this.messageEvent.emit('Ricarica la lista degli elementi target');
    }
  }

  /**
   * Lista delle categorie definite nel DB.
   */
  listaCategorie() {
    //console.log("UploadImagesTargetComponent.listaCategorie")

    NeuroApp.showWait()
    this.lista_categorie = []
    NeuroApp.showWait();

    let serv = this.neuroAppService.listaCategorie()
    this.subscr = serv.subscribe(
        result => {
          this.lista_categorie = result
          this.subscr.unsubscribe()
          console.log( this.lista_categorie )
        },
        error => {
          NeuroApp.custom_error(error,"Error")
          this.subscr.unsubscribe()
        }
    )
  } // listaFileVideo()

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
}


class UploadTarget {

  private static fieldEmpty(field:string) {
    if (field==null || field=='undefined' || field.trim()=="" )
      return true
    else
      return false
  }

  /**
   * Controlla che i campi richiesti siano tutti definiti.
   * Ritorna true/false
   * @param item FileItem
   */
  static checkMandatory(item:FileItem) : boolean {

    let descr = item.formData['descrizione']
    let target = item.formData['nome_target']
    let categoria = item.formData['categoria']
    
    if ( UploadTarget.fieldEmpty(descr) )
      return false
    
    if ( UploadTarget.fieldEmpty(target) )
      return false

    if ( UploadTarget.fieldEmpty(categoria) )
      return false

    return true
  }


  /**
   * Esegue l'upload sul server del FileItem in input. 
   * La descrizione e' obbligatoria, pertanto prima di delegare al metodo upload()
   * dell'item controlla che il campo sia valorizzato.
   * 
   * @param item item da inviare al server
   */
  static upload(item:FileItem) {
    if ( UploadTarget.checkMandatory(item) == false) {
        NeuroApp.custom_error("Controllare che i campi obbligatori siano definiti", "Errore")
        return
    }
    item.upload()
  }


  /**
   * Upload di tutti i file. Controlla che i campi descrizione siano tutti definiti, se non e'
   * cosi' emette un messaggio di errore e annulla l'operazione.
   */
  static uploadAll(uploader:FileUploader) {
    let foundEmpty = false
    
    let items = uploader.getNotUploadedItems().filter( (item) => { return !item.isUploading })
    items.forEach( item => {
      if ( this.checkMandatory(item) == false ) {
        foundEmpty = true
      }
    })
    if ( foundEmpty ) {
      NeuroApp.custom_error("Uno o più campi obbligatori sono vuoti: upload annullato.", "Errore")
      return
    }
    uploader.uploadAll()
  } // uploadAll()
  
}