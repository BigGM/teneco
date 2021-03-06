import { Component, OnInit, Input, OnDestroy, Self } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paziente } from '../../../classes/paziente';
import { EserciziPaziente } from '../../../classes/esercizi-paziente';
import { ListaPazientiComponent } from '../lista-pazienti/lista-pazienti.component'
import { PazientiService } from 'src/app/services/pazienti/pazienti.service';

import { NeuroApp } from '../../../neuro-app';
import { templateJitUrl } from '@angular/compiler';

declare var NeuroAppJS : any;
declare var bootbox: any;
declare var $ : any;

@Component({
  selector: 'app-esercizi-paziente',
  templateUrl: './esercizi-paziente.component.html',
  styleUrls: ['./esercizi-paziente.component.css']
})
export class EserciziPazienteComponent implements OnInit, OnDestroy {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  /** Per l'accesso alla lista dei pazienti */ 
  @Input() listaPazienti: ListaPazientiComponent

  // il paziente su cui lavorare
  paziente:Paziente

  /** Sottoscrizione ai servizi PazientiService */
  pazientiSubscr  : Subscription

  /** lista degli esercizi neuromotori per il paziente */
  eserciziAmbito1 : Array<EserciziPaziente>

  /** lista degli esercizi cognitivi per il paziente */
  eserciziAmbito2 : Array<EserciziPaziente>

  /** Attiva o disattiva tutti i checkbox degli esercizi */
  toggleSelection : boolean;

  /** un flag che segnala per ogni pacchetto l'assegnazione di tutti gli esercizi */
  pkt_assegnato : { [key: string]: boolean; }

  view_visible : boolean;


  constructor( private pazientiService : PazientiService) {
    this.paziente = new Paziente
    this.pazientiSubscr = null
    this.eserciziAmbito1 = new Array<EserciziPaziente>()
    this.eserciziAmbito2 = new Array<EserciziPaziente>()
    this.toggleSelection = true;
    this.pkt_assegnato = {};
    this.view_visible = false;
  }

  ngOnInit() {
    /**
     * Si sottoscrive al componente ListaPazienti per ricevere due
     * possibili richieste:
     * p != null  => apri la finestra per la gestione degli esercizi associati
     * p == null  => nascondi questa vista
     */
    this.listaPazienti.eserciziPaziente.subscribe (p => {
      //console.log("EserciziPazienteComponent", p)
      if (p) {
        this.paziente.copy(p)
        this.loadEserciziPaziente(p)
      }
      else {
        this.closeThisView()
      }
    })
  }

  ngOnDestroy() {
    if (this.listaPazienti.eserciziPaziente)
      this.listaPazienti.eserciziPaziente.unsubscribe()
    if ( this.pazientiSubscr )
      this.pazientiSubscr.unsubscribe()
    this.closeThisView()
  }

