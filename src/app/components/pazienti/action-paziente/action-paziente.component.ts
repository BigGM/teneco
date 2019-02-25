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
    this.paziente.sesso='M'       // per impostare la option su "Maschio" nella select
    this.pazientiSubscr = null
  }


  ngOnInit() {
    /**
     * Si sottoscrive al componente ListaPazientiComponent 
     * per ricevere l'azione da eseguire.
     * L'oggetto 'obj' in input ha un campo azione che puo' valere "nuovo" o
     * "modifica",
     * nel secondo caso 'obj' avra' anche un campo 'paziente' con il paziente da modificare.
     */
    this.listaPazienti.openActionPaziente.subscribe (obj => {
      //console.log("this.listaPazienti.openActionPaziente", obj)

      this.azione = obj.azione
      
      if (this.azione=="nuovo") {
          this.titolo = "Nuovo paziente"
          this.paziente = new Paziente()
          this.paziente.sesso='M'   // per impostare la option su "Maschio" nella select del sesso
          $('#actPaziente').modal('show')
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
    //console.log("PazientiComponent.loadDettaglioPaziente")
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
    return this.paziente.luogo_nascita + ", " + this.paziente.data_nascita
  }


  /**
   * Salva sul sistema le modifiche al paziente selezionato.
   */
  salvaModifichePaziente() {
    this.paziente.trim()
    let outcome =
        this.checkMandatory(this.paziente.indirizzo) &&
        this.checkMandatory(this.paziente.residenza);

    // Manca qualche campo => messaggio di errore ed esce
    if (outcome == false) {
      NeuroApp.custom_error("Controllare i campi obbligatori !","Errore")
      return
    }

    // Codifica i caratteri speciali
    let encoded_p = this.paziente.encode()
    let php_script = "salva_modifiche_paziente.php"
    let db_proc    = "NeuroApp.salva_modifiche_paziente"

    let serv = this.pazientiService.salvaModifichePaziente(encoded_p, php_script, db_proc)
    this.pazientiSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info("Paziente modificato")
        this.pazientiSubscr.unsubscribe()
        $('#actPaziente').modal('hide')
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Errore")
        this.pazientiSubscr.unsubscribe()
        $('#actPaziente').modal('hide')
      }
    )
  } // salvaModifichePaziente


  /**
   * Salva sul sistema il nuovo paziente.
   */
  salvaNuovoPaziente() {
    //console.log(this.paziente)
    this.paziente.trim()
    let outcome =
        this.checkMandatory(this.paziente.nome) &&
        this.checkMandatory(this.paziente.cognome) &&
        this.checkMandatory(this.paziente.cf) &&
        this.checkMandatory(this.paziente.data_nascita) &&
        this.checkMandatory(this.paziente.indirizzo) &&
        this.checkMandatory(this.paziente.luogo_nascita) &&
        this.checkMandatory(this.paziente.nazionalita) &&
        this.checkMandatory(this.paziente.residenza) &&
        this.checkMandatory(this.paziente.sesso);

    // Manca qualche campo => messaggio di errore ed esce
    if (outcome == false) {
      NeuroApp.custom_error("Controllare i campi obbligatori !","Errore")
      return
    }

    // Codifica i caratteri speciali
    let encoded_p = this.paziente.encode()
    let php_script = "salva_paziente.php"
    let db_proc    = "NeuroApp.salva_paziente"

    let serv = this.pazientiService.salvaNuovoPaziente(encoded_p, php_script, db_proc)
    this.pazientiSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info("Paziente inserito nel sistema")
        // Aggiorna la lista dei pazienti
        this.listaPazienti.reloadListaPazienti()
        this.pazientiSubscr.unsubscribe()
        $('#actPaziente').modal('hide')
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Errore")
        this.pazientiSubscr.unsubscribe()
        $('#actPaziente').modal('hide')
      }
    )
  } // salvaNuovoPaziente


  clearModifiche() {
    this.paziente.residenza = ""
    this.paziente.indirizzo = ""
    this.paziente.note = ""
  }

  clearNuovo() {
    this.paziente = new Paziente()
    this.paziente.sesso = 'M'
  }

  reloadEntryPaziente(p:Paziente) {
    this.paziente.copy(this.entryPaziente)
  }
  

  /**
   * Controlla che il valore del campo in input non sia vuoto.
   * Ritorna true se e' NON vuoto, false se e' vuoto.
   */
  private checkMandatory(field_value:string) : boolean {
    //console.log (field_name, field_value)
    if ( field_value==null || field_value=="undefined" || field_value==="" || field_value=="<p><br></p>")
       return false
    else
      return true
  }
}
