import { Component, OnInit, Input,  Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { NeuroApp} from '../../neuro-app'
import { CommonUpload } from '../../classes/common-upload'


// jQuery
declare var $ : any;


@Component({
  selector: 'app-dynamic-upload',
  templateUrl: './dynamic-upload.component.html',
  styleUrls: ['./dynamic-upload.component.css']
})
export class DynamicUploadComponent implements OnInit {

  @Input() title: string;
  @Input() id_file_upload : string;
  @Input() accept : string;
  
  public uploader:FileUploader;
  public hasBaseDropZoneOver:boolean = false
  public hasAnotherDropZoneOver:boolean = false

  // Evento destinato al parent per richiede di aggiornare la lista dei file dopo
  // un inserimento o una cancellazione
  @Output() messageEvent = new EventEmitter();

  constructor() {
    console.log("CREA COMPONENTE DINAMICO")

    // NB. la url viene impostata dal componente parent
    this.uploader = new FileUploader( {url: ""} )
  }

  /**
   * Invia l'evento al parent. Il contenuto del messaggio e' usato solo
   * per fini di log, non ha un significato specifico.
   *
  reloadItemsList() {
    this.messageEvent.emit('Ricarica la lista degli elementi multimediali');
  } */

  /**
   * Esegue l'upload sul server del FileItem in input usando il metodo comune della
   * classe Common.
   * 
   * @param item item da inviare al server
   */
  upload(item:FileItem) {
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
        NeuroApp.custom_info("Multimedia inserito nel sistema");
      }
    }
    this.uploader.onCompleteAll = () => {
      console.info('onCompleteAll');
      $('#file-upload-progress-bar').animate({'opacity':0}, 600)
      // Invia il messaggio al parent che ricarica la lista degli items
      this.messageEvent.emit('Ricarica la lista degli elementi multimediali');
    }
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}

