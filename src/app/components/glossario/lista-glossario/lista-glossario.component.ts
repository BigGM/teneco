import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlossarioService, RecordGlossario} from '../../../services/glossario/glossario.service'
import { Subscription } from 'rxjs';
import { NeuroApp } from '../../../neuro-app';

declare var $ : any;
declare var NeuroAppJS : any;
declare var bootbox: any;

@Component({
  selector: 'app-lista-glossario',
  templateUrl: './lista-glossario.component.html',
  styleUrls: ['./lista-glossario.component.css']
})
export class ListaGlossarioComponent implements OnInit, OnDestroy {

  glossario     : RecordGlossario[];
  glossSubscr   : Subscription;
  voce_glossario: RecordGlossario 

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  constructor( private glossarioService : GlossarioService) {
    //console.log( "ListaGlossarioComponent costruttore" )
    this.glossario = []
    this.glossSubscr = null
    this.voce_glossario = new RecordGlossario()
  }

  ngOnInit() {
    if (this.glossario)
      console.log( this.glossario.length )
    this.loadGlossario()
  }

  ngOnDestroy() {
    //console.log( "ListaGlossarioComponent => onDestroy" )
    if (this.glossSubscr != null)
      this.glossSubscr.unsubscribe()
  }
  
  /**
   * Carica le voci di glossario sull'array this.glossario o
   * emette una popup di errore.
   */
  loadGlossario() {
    //console.log("ListaGlossarioComponent.loadGlossario")
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
   * Visualizza una voce di glossario sulla finestra modale.
   * @param voce voce del glossario
   */
  viewVoce(voce: RecordGlossario) {
    this.voce_glossario = voce
    $("#modalGlossario").modal()
  }


  /**
   * Apre il modulo per la definizione di una nuova voce del glossario
   */
  formNuovaVoceGlossario() {
    this.voce_glossario = new RecordGlossario()
    $('#nuovaVoceGlossario').modal('show')
    this.glossarioService.resetModalNewVoce()
  }


  /**
   * Apre il modulo per la modifica di una voce del glossario
   */
  formModifVoceGlossario(voce_glossario:RecordGlossario) {
    $('#modifVoceGlossario').modal('show')   
    // Invia alla modale il record da modificare tramite il servizio
    this.glossarioService.sendRecordToModal(voce_glossario)
  }


  /**
   * Ricarica la lista delle voci di glossario
   */
  refreshGlossario() {
    //console.log("refreshGlossario")
    this.glossario = []
    this.loadGlossario()
  }

  /**
   * @param voce_glossario
   */
  confermaCancellaGlossario(voce_glossario:RecordGlossario)
  {
    let self = this;
    bootbox.dialog ({
        title: "<h3>Cancella voce glossario</h3>", 
        message: "<h6 p-4 style='line-height:1.6;'>Conferma rimozione della voce <label class='text-danger'>\""+voce_glossario.voce+"\"</label></h6>",
        draggable:true,
        buttons:{
          "Annulla":{
              className:"btn-dark btn-md"
          }, 
          "Rimuovi" : { 
             className:"btn-danger btn-md",
             callback: function(){
              self.cancellaGlossario(voce_glossario);
             } // end callback
          } // end Rimuovi
       } // end buttons
    }); // bootbox.dialog

  } // confermaCancellaGlossario()


  /**
   * Cancella una voce di glossario dal db richiamando il metodo di cancellazione
   * del servizio glossarioService
   * @param voce_glossario voce di glossario da cancellare
   */
  cancellaGlossario(voce_glossario:RecordGlossario) {
    //console.log("ListaGlossarioComponent.cancellaGlossario")
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
