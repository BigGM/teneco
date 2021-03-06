import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FileUploader, FileItem } from 'ng2-file-upload'
import { NeuroApp} from '../../../neuro-app'
import { CommonUpload } from '../../../classes/common-upload'

// per jQuery
declare var $ : any;

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/images_upload.php";

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  public uploader:FileUploader = new FileUploader({url: URL_UPLOAD})
  public hasBaseDropZoneOver:boolean = false
  public hasAnotherDropZoneOver:boolean = false

  // Evento per il parent per aggiornare la lista delle immagini dopo un inserimento
  // o una cancellazione
  @Output() reloadImageEvent = new EventEmitter();


  constructor() {
  }

    /**
   * L'evento reloadIMageEvent viene emesso verso il parent per ricaricare la
   * la lista dei file dopo l'upload. Il messaggio inviato viene usato
   * solo per un eventuale messaggio di log, non ha un significato specifico.
   */
  reloadImages() {
    this.reloadImageEvent.emit('Ricarica lista immagini');
  }

  /**
   * Esegue l'upload sul server del FileItem in input usando il metodo comune della
   * classe Common.
   * 
   * @param item item da inviare al server
   */
  upload(item:FileItem) {
    console.log("upload image", item)
    CommonUpload.upload(item)
  }

  /**
   * Upload di tutti i file usando il metodo corrispondente della classe Common.
   */
  uploadAll() {
    CommonUpload.uploadAll(this.uploader)
  } // uploadAll()


  ngOnInit() {
    //console.log(this.uploader.options)
    
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
        fileItem.formData.push({descrizione: fileItem.formData['descrizione']})
        console.info('onBeforeUploadItem', fileItem)
    }
    this.uploader.onProgressItem = (fileItem, progress) => {
        //console.info('onProgressItem', fileItem, progress)
        $('#audio-progress-bar').css('opacity', 1)
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
        //console.info('onCompleteItem', fileItem, response, status, headers)
        //console.info('onCompleteItem', response)
        if ( response.toLowerCase().startsWith('exception') ) {
          fileItem.isError=false
          fileItem.isSuccess=false
          fileItem.isCancel=true
          NeuroApp.custom_error(response,'Errore')
        }
        else {
          NeuroApp.custom_info("Immagine inserita nel sistema");
        }
    }
    this.uploader.onCompleteAll = () => {
        console.info('onCompleteAll');
        $('#audio-progress-bar').animate({'opacity':0}, 600)
        // Aggiorna la lista delle immagini
        this.reloadImages()
    }
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}


