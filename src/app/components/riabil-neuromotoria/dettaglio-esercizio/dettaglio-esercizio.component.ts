import { Component, OnInit, OnDestroy, Input, 
         AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { ListaEserciziComponent } from '../lista-esercizi/lista-esercizi.component'
import { RecordEsercizio } from '../../../classes/record-esercizio'
import { RecordMediaEsercizio } from '../../../classes/record-media-esercizio'
import { Gruppo } from '../../../classes/gruppo'
import { NeuroAppService } from 'src/app/services/neuro-app.service';
import { MediaCollegatiComponent } from './media-collegati/media-collegati.component'


@Component({
  selector: 'app-dettaglio-esercizio',
  templateUrl: './dettaglio-esercizio.component.html',
  styleUrls: ['./dettaglio-esercizio.component.css']
})
export class DettaglioEsercizioComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() listaEsercizi: ListaEserciziComponent;

  /** Vista al componente che visualizza i media collegati */ 
  @ViewChildren(MediaCollegatiComponent) mediaCollegatiChild : QueryList<MediaCollegatiComponent>


  /** Il componente che visualizza gli elementi multidiali di questo esercizio.
   * Viene inizializzato dalla vista mediaCollegatiChild quando riceve la notifica che
   * la pagina e' pronta
   **/
  mediaCollegati : MediaCollegatiComponent


  /** l'esercizio richiesto */ 
  esercizio : RecordEsercizio


  /** gruppi: esercizi passivi, autonomi, ... */ 
  gruppi    : Array<Gruppo>


  /** la lista degli elmenti multimediali collegati a questo esercizio */
  media     : Array<RecordMediaEsercizio>


  /** visibilita' di questa vista */
  view_dettaglio_visible : boolean
  

  /** Sottoscrizione ai servizi */
  exSubscr  : Subscription


  constructor (
      private exService : RiabilNeuromotoriaService,
      private neuroService : NeuroAppService
  ) {
    this.view_dettaglio_visible = false
    this.esercizio = new RecordEsercizio

    // Se la lista dei gruppi e' gia' inserita nell'array globale usa quello,
    // così evita un accesso non necessario al server
    if ( NeuroApp.gruppi ) 
      this.gruppi = NeuroApp.gruppi
    else
      this.loadGruppi()
  }

  
  ngOnInit() {
    /**
     * Si sottoscrive al componente ListaEserciziComponent per ricevere due
     * possibili richieste:
     * ex != null  => mostra il dettaglio dell'esercizio
     * ex == null  => nascondi questa vista
     */
    this.listaEsercizi.openDettaglio.subscribe (ex => {
      //console.log("DettaglioEsercizioComponent", ex)
      
      if (ex) {
        this.esercizio.copy(ex as RecordEsercizio)

        if (this.mediaCollegati)
          this.mediaCollegati.showMediaFor(this.esercizio)
        this.view_dettaglio_visible = true

        NeuroApp.scrollTo('div_dettaglio_esercizio')
      }
      else {
        this.esercizio = new RecordEsercizio
        this.view_dettaglio_visible = false
      }
    })
  }


  ngOnDestroy() {
    this.media = null;
    if (this.exSubscr) this.exSubscr.unsubscribe()
    this.mediaCollegati = null;
  }


  /**
   * Sottoscrive la vista 'mediaCollegatiChild' per essere notificato della inizializzazione
   * del componente, assegnarlo all'attributo 'mediaCollegati' e passargli il riferimento
   * all'esercizio visualizzato, così il componente puo' richiedere la lista dei media collegati
   * all'esercizio e presentarli sulla pagina.
   */
  ngAfterViewInit() {
    this.mediaCollegatiChild.changes.subscribe( (comps: QueryList<MediaCollegatiComponent>) => {
      // Now you can access to the child component
      console.log(comps);
      if (comps.first) {
        this.mediaCollegati = comps.first
        this.mediaCollegati.showMediaFor(this.esercizio)
      }
    })
  }


  nomeGruppo(id_grp) : string {
    return NeuroApp.nomeGruppo(id_grp)
  }


  /**
   * Legge dal DB le tipologie di gruppi e le inserisce nell'array this.gruppi
   */
  loadGruppi() {
    //console.log("DettaglioEsercizioComponent.loadGruppi")
    NeuroApp.showWait();
    
    let serv = this.neuroService.loadGruppi()
    this.exSubscr = serv.subscribe (
       result => {
          NeuroApp.hideWait()
          this.gruppi = result    
          this.gruppi.push ( <Gruppo>{id:-1,nome:"-- Nessun gruppo --",descr:""} )
          //console.log(this.gruppi)
          this.exSubscr.unsubscribe()
       },
       error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
          this.exSubscr.unsubscribe()
       }
    )
 } // loadGruppi()

}
