import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../../neuro-app';
import { NeuroAppService } from '../../../../services/neuro-app.service'
import { RiabilNeuromotoriaService } from '../../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { RecordEsercizio } from '../../../../classes/record-esercizio'
import { RecordMediaEsercizio } from 'src/app/classes/record-media-esercizio';
import { RecordMedia } from '../../../../classes/record-media'




declare var $: any;
declare var NeuroAppJS: any;
declare var bootbox:any;


@Component({
  selector: 'app-media-collegati',
  templateUrl: './media-collegati.component.html',
  styleUrls: ['./media-collegati.component.css']
})
export class MediaCollegatiComponent implements OnInit, OnDestroy {

  // Variabile di output per comunicare al componente DettaglioEsercizio l'aggiornamento
  // del numero dei media dell'esercizio mostrato qui, poi questo componente comunica
  // questo valore alla vista con la lista degli esercizi.
  @Output() counterMultimedia: EventEmitter<number> = new EventEmitter()

  /** L'esercizio visualizzato */
  esercizio : RecordEsercizio

  /** La lista degli elementi multimediali collegati all'esercizio */
  listaMediaCollegati : Array<RecordMediaEsercizio>

  /** La lista degli elementi multimediali non collegati all'esercizio */
  listaMediaDisponibili : Array<RecordMedia>

  /** Sottoscrizione ai servizi */
  exSubscr  : Subscription

  
  // mappa i checkbox sulla finestra modale per l'aggiunta di un elemento multimediale
  media_checked: { [id: number]: boolean }


  constructor(
      private exService : RiabilNeuromotoriaService,
      private neuroAppService : NeuroAppService)
  {
    this.esercizio = new RecordEsercizio
    this.listaMediaCollegati = []
    this.listaMediaDisponibili = []
    this.exSubscr = null
    this.media_checked = {}
  }

  log() {
    console.log(this.media_checked)
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.listaMediaCollegati = null
    this.listaMediaDisponibili = null
    if (this.exSubscr)
      this.exSubscr.unsubscribe()
  }

  
  showMediaFor(esercizio:RecordEsercizio) {
    this.esercizio = esercizio
    console.log("showMediaFor", this.esercizio)
    this.loadMediaCollegati()
  }

  /**
   * Richiede al DB la lista degli elementi multimediali collegati all'esercizio.
   */
  loadMediaCollegati() {
    console.log("DettaglioEsercizioComponent.loadMediaCollegati")
    NeuroApp.showWait();
     
    let serv = this.exService.loadMediaEsercizio(this.esercizio)
    this.exSubscr = serv.subscribe (
       result => {
         console.log(result)
          this.listaMediaCollegati = result
          if (NeuroAppJS.DEVELOP_ENV ) {
            this.listaMediaCollegati.map (item => {
              item.url = NeuroAppJS.G_URL_ROOT + "/" + item.url
              item.url_snapshot = NeuroAppJS.G_URL_ROOT + "/" + item.url_snapshot
            })
          }
          NeuroApp.hideWait()
          this.exSubscr.unsubscribe()
          //console.log("MediaCollegatiComponent.loadMediaCollegati", this.listaMediaCollegati)

          // Comunica alla componente di dettaglio il valore (questo serve nel caso di chiamata di refresh)
          this.counterMultimedia.emit(this.listaMediaCollegati.length)
       },
       error => {
          this.listaMediaCollegati = []
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
       }
    )
  } // loadMediaCollegati()


  /**
   * Conta il numero di checkbox selezionata nella finestra modale.
   */
  countChecked() {
    let count=0
    for (let k in this.media_checked) {
      count += (this.media_checked[k] ? 1 : 0)
    }
    return count
  }


  /**
   * Cancella dal database e dal file sistem il documento specificato.
   * @param media
   */
  confermaCancellaMedia(media:RecordMediaEsercizio) {
    let self = this

      let msg= "<h6 style='line-height:1.6'>Conferma rimozione di<br><label style='word-break:break-all;color:rgb(180,0,0);'>\""+NeuroApp.fileName(media.url)+"\"&nbsp;?</label></h6>";
      
      bootbox.dialog ({
        title: "<h4>Cancella Media</h4>", 
        message: msg,
        draggable:true,
        buttons: {
          "Annulla":{
              className: "btn-secondary btn-md"
          },
          "Rimuovi" : { 
              className: "btn-danger btn-md",
              callback: function() {
                self.cancellaMediaEsercizio(media);
              } // end callback
          } // end Rimuovi
        } // end buttons
      }); // bootbox.dialog
  } // confermaCancellaMedia()


