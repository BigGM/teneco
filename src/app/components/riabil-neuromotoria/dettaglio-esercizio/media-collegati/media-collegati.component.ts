import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../../neuro-app';
import { RiabilNeuromotoriaService } from '../../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { RecordEsercizio } from '../../../../classes/record-esercizio'
import { RecordMediaEsercizio } from 'src/app/classes/record-media-esercizio';

declare var NeuroAppJS: any;

@Component({
  selector: 'app-media-collegati',
  templateUrl: './media-collegati.component.html',
  styleUrls: ['./media-collegati.component.css']
})
export class MediaCollegatiComponent implements OnInit, OnDestroy {

  /** L'esercizio visualizzato */
  esercizio : RecordEsercizio


  /** La lista degli elementi multimediali collegati */
  listaMedia : Array<RecordMediaEsercizio>


  /** Sottoscrizione ai servizi */
  exSubscr  : Subscription


  constructor(private exService : RiabilNeuromotoriaService,) {
    this.exSubscr = null
  }

  ngOnInit() {
    this.listaMedia = []
  }

  ngOnDestroy() {
    this.listaMedia = null
    if (this.exSubscr)
      this.exSubscr.unsubscribe()
  }

  
  showMediaFor(esercizio:RecordEsercizio) {
    this.esercizio = esercizio
    this.loadMediaCollegati()
  }


  loadMediaCollegati() {

    //console.log("DettaglioEsercizioComponent.loadMediaCollegati")
    NeuroApp.showWait();
     
    let serv = this.exService.loadMediaEsercizio(this.esercizio)
    this.exSubscr = serv.subscribe (
       result => {
          this.listaMedia = result
          if (NeuroAppJS.DEVELOP_ENV )
          this.listaMedia.map (item => {
            item.url =  NeuroAppJS.G_URL_ROOT + "/" + item.url
          })
          NeuroApp.hideWait()
          this.exSubscr.unsubscribe()
          console.log("MediaCollegatiComponent.loadMediaCollegati", this.listaMedia)
       },
       error => {
          this.listaMedia = []
          this.exSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
          
       }
    )
  }

  filter(tipo_media:string) : RecordMediaEsercizio[] {
    let out = this.listaMedia.filter( value => {
                return value.tipo==tipo_media
              })
    //console.log(out)
    return out
  }
}
