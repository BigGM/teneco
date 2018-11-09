import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { GlossarioService, RecordGlossario} from '../../../services/glossario/glossario.service'
import { Subscription } from 'rxjs';

import { NeuroApp } from '../../../neuro-app';

declare var $ : any;
declare var bootbox: any;

@Component({
  selector: 'app-lista-glossario',
  templateUrl: './lista-glossario.component.html',
  styleUrls: ['./lista-glossario.component.css']
})
export class ListaGlossarioComponent implements OnInit {

  glossario:   RecordGlossario[];
  glossSubscr: Subscription;
  voce_glossario:RecordGlossario 

  constructor( private glossarioService : GlossarioService) {
    console.log( "ListaGlossarioComponent costruttore" )
    this.glossario = []
  }

  ngOnInit() {
    if (this.glossario)
      console.log( this.glossario.length )
    this.loadGlossario()
  }

  ngOnDestroy() {
    console.log( "ListaGlossarioComponent => onDestroy" )
    this.glossSubscr.unsubscribe()
  }
  
  /**
   * Carica le voci di glossario sull'array this.glossario o
   * emette una popup di errore.
   */
  loadGlossario() {
    console.log("ListaGlossarioComponent.loadGlossario")
    NeuroApp.showWait();
    
    let serv = this.glossarioService.loadGlossario()
    
    this.glossSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          this.glossario = result
          this.glossSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.glossSubscr.unsubscribe()
        }
      )
  } // loadGlossario()


  /**
   * Apre il modulo per la definizione di una nuova voce del glossario
   */
  formNuovaVoceGlossario() {
    $('#nuovaVoceGlossario').modal('show')
  }


  /**
   * Apre il modulo per la modifica di una voce del glossario
   */
  formModifVoceGlossario(voce_glossario:RecordGlossario) {
    let self = this
    $('#modifVoceGlossario').modal('show')
    this.glossarioService.sendRecordToModal(voce_glossario)
  }

  refreshGlossario() {
    console.log("refreshGlossario")
    this.glossario = []
    this.loadGlossario()
  }

  /**
   * 
   * @param voce_glossario
   */
  confermaCancellaGlossario(voce_glossario:RecordGlossario)
  {
    let self = this;
    bootbox.dialog ({
        title: "<h3>Cancella voce glossario</h3>", 
        message: "<h5 p-4>Conferma rimozione della voce <label class='text-danger'>\""+voce_glossario.voce+"\"</label></h5>",
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-secondary btn-md"
          }, 
          "Rimuovi" : { 
             className:"btn-danger btn-md",
             callback: function(){
              self.cancellaGlossario(voce_glossario);
             } // end callback
          } // end Rimuovi
       } // end buttons
    }); // bootbox.dialog
  } // this.confermaCancellaGlossario


  /**
   * Cancella una voce di glossario dal db richiamando il metodo di cancellazione
   * del servizio glossarioService
   * @param voce_glossario voce di glossario da cancellare
   */
  cancellaGlossario(voce_glossario:RecordGlossario) {
    console.log("ListaGlossarioComponent.cancellaGlossario")
    NeuroApp.showWait();
    
    let serv = this.glossarioService.cancellaGlossario(voce_glossario.id)
    
    this.glossSubscr = serv.subscribe (
        result => {
          this.glossSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Voce di glossario "<b>${voce_glossario.voce}</b>" cancellata`)
          // Aggiorna la lista delle voci di glossario
          this.refreshGlossario()
        },
        error => {
          this.glossSubscr.unsubscribe()
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
    )
  }
 
}