  /**
   * Carica tutti i campi del paziente in input.
   * @param p - il paziente richiesto, qui sono valorizzati solo i campi
   *            nome, cognome e data di nascita.
   */
  loadEserciziPaziente(p:Paziente) {
    //console.log("PazientiComponent.loadEserciziPaziente")
    NeuroApp.showWait();
    let serv = this.pazientiService.loadEserciziPaziente(p)
    this.pazientiSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.eserciziAmbito1 = result.filter( item => item.id_ambito==1 )
          this.eserciziAmbito2 = result.filter( item => item.id_ambito==2 )
          this.eserciziAmbito1.forEach (e => EserciziPaziente.decode(e) )
          this.eserciziAmbito2.forEach (e => EserciziPaziente.decode(e) )

          // inizializza a false la mappa dei pacchetti selezionati
          this.pkt_assegnato = {};
          this.eserciziAmbito1.concat(this.eserciziAmbito2).forEach(item =>this.pkt_assegnato[item.id_pacchetto]=false)

          //console.log(this.eserciziAmbito1)
          this.pazientiSubscr.unsubscribe()
          this.openThisView();
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.pazientiSubscr.unsubscribe()
          this.closeThisView()
        }
      )
  } // loadEserciziPaziente()

  /**
   * Ricarica la vista con i valori iniziali.
   */
  reload() {
    this.loadEserciziPaziente(this.paziente)
    this.toggleSelection = true;
  }

  openThisView() {
    let self = this;
    $('#esercizi-paziente-container').animate({left:'0px'}, 500, 'easeOutCirc', function(){
      // attiva i tooltip
      self.setPopover()
      self.view_visible = true
      $('#arrow-paz-ese').animate({opacity:1}, 600)
    });
  }

  closeThisView() {
    let self = this;
    $('#esercizi-paziente-container').animate({left:'-500px'}, 500, 'easeOutCirc', function(){
      // cancella i tooltip
      self.disposePopover()
      self.view_visible = false;
      $('#arrow-paz-ese').css({opacity:0})
    });
  }

  setPopover() {
    this.eserciziAmbito1.concat(this.eserciziAmbito2).forEach( item => {
      //let id_elem = "#pkt_"+item.id_pacchetto;
      //$(id_elem).popover({title: item.nome_pacchetto, content: item.descr_pacchetto, trigger: "hover", html:true, boundary:"window"}); 
      item.esercizi.forEach (e => {
        let id_elem = "#ese_"+e.id_esercizio;
        $(id_elem).popover({title: e.nome_esercizio, content: e.descr_esercizio, trigger: "hover", html:true, boundary:"window"}); 
      })
    })
  }
  disposePopover() {
    this.eserciziAmbito1.concat(this.eserciziAmbito2).forEach( item => {
      //let id_elem = "#pkt_"+item.id_pacchetto;
      //$(id_elem).popover('dispose');
      item.esercizi.forEach (e => {
        let id_elem = "#ese_"+e.id_esercizio;
        $(id_elem).popover('dispose');
      })
    })
  }

  /**
   * Seleziona o deseleziona tutti gli esercizi.
   */
  toggle() {
    let allEsercizi =  this.eserciziAmbito1.concat(this.eserciziAmbito2)
    allEsercizi.forEach( item => {
      $('#input_pkt_'+item.id_pacchetto).prop('checked',this.toggleSelection)
      this.pkt_assegnato[item.id_pacchetto] = this.toggleSelection
      item.esercizi.forEach (e => {
        e.assegnato = this.toggleSelection
      })
    })
    this.toggleSelection = !this.toggleSelection;
  }

  /**
   * Seleziona o deseleziona gli esercizi di uno specifico pacchetto.
   * @param id_pkt id del pacchetto
   */
  togglePkt(id_pkt:number) {
    //console.log("assegnaPkt", id_pkt);
    let allEsercizi =  this.eserciziAmbito1.concat(this.eserciziAmbito2)
    allEsercizi.forEach( item => {
      if (item.id_pacchetto==id_pkt) {
        this.pkt_assegnato[id_pkt] = !this.pkt_assegnato[id_pkt]
        item.esercizi.forEach (ex => ex.assegnato=this.pkt_assegnato[id_pkt] )
      }
    })
  }

  /**
   * Associa al paziente gli esercizi selezionati sulla interfaccia.
   * Costruisce una lista di id_esercizio che passa alla procedura del DB
   * di eseguire l'associazione.
   */
  assegnaEsercizi() {
    let id_esercizi:string = ""
    let allEsercizi =  this.eserciziAmbito1.concat(this.eserciziAmbito2)

    allEsercizi.forEach( item => {
      item.esercizi.forEach (e => {
        if (e.assegnato) 
        id_esercizi += (e.id_esercizio + " ") 
      })
    })

    id_esercizi = id_esercizi.trim().split(" ").join(",")
    //console.log(id_esercizi);

    let serv = this.pazientiService.assegnaEsercizi(this.paziente.id_paziente, id_esercizi)
    this.pazientiSubscr = serv.subscribe (
      result => {
        this.pazientiSubscr.unsubscribe()
        NeuroApp.hideWait()
        NeuroApp.custom_info('Esercizi assegnati al paziente: <b>' + this.paziente.nome + " " + this.paziente.cognome + '</b>')
      },
      error => {
        this.pazientiSubscr.unsubscribe()
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Error")
      }
    )
  } // assegnaEsercizi

}
