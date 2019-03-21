import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { NeuroApp } from './neuro-app'
import { NeuroAppService } from './services/neuro-app.service'
import { Gruppo } from './classes/gruppo'
import { fadeAnimation } from './animations';

// il modulo in puro javascript dell'applicazione
declare var NeuroAppJS:any;
declare var screenfull:any;
declare var $:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations : [fadeAnimation]
})
export class AppComponent implements OnInit {
  
  title:string = "TENECO GCA"
  fullScreen: string = "off"
  subscr: Subscription
  debug     : boolean = NeuroAppJS.DEBUG
  show_debug: boolean = false

  constructor(private neuroService : NeuroAppService,
              private router: Router) {
    // Controlla la connesione internet ogni 25 secondi.
    window.setInterval( NeuroAppJS.checkServerConnection, 25000);
    this.loadGruppi();
  }
  
  
  ngOnInit() {
     /**
      // listener del fullscreen change
      screenfull.onchange( () => {
         console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
         if ( screenfull.isFullscreen )
            this.fullScreen = "on"
         else 
            this.fullScreen = "off"
      })**/

      /**
      let self = this;
      $('body').click(function(ev) {
        self.nc++;
        if (self.nc >= 40) {
          //self.router.navigate(["/",""])
          self.router.navigateByUrl("/")
          NeuroApp.hideWait()
        }
      })**/
  }

  toggleDebug() {
    NeuroAppJS.DEBUG = !NeuroAppJS.DEBUG;
    this.debug = NeuroAppJS.DEBUG;
  }
  
  
  /**
   * Attiva il fullscreen
   **/
  fullscreen() {
     if ( NeuroAppJS.fullscreen() ) {
        this.fullScreen = "on"
     }
  }

  /**
   * Abbandona il fullscreen
   **/  
  fullscreenExit() {
     NeuroAppJS.fullscreenExit()
     this.fullScreen = "off"
  }


  /**
   * Legge dal DB le tipologie di gruppi di servizi (passivi, autonomi, etc. ) e le inserisce 
   * nell'array globale NeuroApp.gruppi in modo da renderlo disponibile a ogni componente
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
          /*NeuroApp.gruppi.push ( <Gruppo> { id: -1, 
                                            nome: "-- Nessun gruppo --", 
                                            descr: "", 
                                            id_ambito:-1} )*/
          //console.log("loadGruppi",NeuroApp.gruppi)
          this.subscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Errore")
          this.subscr.unsubscribe()
        }
      )
  } // loadGruppi()
  nc:number=0
}
