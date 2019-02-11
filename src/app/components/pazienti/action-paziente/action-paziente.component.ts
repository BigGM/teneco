import { Component, OnInit,  OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paziente } from '../../../classes/paziente'
import { ListaPazientiComponent } from '../lista-pazienti/lista-pazienti.component'
import { NeuroApp } from '../../../neuro-app';
import { PazientiService } from 'src/app/services/pazienti/pazienti.service';

// questo e' per jQuery
declare var $: any;

// La libreria javascript
declare var NeuroAppJS : any;


@Component({
  selector: 'app-action-paziente',
  templateUrl: './action-paziente.component.html',
  styleUrls: ['./action-paziente.component.css']
})
export class ActionPazienteComponent implements OnInit {

  /** Sottoscrizione ai servizi PazientiService */
  pazientiSubscr  : Subscription

  // questo e' il componente ListaPazientiComponent
  @Input() listaPazienti: ListaPazientiComponent 

  // questo e' il paziente all'apertura della finestra modale in modalita: modifica
  entryPaziente : Paziente

  // questo e' il paziente corrente
  paziente : Paziente

  // azione richiesta: nuovo_paziente, modifica_paziente
  azione : string;

  // titolo della finestra modale
  titolo : string;


  constructor( private pazientiService : PazientiService ) { 
    this.entryPaziente = new Paziente
    this.paziente = new Paziente
    this.pazientiSubscr = null
  }


  ngOnInit() {
    /**
     * Si sottoscrive al componente ListaPazientiComponent 
     * per ricevere l'azione da eseguire.
     * L'oggetto 'obj' in input ha un campo azione che puo' valere "nuovo" o
     * "modifica",
     * nel secondo caso 'obj' avra' anche un campo 'paziente' con il paziebte da modificare.
     */
    this.listaPazienti.openActionPaziente.subscribe (obj => {
      console.log("this.listaPazienti.openActionPaziente", obj)

      this.azione = obj.azione
      
      if (this.azione=="nuovo") {
          this.titolo = "Nuovo paziente"
      }
      else if (this.azione=="modifica") {
        this.titolo = "Modifica paziente"
        this.loadDettaglioPaziente(obj.paziente)
      }
    })
  }

  ngOnDestroy() {
    if ( this.pazientiSubscr )
      this.pazientiSubscr.unsubscribe()
  }


  /**
   * Legge tutti campi del paziente in input, li assegna agli attributi di classe
   * paziente e entryPaziente e infine apre la finestra modale per la modifica.
   * @param p 
   */
  loadDettaglioPaziente(p:Paziente) {
    console.log("PazientiComponent.loadDettaglioPaziente")
    NeuroApp.showWait();
    let serv = this.pazientiService.loadDettaglioPaziente(p)
    this.pazientiSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          Paziente.decode(result)
          this.paziente.copy(result)
          this.entryPaziente.copy(result)
          this.pazientiSubscr.unsubscribe()
          $('#actPaziente').modal('show')
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pazientiSubscr.unsubscribe()
        }
      )
  } // loadDettaglioPaziente()

  luogo_data_nascita() {
    return this.paziente.luogo_nascita + " " + this.paziente.data_nascita
  }

  reloadEntryPaziente(p:Paziente) {
    alert("reloadEntryPaziente")
  }

  salvaPaziente(p:Paziente) {
    alert("salvaPaziente")
  }

  reset(p:Paziente) {
    alert("reset")
  }

}