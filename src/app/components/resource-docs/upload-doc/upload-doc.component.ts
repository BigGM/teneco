import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { NeuroApp} from '../../../neuro-app'
import { Common } from '../../../common'


declare var $ : any;

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/docs_upload.php";

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {

  public uploader:FileUploader = new FileUploader({url: URL_UPLOAD})
  public hasBaseDropZoneOver:boolean = false
  public hasAnotherDropZoneOver:boolean = false

  // Evento per il parent per aggiornare la lista dei documenti dopo un inserimento
  // o una cancellazione
  @Output() reloadDocsEvent = new EventEmitter();


  constructor() {
  }


  /**
   * L'evento reloadDocsEvent viene emesso verso il parent per ricaricare la
   * la lista dei documenti dopo l'upload. Il messaggio inviato vien usato
   * solo per un eventuale messaggio di log, non ha un significato specifico.
   */
   reloadDocs() {
      this.reloadDocsEvent.emit('Ricarica lista documenti');
   }

  /**
   * Esegue l'upload sul server del FileItem in input usando il metodo comune della
   * classe Common.
   * 
   * @param item item da inviare al server
   */
  upload(item:FileItem) {
    Common.upload(item)
  }

  /**
   * Upload di tutti i file usando il metodo corrispondente della classe Common.
   */
  uploadAll() {
    Common.uploadAll(this.uploader)
  } // uploadAll()

 
  ngOnInit() {
    //console.log(this.uploader.options)
    
    // CALLBACKS
    this.uploader.onWhenAddingFileFailed = (item /*{File|FileLikeObject}*/, filter, options) => {
      console.info('onWhenAddingFileFailed', item, filter, options);
    }
    this.uploader.onAfterAddingFile = (fileItem) => {
        fileItem.withCredentials = false
        //console.info('onAfterAddingFile', fileItem)
        
    }
    this.uploader.onAfterAddingAll = (addedFileItems) => {
        console.info('onAfterAddingAll', addedFileItems)
    }
    this.uploader.onBeforeUploadItem = (fileItem) => {    
        fileItem.formData.push({docdesc: fileItem.formData['docdesc']})
        console.info('onBeforeUploadItem', fileItem)
    }
    this.uploader.onProgressItem = (fileItem, progress) => {
        //console.info('onProgressItem', fileItem, progress)
        $('#doc-progress-bar').css('opacity', 1)
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
          NeuroApp.custom_info("Documento inserito nel sistema");
        }
    }
    this.uploader.onCompleteAll = () => {
        console.info('onCompleteAll');
        $('#doc-progress-bar').animate({'opacity':0}, 600)
        // Aggiorna la lista dei documenti
        this.reloadDocs()
    }
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}
