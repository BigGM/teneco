import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';
import { RiabilNeuromotoriaService } from '../../../services/riabil-neuromotoria/riabil-neuromotoria.service'
import { ListaPacchettiComponent } from '../lista-pacchetti/lista-pacchetti.component';
import { RecordPacchetto } from '../../../classes/record-pacchetto'
import { RecordEsercizio } from '../../../classes/record-esercizio'

declare var $ : any;
declare var bootbox: any;

@Component({
  selector: 'app-lista-esercizi',
  templateUrl: './lista-esercizi.component.html',
  styleUrls: ['./lista-esercizi.component.css']
})
export class ListaEserciziComponent implements OnInit {

  /** Per visualizzare o meno questo componente */
  view_esercizi_visible : boolean

  /** Pacchetto corrente */
  pacchetto : RecordPacchetto
  
  /** Gli eserizi del pacchetto corrente */
  esercizi  : RecordEsercizio[]

  /* Sottoscrizione al servizio RiabilNeuromotoriaService */
  pktSubscr : Subscription
  

  @Input() listaPacchetti: ListaPacchettiComponent;

  constructor( private pktService : RiabilNeuromotoriaService) {
    console.log( "ListaEserciziComponent costruttore" )
    this.pacchetto = new RecordPacchetto()
    this.esercizi = []
    this.view_esercizi_visible = false
  }


  ngOnInit() {
    this.listaPacchetti.selectedPkt.subscribe ( pkt => {
      this.pacchetto.copy(pkt)
      //console.log(this.pacchetto)
      this.loadEserciziPacchetto()
      this.view_esercizi_visible = true
    })
  }


  ngOnDestroy() {
    console.log( "ListaEserciziComponent => onDestroy" )
    this.pacchetto = null
    this.esercizi = null
    this.pktSubscr.unsubscribe()
  }


  /**
   * Carica la lista degli esercizi del pacchetto corrente
   */
  loadEserciziPacchetto() {
    console.log("ListaEserciziComponent.loadEserciziPacchetto")
    
    NeuroApp.showWait();
    
    let serv = this.pktService.loadEserciziPacchetto(this.pacchetto)
    
    this.pktSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.esercizi = result
          console.log(this.esercizi)
          this.pktSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pktSubscr.unsubscribe()
        }
      )
  } // loadEserciziPacchetto()


  /**
   * Rinfresca la lista degli esercizi del pacchetto corrente.
   */
  reloadEserciziPacchetto() {
    console.log("** reloadEserciziPacchetto **")
    NeuroApp.removePopover()
    this.esercizi = []
    this.loadEserciziPacchetto();
  }

  dettaglioEsercizio(ex:RecordEsercizio) {
    console.log("dettaglioEsercizio", ex)
    alert("dettaglioEsercizio")
  
  }

  /**
   * Apre il modulo per la definizione di un nuovo pacchetto
   */
  formNuovoEsercizio() {
    NeuroApp.removePopover()
    $('#nuovoEsercizio').modal('show')
  }

}