  /**
   * Cancella dall'esercizio l'elemento multimediale specificato.
   * @param media 
   */
  cancellaMediaEsercizio(media:RecordMediaEsercizio) {
    console.log("MediaCollegatiComponent.cancellaMediaEsercizio")
       NeuroApp.showWait()
  
    let serv = this.neuroAppService.rimuoviMediaEsercizio(media)
    this.exSubscr = serv.subscribe (
      result => {
        this.exSubscr.unsubscribe()
        NeuroApp.hideWait()
        NeuroApp.custom_info("Media cancellato dall'esercizio")

        // Cancella questo elemento anche dalla lista interna 'this.listaMedia'
        // NB. Questa azione aggiorna automaticamente anche la grafica grazie al
        //     bind di angular
        this.listaMediaCollegati = this.listaMediaCollegati.filter(elem => {
            return elem.id != media.id
        })

        // Comunica alla componente di dettaglio il nuovo valore
        this.counterMultimedia.emit(this.listaMediaCollegati.length)
      },
      error => {
        this.exSubscr.unsubscribe()
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Error")
      }
    )
  } // cancellaMediaEsercizio()


  /**
   * restituisce il tipo di applicazione che puo' essere applicata a questo esercizio,
   * ossia se l'esercizio appartiene ad un pacchetto cognitivo il tipo app deve essere
   * 'app_cognitiva', se il pacchetto e' di tipo neuromotorio il tipo app sara' 'app_neuromotoria'
   */
  tipoApp() {
    //console.log("tipoApp", this.esercizio)
      if(this.esercizio.id_ambito == 1) {
        return "app_cognitiva"
      }
      else if(this.esercizio.id_ambito == 2) {
        return "app_neuromotoria"
      }
  }


  /**
   * Filtra la lista dei media 'listaMedia' in base al tipo specificato e restituisce
   * una lista dei soli media del tipo richiesto.
   * @param tipo_media : video, image, audio, doc, app
   */
  filter(tipo_media:string) : RecordMediaEsercizio[] {

    if (tipo_media=='app')
      tipo_media = this.tipoApp();

    let out = 
      this.listaMediaCollegati.filter( value => {
        return value.tipo==tipo_media
      })
    //console.log(out)
    return out
  }


  /**
   * Estrae il mome del documento dalla url in input
   */
  docName(url) {
    return NeuroApp.fileName(url)
  }


  /**
  * Estrae l'estensione del documento (compreso il '.') dalla url in input
  */
  docExt(url) {
    return NeuroApp.fileExt(url)
  }


  /**
   * Restituise l'icona da inserire per il documento secondo la sua estensione
   * @param url
   */
  docIcon(url) {
    if ( NeuroApp.icons[NeuroApp.fileExt(url)] == undefined )
      return NeuroApp.ROOT_ICONS + "/generic-doc-icon.png"
    else
      return NeuroApp.ROOT_ICONS + "/" + NeuroApp.icons[ NeuroApp.fileExt(url) ]
  }


  /**
  * Apre il documento specificato tramite url in una nuova finestra
  * @param url 
  */
  open(url:string) {
    window.open(url)
  }


  /**
   * @param video l'elemento multimediale con il video da avviare
   */
  playVideo(this_video:RecordMediaEsercizio) {
    $("#myModalVideo .modal-title").html(this_video.descr);
    $("#myModalVideo").modal('show');
    let video:any = document.getElementById("video-play");
    video.src = this_video.url
    video.currentTime = 0;
    video.play();
  } // openModalVideo


    
  /**
   * Ferma il video in esecuzione sulla pagina di dettaglio esercizio
   * NB. Ci puo' essere un solo video in esecuzione
   */ 
  stopVideo() {
    $("#myModalVideo").modal('hide');
    let video:any = document.getElementById("video-play");
    if (video.currentTime >0) {
      video.pause();
      video.currentTime = 0;
    } 
  }


  /**
   * Apre l'immagine di un esercizio su una finestra modale
   **/
  openImageEsercizio(image:RecordMediaEsercizio) {
    $("#myModalImg .modal-title").html(image.descr)
    $("#myModalImg").modal('show')
    let img: any = document.getElementById("img-exercice")
    img.src = image.url
  }


