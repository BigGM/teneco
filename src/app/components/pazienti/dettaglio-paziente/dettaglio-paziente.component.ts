import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paziente } from '../../../classes/paziente';
import { ListaPazientiComponent } from '../lista-pazienti/lista-pazienti.component'
import { PazientiService } from 'src/app/services/pazienti/pazienti.service';
import { NeuroApp } from '../../../neuro-app';

declare var $ : any;
declare var bootbox: any;
declare var NeuroAppJS : any;


@Component({
  selector: 'app-dettaglio-paziente',
  templateUrl: './dettaglio-paziente.component.html',
  styleUrls: ['./dettaglio-paziente.component.css']
})
export class DettaglioPazienteComponent implements OnInit, OnDestroy {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  /** Per l'accesso alla lista dei pazienti */ 
  @Input() listaPazienti: ListaPazientiComponent

  /** Il paziente attuale */
  paziente : Paziente

  /** Sottoscrizione ai servizi PazientiService */
  pazientiSubscr  : Subscription

  /** Visibilita' di questa finestra */
  view_dettaglio_visible = false;


  constructor( private pazientiService : PazientiService) {
    this.view_dettaglio_visible = false;
    this.paziente = new Paziente
    this.pazientiSubscr = null
  }

  ngOnInit() {
    /**
     * Si sottoscrive al componente ListaPazienti per ricevere due
     * possibili richieste:
     * p != null  => mostra il dettaglio del paziente
     * p == null  => nascondi questa vista
     */
    this.listaPazienti.selectedPaziente.subscribe (p => {
      console.log("DettaglioPazienteComponent", p)

      if (p) {
        this.loadDettaglioPaziente(p)
      }
      else {
        this.closeDettaglio()
      }
    })
  }

  ngOnDestroy() {
    if (this.listaPazienti.selectedPaziente)
      this.listaPazienti.selectedPaziente.unsubscribe()
    if ( this.pazientiSubscr )
      this.pazientiSubscr.unsubscribe()
  }


  /**
   * Carica tutti i campi del paziente in input.
   * @param p - il paziente richiesto, qui sono valorizzati solo i campi
   *            nome, cognome e data di nascita.
   */
  loadDettaglioPaziente(p:Paziente) {
    console.log("PazientiComponent.loadDettaglioPaziente")
    NeuroApp.showWait();
    let serv = this.pazientiService.loadDettaglioPaziente(p)
    this.pazientiSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.paziente = result;
          Paziente.decode(this.paziente)
          this.pazientiSubscr.unsubscribe()
          this.openDettaglio();
          console.log("loadDettaglioPaziente",this.paziente);
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pazientiSubscr.unsubscribe()
          this.closeDettaglio()
        }
      )
  } // loadDettaglioPaziente()

  openDettaglio() {
      $('#div_dettaglio_paziente').animate({right:'-18px'},500,'easeOutCirc', function(){
        $('#arrow-dett-paz').animate({opacity:1}, 600)
      });
  }

  closeDettaglio() {
    $('#div_dettaglio_paziente').animate({right:'-450px'},500,'easeOutCirc', function(){
      $('#arrow-dett-paz').css({opacity:0})
    });
  }
}
