
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';


// import di progetto
import { GlossarioService, RecordGlossario} from '../../../services/glossario/glossario.service'
import { NeuroApp } from '../../../neuro-app';
import { ListaGlossarioComponent } from '../lista-glossario/lista-glossario.component';

// jQuery
declare var $:any;

@Component({
  selector: 'app-mod-glossario',
  templateUrl: './mod-glossario.component.html',
  styleUrls: ['./mod-glossario.component.css']
})
export class ModGlossarioComponent implements OnInit {

  voce_glossario : RecordGlossario;
  glossSubscr  : Subscription;

  @Input() listaGlossario: ListaGlossarioComponent;
  
  constructor(private glossarioService : GlossarioService) {
    this.voce_glossario = {id:-1, voce:"", def:"", short_def:""}
  }

  ngOnInit() {
    console.log( "ModGlossarioComponent => ngOnInit" )
    this.glossSubscr = null
    
    // Si registra sul servizio per ricevere il record di glossario
    // da modificare
    this.glossarioService.change_glos.subscribe(rec_glos => {
      this.voce_glossario = Object.assign({}, rec_glos);
    })

    //$('#modifVoceGlossario').draggable({handle:'.modal-header'});
  }
  
  ngOnDestroy() {
    console.log( "NewGlossarioComponent => onDestroy" )
    if (this.glossSubscr)
      this.glossSubscr.unsubscribe()
  }


  /**
   * Salva su db la voce di glossario modificata.
   * @param form
   */
  salvaGlossarioModificato(form) {
    console.log(form.value)
    console.log(this.voce_glossario)

    console.log("ModGlossarioComponent.salvaGlossarioModificato")
    NeuroApp.showWait();
    
    let serv = this.glossarioService.salvaGlossarioModificato(this.voce_glossario)
    
    this.glossSubscr = serv.subscribe (
        result => {
          NeuroApp.hideWait()
          NeuroApp.custom_info(`Voce di glossario <b>${this.voce_glossario.voce}</b> salvata`)
          // Aggiorna la lista delle voci di glossario
          this.listaGlossario.loadGlossario()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
        }
    )
  }

  /**
   * Apre la finestra modale di modifica.
   * @param voce_glossario la voce di glossario da modificare
   */
  openModal(voce_glossario:RecordGlossario) {
    this.voce_glossario = voce_glossario
    $('#modifVoceGlossario').modal('show')
  }

}
