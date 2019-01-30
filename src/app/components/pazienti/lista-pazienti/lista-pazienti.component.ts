import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paziente } from '../../../classes/paziente';
import { PazientiService } from 'src/app/services/pazienti/pazienti.service';
import { NeuroApp } from '../../../neuro-app';


@Component({
  selector: 'app-lista-pazienti',
  templateUrl: './lista-pazienti.component.html',
  styleUrls: ['./lista-pazienti.component.css']
})
export class ListaPazientiComponent implements OnInit, OnDestroy {

  /** La lista dei pacchetti */
  pazienti  : Paziente[]

  /** Sottoscrizione ai servizi PazientiService*/
  pazientiSubscr  : Subscription

  /** Emette il paziente verso la finestra di dettaglio */
  @Output() selectedPaziente = new EventEmitter<Paziente>()


  constructor( private pazientiService : PazientiService) {
    //console.log( "PazientiComponent costruttore" )
    this.pazienti = []
    this.pazientiSubscr = null
  }

  ngOnInit() {
    //console.log( this.pacchetti.length )
    this.loadPazienti()
  }

  ngOnDestroy() {
    console.log( "PazientiComponent => onDestroy" )
    this.pazienti = null
    if (this.pazientiSubscr )
      this.pazientiSubscr.unsubscribe()
  }


  /**
   * Carica dal DB i pacchetti configurati sul sistema.
   * In caso di errore emette una popup.
   * @ambito -  1: riabilitazione neuromotoria
   *            2: riabilitazione cognitiva
   *            3: formazione
   */
  loadPazienti() {
    console.log("PazientiComponent.loadPazienti")
    
    NeuroApp.showWait();
    
    let serv = this.pazientiService.loadPazienti()
    
    this.pazientiSubscr = serv.subscribe (
        result => {
          //console.log(result)
          NeuroApp.hideWait()
          this.pazienti = result
          this.pazienti.forEach(p => {
              Paziente.decode(p)
          })
          //console.log(this.pazienti)
          this.pazientiSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pazientiSubscr.unsubscribe()
        }
      )
  } // loadPazienti()

  openDettaglioPaziente(p:Paziente) {
    console.log(p)
    this.selectedPaziente.emit(p)
  }
}
