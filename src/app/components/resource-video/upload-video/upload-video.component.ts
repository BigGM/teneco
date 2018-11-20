import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FileUploader, FileItem } from 'ng2-file-upload'
import { NeuroApp} from '../../../neuro-app'
import { CommonUpload } from '../../../common-upload'

// per jQuery
declare var $ : any;

const URL_UPLOAD = NeuroApp.G_URL_ROOT + "/cgi-bin/video_upload.php";

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent implements OnInit {

  public uploader:FileUploader = new FileUploader({url: URL_UPLOAD})
  public hasBaseDropZoneOver:boolean = false
  public hasAnotherDropZoneOver:boolean = false


  // Evento per il parent per aggiornare la lista dei video dopo un inserimento
  // o una cancellazione
  @Output() reloadVideoEvent = new EventEmitter();


  constructor() {
  }

    /**
   * L'evento reloadVideoEvent viene emesso verso il parent per ricaricare la
   * la lista dei file dopo l'upload. Il messaggio inviato viene usato
   * solo per un eventuale messaggio di log, non ha un significato specifico.
   */
  reloadVideos() {
    this.reloadVideoEvent.emit('Ricarica lista video');
  }

  /**
   * Esegue l'upload sul server del FileItem in input usando il metodo comune della
   * classe Common.
   * 
   * @param item item da inviare al server
   */
  upload(item:FileItem) {
    //console.log("upload video", item)
    CommonUpload.upload(item)
  }

  /**
   * Upload di tutti i file usando il metodo corrispondente della classe Common.
   */
  uploadAll() {
    CommonUpload.uploadAll(this.uploader)
  } // uploadAll()


  ngOnInit() {

    //this.generateHtmlCode()

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
        $('#video-progress-bar').css('opacity', 1)
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
          NeuroApp.custom_info("Video inserito nel sistema");
        }
    }
    this.uploader.onCompleteAll = () => {
        console.info('onCompleteAll');
        $('#video-progress-bar').animate({'opacity':0}, 600)
        // Aggiorna la lista delle immagini
        this.reloadVideos()
    }
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }


  /***/
  generateHtmlCode() {

    let media = 'video'

    let html_code = 
    "<div class='mb-5'>"+
    
        "<label class='title-doc text-capitalize'>Upload"+media+"</label>"+
      
        "<div class='row pt-3 pb-3 card my-bg-secondary'>"+
    
            "<div class='col-sm-12'>"+
      
              "<label for='file-"+media+"-upload' class='custom-file-upload'>Sfoglia</label><br/>"+
              "<input [hidden]='true' id='file-"+media+"-upload'"+
              "    type='file' "+
              "    ng2FileSelect [uploader]='uploader' "+
              "    multiple "+
              "    accept='video/*' /> "+  // ****
              
                "<p style='font-size:14px;color:white'>File in coda: {{ uploader?.queue?.length }}</p>"+
      
                "<table class='table text-white'>"+
                    "<thead>"+
                    "<tr>"+
                        "<th width='30%'>Nome file</th>"+
                        "<th width='20%'>Descrizione*</th>"+
                        "<th *ngIf='uploader.options.isHTML5'>Dimensione</th>"+
                        "<th *ngIf='uploader.options.isHTML5'>Avanzamento</th>"+
                        "<th>Stato</th>"+
                        "<th class='text-center'>Azioni</th>"+
                    "</tr>"+
                    "</thead>"+
                    "<tbody>"+
                    "<tr *ngFor='let item of uploader.queue'>"+
                        "<td class='font-weight-bold'>{{ item?.file?.name }}</td>"+
      
                        "<td><input type='text' class='form-control' [(ngModel)]=\"item.formData['descrizione']\" /></td>"+
                        
                        "<td *ngIf=\"uploader.options.isHTML5\" nowrap>{{ item?.file?.size/1024/1024 | number:'.3' }} MB</td>"+
    
                        "<td *ngIf=\"uploader.options.isHTML5\">"+
                            "<div class=\"progress height-24\">"+
                                "<div class=\"progress-bar progress-bar-striped height-24\" role=\"progressbar\""+
                                "[ngStyle]=\"{ 'width': item.progress + '%' }\">{{item.progress}}%</div>"+
                            "</div>"+
                        "</td>"+
                        
                        "<td class='text-center'>"+
                            "<span *ngIf='item.isSuccess'><i class='far fa-check-circle icon-stato icon-green'></i></span>"+
                            "<span *ngIf='item.isCancel'><i class='fas fa-minus-circle icon-stato icon-blue'></i></span>"+
                            "<span *ngIf='item.isError'><i class='fas fa-ban icon-stato icon-red'></i></span>"+
                        "</td>"+
                        
                        "<td nowrap>"+
                            "<button type=\"button\" class=\"btn btn-warning btn-sm p-1 px-2 mr-1 text-smaller\""+
                                    "(click)='upload(item)' [disabled]='item.isReady || item.isUploading || item.isSuccess'>"+
                                    "<i class='fas fa-upload'></i> Upload"+
                            "</button>"+
      
                            "<button type='button' class='btn btn-warning btn-sm p-1 px-2 mr-1 text-smaller'"+
                                    "(click)='item.cancel()' [disabled]='!item.isUploading'>"+
                                    "<i class='fas fa-ban'></i> Cancel"+
                            "</button>"+
      
                            "<button type='button' class='btn btn-danger btn-sm p-1 px-2 text-smaller'"+
                                    "(click)='item.remove()'>"+
                                    "<i class='far fa-trash-alt'></i> Remove"+
                            "</button>"+
                        "</td>"+
                    "</tr>"+
                    "</tbody>"+
                "</table>"+
      
                "<div>"+
                    "<div id=\"video-progress-bar\" class=\"mb-3\">"+
                        "<div class=\"progress height-24\">"+
                            "<div class=\"progress-bar progress-bar-striped height-24\" role=\"progressbar\""+
                            "[ngStyle]=\"{ 'width': uploader.progress + '%' }\">{{uploader.progress}}%</div>"+
                        "</div>"+
                    "</div>"+
      
                    "<button type=\"button\" class=\"btn btn-warning btn-sm p-2 mr-1\""+
                            "(click)=\"uploadAll()\" [disabled]=\"!uploader.getNotUploadedItems().length\">"+
                            "<i class=\"fas fa-upload\"></i> Upload all"+
                    "</button>"+
      
                    "<button type=\"button\" class=\"btn btn-warning btn-sm p-2 mr-1\""+
                            "(click)=\"uploader.cancelAll()\" [disabled]=\"!uploader.isUploading\">"+
                            "<i class=\"fas fa-ban\"></i> Cancel all"+
                    "</button>"+
      
                    "<button type=\"button\" class=\"btn btn-danger btn-sm p-2\""+
                            "(click)=\"uploader.clearQueue()\" [disabled]=\"!uploader.queue.length\">"+
                        "<i class=\"far fa-trash-alt\"></i> Remove all"+
                    "</button>"+
                "</div>"+
            "</div>"+
        "</div>"+
      "</div>";
  }

}
