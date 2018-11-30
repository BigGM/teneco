import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroApp } from './neuro-app'
import { NeuroAppService } from './services/neuro-app.service'
import { Gruppo } from './classes/gruppo'
import { fadeAnimation } from './animations';

// il modulo in puro javascript dell'applicazione
declare var NeuroAppJS:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations : [fadeAnimation]
})
export class AppComponent {
  title = 'teneco';

  subscr:Subscription;

  constructor(private neuroService : NeuroAppService) {
    // Controlla la connesione internet ogni 25 secondi.
    window.setInterval( NeuroAppJS.checkServerConnection, 25000);
    this.loadGruppi()
  }


  /**
   * Legge dal DB le tipologie di gruppi di servizi (passivi, autonomi, etc. ) e le inserisce 
   * nell'array globale NeuroApp.gruppiin modo da renderlo disponibile a ogni componente
   * che lo richieda.
   */
  loadGruppi() {
    console.log("AppComponent.loadGruppi")
    NeuroApp.showWait();
    
    let serv = this.neuroService.loadGruppi()
    this.subscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          NeuroApp.gruppi = result    
          NeuroApp.gruppi.push ( <Gruppo>{id:-1,nome:"-- Nessun gruppo --",descr:""} )
          console.log(NeuroApp.gruppi)
          this.subscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
          this.subscr.unsubscribe()
        }
      )
  } // loadGruppi()
}