  /**
  * Apre una finestra modale che consente di aggiungere un elemento multimediale
  * all'esercizio corrente, la finestra contiene video/audio/image/doc 
  * ad esclusione di quelli già assegnati all'esercizio.
  * @param tipo_media video, audio, image, doc
  **/
  openModalAggiungiMedia(tipo_media)
  {
    NeuroApp.showWait()

    // Svuota l'array di bind con i checkbox
    this.media_checked = {}

    // Costruisce la lista con gli id dei video/audio/image gia' assegnati all'esercizio corrente,
    // lista di interi separati da virgola
    let exclude_id:string = "";
    let media: Array<RecordMediaEsercizio> = this.filter(tipo_media)


    // Qui costruisce la lista degli id_media gia' assegnati a questo esercizio
    media.forEach (elem => {
      exclude_id += ( elem.id + " " );
    })
    exclude_id = exclude_id.trim().split(" ").join(",")
    
    /*// toglie la ultima virgola
    if (exclude_id.length > 0) {
      exclude_id = exclude_id.substring(0,exclude_id.length-1)
    }*/

    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.exSubscr = serv.subscribe (
        result => {
          if (result.length == 0) {
              if (tipo_media=='video')
                  NeuroApp.custom_info("L'esercizio contiene tutti i file video")
              else if (tipo_media=='audio')
                  NeuroApp.custom_info("L'esercizio contiene tutti i file audio")
              else if (tipo_media=='image')
                  NeuroApp.custom_info("L'esercizio contiene tutte le immagini")
              else if (tipo_media=='doc')
                  NeuroApp.custom_info("L'esercizio contiene tutti i documenti")
              else
                  NeuroApp.custom_info("L'esercizio contiene tutte le applicazioni")
          }
          else {
              result.map(item => {
                if (NeuroAppJS.DEVELOP_ENV ) {
                  item.url_media = NeuroApp.G_URL_ROOT +  "/" + item.url_media
                  item.url_snapshot = NeuroApp.G_URL_ROOT +  "/" + item.url_snapshot
                }
              })

              // Questa sara' la lista dei media disponibili per l'esercizio
              this.listaMediaDisponibili = result

              // Apre la finestra modale
              $("#myFetch_"+tipo_media).modal('show');
          }
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
          this.exSubscr.unsubscribe()
        }
    )
  } // openModalAggiungiMedia()


  
  /**
   *  Aggiunge all'esercizi corrente gli elementi multimediali selezionati
   * nella finestra modale.
   * @param id_media 
   * @param tipo_media 
   */
  aggiungiMediaEsercizio(tipo_media:string) {
    console.log("MediaCollegatiComponent.aggiungiMediaEsercizio")
    NeuroApp.showWait()

    // costruisce la lista degli id media da inseire
    let id_media: string = ""
    for( let id in this.media_checked) {
        if ( this.media_checked[id] )
          id_media += (id + " ")
    }
    id_media = id_media.trim().split(" ").join(",")
    
    console.log(id_media)
    
  
    let serv = this.exService.aggiungiMediaEsercizio(this.esercizio.id_pkt, this.esercizio.id_ex, id_media)
    this.exSubscr = serv.subscribe (
      result => {
        this.exSubscr.unsubscribe()
        NeuroApp.hideWait()
        
        // refresh della grafica della sezione grafica con il dettaglio
        this.loadMediaCollegati()
     
        // Chiude la finestra modale.
        $("#myFetch_"+tipo_media).modal('hide');

      },
      error => {
        this.exSubscr.unsubscribe()
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Error")
      }
    )
  } // cancellaMediaEsercizio()



    /**
     * Ferma i video in esecuzione sulla pagina di aggiunta video.
     * NB. Ci possono essere piu' video in esecuzione
     **/
    stopAllVideos() {
      let videos = document.getElementsByTagName('video');

      for(let i=0; i<videos.length; i++) {
        if ( videos[i].currentTime > 0) {
            videos[i].pause();
            videos[i].currentTime=0;
        }
      }
    }

    /**
     * Ferma tutti i file audio eventualmente in esecuzione.
     * NB. possono esserci piu' file audio in esecuzione.
     **/
    stopAllAudio() {
      let sounds = document.getElementsByTagName('audio');
      for(let i=0; i<sounds.length; i++) {
        if ( sounds[i].currentTime > 0) {
            sounds[i].pause();
            sounds[i].currentTime=0;
        }
      }
    }
}
