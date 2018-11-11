import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { NeuroApp} from '../../../neuro-app'

import { ResourceDocsComponent } from '../resource-docs.component'


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

  // Evento per il parent
  @Output() reloadDocsEvent = new EventEmitter();


  constructor() {}

  /**
   * L'evento reloadDocsEvent viene emesso verso il parent per ricaricare la
   * la lista dei documenti dopo l'upload. Il messaggio inviato vien usato
   * solo per un eventuale messaggio di log, non ha un significato specifico.
   */
   reloadDocs() {
      this.reloadDocsEvent.emit('Ricarica lista documenti');
   }
 


  ngOnInit() {
    console.log(this.uploader.options)
    console.log(this.uploader.queue)

    // CALLBACKS
    this.uploader.onWhenAddingFileFailed = (item /*{File|FileLikeObject}*/, filter, options) => {
      console.info('onWhenAddingFileFailed', item, filter, options);
    }
    this.uploader.onAfterAddingFile = (fileItem) => {
        console.info('onAfterAddingFile', fileItem)
        fileItem.withCredentials = false
    }
    this.uploader.onAfterAddingAll = (addedFileItems) => {
        console.info('onAfterAddingAll', addedFileItems)
    }
    this.uploader.onBeforeUploadItem = (item) => {
        item.formData.push({docdesc: item.formData['docdesc']})	 		
        console.info('onBeforeUploadItem', item)
    }
    this.uploader.onProgressItem = (fileItem, progress) => {
        console.info('onProgressItem', fileItem, progress)
        $('#doc-progress-bar').css('opacity', 1)
    }
    this.uploader.onProgressAll = (progress) => {
        //console.info('onProgressAll', progress);
    }
    this.uploader.onSuccessItem = (fileItem, response, status, headers) => {
        console.info('onSuccessItem', fileItem, response, status, headers);
    }
    this.uploader.onErrorItem = (fileItem, response, status, headers) => {
        console.info('onErrorItem', fileItem, response, status, headers);

        if ( response.startsWith('Exception') ) {
          NeuroApp.custom_error(response,'Errore');
        }            
    }
    this.uploader.onCancelItem = (fileItem, response, status, headers) => {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    this.uploader.onCompleteItem = (fileItem, response, status, headers) => {
        console.info('onCompleteItem', fileItem, response, status, headers);            
        console.log("onCompleteItem", response)
        if ( response.startsWith('Exception') ) {
          NeuroApp.custom_error(response,'Errore');
        }
        else {
          NeuroApp.custom_info("Documento inserito nel sistema");
        }
    };
    
    this.uploader.onCompleteAll = () => {
        console.info('onCompleteAll');
        $('#doc-progress-bar').animate({'opacity':0}, 600);
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
