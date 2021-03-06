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


// libreria javascript
declare var NeuroAppJS : any;

@Component({
  selector: 'app-dettaglio-esercizio',
  templateUrl: './dettaglio-esercizio.component.html',
  styleUrls: ['./dettaglio-esercizio.component.css']
})
export class DettaglioEsercizioComponent implements OnInit, OnDestroy, AfterViewInit {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug : boolean = false;
  mousemove_event : boolean = false;     // per controllare il movimento del mouse dentro/fuori il componente

  /** Riferimento alla componente padre ListaEserciziComponent */ 
  @Input() listaEsercizi: ListaEserciziComponent;


  /** 
   * Vista al componente child che visualizza i media collegati.
   * 
   * NB. "mediaCollegatiRef" e' il riferimento assegnato al componente (vedi corrispondente html)
   * NB. Se si usasse questa dichiarazione:
   *        @ViewChildren(MediaCollegatiComponent) mediaCollegatiChild : QueryList<MediaCollegatiComponent>
   *     si avrebbe accesso a tutti i componenti del tipo MediaCollegatiComponent eventualmente
   *     presenti nella pagina,  ma qui ce ne sta solo a cui e' assegnato il "nome" mediaCollegatiRef.
   */
  @ViewChildren("mediaCollegatiRef") mediaCollegatiChild : QueryList<MediaCollegatiComponent>


  /** Il componente che visualizza gli elementi multidiali di questo esercizio.
   * Viene inizializzato dalla vista mediaCollegatiChild quando riceve la notifica che
   * la pagina e' pronta
   **/
  mediaCollegati : MediaCollegatiComponent

  /** Esercizio/Modalita di cui e' richiesto il dettaglio */ 
  esercizio : RecordEsercizio

  /** la lista degli elementi multimediali collegati a this.esercizio */
  media     : Array<RecordMediaEsercizio>

  /** gruppi: esercizi passivi, autonomi, ... */ 
  gruppi    : Array<Gruppo>

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
      console.log("DettaglioEsercizioComponent", ex)
      
      // reinizializza a false per il debug
      this.mousemove_event = false;

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
    this.listaEsercizi.openDettaglio.unsubscribe()
    this.mediaCollegati = null
    this.mousemove_event = false;
  }


  /**
   * Sottoscrive la vista 'mediaCollegatiChild' per ricevere notifica della inizializzazione
   * del componente, assegnarlo all'attributo 'mediaCollegati' e passargli il riferimento
   * all'esercizio visualizzato, così il componente puo' richiedere la lista dei media collegati
   * all'esercizio e presentarli sulla pagina.
   * 
   * NB. In caso di debug attivato il codice nel subcribe viene attivato anche quando la label
   *     di debug viene visualizzata o nascosta, si usa allora l'attributo 'mousemove_event'
   *     posto a true quando si muove il mouse dentro e fuori il component: in questo caso
   *     il codice non deve essere eseguito.
   */
  ngAfterViewInit() {
    
    console.log("*** ngAfterViewInit ***");

    this.mediaCollegatiChild.changes.subscribe( (comps: QueryList<MediaCollegatiComponent>) => {
      
      // se attivato dal solo movimento del mouse dentro/fuori il componente non 
      // deve fare niente e ritorna immediatamente
      if (this.mousemove_event)
        return;

      // Now you can access to the child component
      console.log(comps);
      if (comps.first) {
        this.mediaCollegati = comps.first
        this.mediaCollegati.showMediaFor(this.esercizio)

        // Si sottoscrive al componente MediaCollegatiComponent per ricevere l'aggiornamento
        // sul numero di multimedia associati all'esercizio mostrato in seguito ad una
        // di cancellazioe/aggiunta di elementi multimediali
        this.mediaCollegati.counterMultimedia.subscribe(count => {
            console.log("DettaglioEsercizioComponent", count)
            // comunica alla lista degli esercizi il nuovo valore
            this.listaEsercizi.updateCountMultimedia(count)
        })
      }
    })
  }


  /**
   * Ottiene il nome del gruppo di esercizi (autonomi, passivi, ...) dal suo id.
   * @param id_grp  id del gruppo
   */
  nomeGruppo(id_grp) : string {
    return NeuroApp.nomeGruppo(id_grp)
  }


  /**
   * Legge dal DB le tipologie di gruppi e le inserisce nell'array 'this.gruppi'
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
