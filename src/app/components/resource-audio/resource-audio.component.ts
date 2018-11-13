import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { NeuroAppService } from '../../services/neuro-app.service'
import { ResourceAudioService } from '../../services/resource-audio/resource-audio.service'
import { NeuroApp } from '../../neuro-app';
import { RecordMedia } from '../../record-media'

declare var $ : any;
declare var bootbox: any;

@Component({
  selector: 'app-resource-audio',
  templateUrl: './resource-audio.component.html',
  styleUrls: ['./resource-audio.component.css']
})
export class ResourceAudioComponent implements OnInit {

  // lista dei documenti presenti nel DB
  lista_audio :  RecordMedia[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;

  // root path delle icone
  readonly root_images = NeuroApp.ROOT_ICONS


  // Vista a griglia
  view_audio_as_grid : boolean = true

  // Vista a lista
  view_audio_as_list : boolean = false

  
  /**
   * Costruttore
   * @param neuroAppService 
   * @param docService 
   */
  constructor (
    private neuroAppService : NeuroAppService,
    private audioService    : ResourceAudioService
  ) {
    console.log( "ResourceAudioComponent=> constructor" )
    this.lista_audio = []
    this.mediaSubscr = null
  }


  ngOnInit() {
    console.log( "ResourceAudioComponent=> OnInit" )
    this.view_audio_as_grid = true
    this.view_audio_as_list = false
    if (this.lista_audio)
      console.log( this.lista_audio.length )
    this.listaFileAudio()
  }
    
  ngOnDestroy() {
    console.log( "ResourceAudioComponent => OnDestroy" )
    if (this.mediaSubscr)
      this.mediaSubscr.unsubscribe()
  }

  /**
   * Attiva la visualizzazione a lista
   */
  viewAsList(){
    console.log("viewAsList")
    if (this.view_audio_as_list)
      return

    $('#div-view-audio-as-grid').animate({opacity:0},400, () =>{
      this.view_audio_as_grid = false
      this.view_audio_as_list = true
    })
  }

  /**
   * Attiva la visualizzazione a griglia
   */
  viewAsGrid(){
    console.log("viewAsGrid")
    if (this.view_audio_as_grid)
      return
    $('#div-view-audio-as-list').animate({opacity:0},400, () =>{
      this.view_audio_as_grid = true
      this.view_audio_as_list = false
    })
  }


  /**
  * Carica la lista dei file audio presenti sul database 
  */
  listaFileAudio() {
    console.log("ResourceAudioComponent.loadAudios")
  
    $('#waitDiv').show();
    this.lista_audio = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'audio'
    NeuroApp.showWait();
  
    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {
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
    console.log("UploadAudioComponent.reloadAudioList => reloadAudiEvent received", msg)
    this.listaFileAudio()
  }




  /**
   * Cancella dal database e dal file sistem il documento specificato.
   * @param audio
   */
  confermaCancellaAudio(audio:RecordMedia) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione del file <label style='color:rgb(180,0,0);'>\""+NeuroApp.fileName(audio.url_media)+"\"</label> ?</h6>";
      if ( audio.usato_media == 1)
        msg = "<h6><b>Il file audio viene utilizzato in uno o pi&ugrave; esercizi. </b><br> " + msg + "</h6>"

      bootbox.dialog ({
        title: "<h4>Cancella Audio</h4>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-secondary btn-md"
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
      console.log("ListaGlossarioComponent.cancellaDocumento")
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
      let modal_code = "<div id='modalAudioList' class='modal fade' role='dialog'> " +
                  "<div class='modal-dialog modal-dialog-centered'>" +
                  "<div class='modal-content shadow-lg'>" +
                  "<div class='modal-header'>" +
                      "<h4 class='modal-title'>"+audio.descr_media+"</h4>" +
                      "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
                  "</div>"+
                  "<div class='modal-body col-12'>"+
                  "   <audio controls style='width:90%;margin:auto;'> <source src='"+audio.url_media+"'></audio>"+
                  "</div>"+
                
                    "<div class='modal-footer'>"+
                    "<button type='button' class='btn btn-primary' data-dismiss='modal'>Chiudi</button>"+
                    "</div>"+
                  "</div>"+
                  "</div>"+
                "</div>";

      // inserisce il codice della finestra modale sul div contenitore
      $('#div_audio_component').append(modal_code)

      //console.log( $('#div_audio_component').html() )

      // e la attiva
      $("#modalAudioList").modal();

      $('#modalAudioList').on('hidden.bs.modal', (e) => {
          console.log("*** REMOVE MODAL from DOM *** ")
          $('#modalAudioList').remove()
      })
    } // openModalAudio

}
