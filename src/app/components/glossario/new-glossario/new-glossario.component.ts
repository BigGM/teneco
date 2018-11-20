import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlossarioService, RecordGlossario} from '../../../services/glossario/glossario.service'
import { NeuroApp } from '../../../neuro-app';

import { ListaGlossarioComponent } from '../lista-glossario/lista-glossario.component';

declare var $:any;

@Component({
  selector: 'app-new-glossario',
  templateUrl: './new-glossario.component.html',
  styleUrls: ['./new-glossario.component.css']
})
export class NewGlossarioComponent implements OnInit, OnDestroy {

  voce_glossario : RecordGlossario;
  glossSubscr    : Subscription;
  @Input() listaGlossario: ListaGlossarioComponent;
  
  constructor(private glossarioService : GlossarioService) {
  }

  ngOnInit() {
    this.voce_glossario = {
      id: -1,  voce: "", def:"", short_def: ""
    }
    this.glossSubscr = null
    //$('#nuovaVoceGlossario').draggable({handle:'.modal-header'});
  }

  ngOnDestroy() {
    console.log( "NewGlossarioComponent => onDestroy" )
    if (this.glossSubscr)
      this.glossSubscr.unsubscribe()
  }

  /**
   * Salva su db la nuova voce di glossario inserita via form
   * @param form 
   */
  salvaGlossario(form) {
    console.log(form.value)
    console.log(this.voce_glossario)

    console.log("NewGlossarioComponent.salvaGlossario")
    NeuroApp.showWait();
    
    let serv = this.glossarioService.salvaGlossario(this.voce_glossario)
    
    this.glossSubscr = serv.subscribe (
      result => {
        NeuroApp.hideWait()
        NeuroApp.custom_info('Voce di glossario aggiunta')
        // Aggiorna la lista delle voci di glossario
        this.listaGlossario.loadGlossario()
        this.glossSubscr.unsubscribe()
      },
      error => {
        NeuroApp.hideWait()
        NeuroApp.custom_error(error,"Error")
        this.glossSubscr.unsubscribe()
      }
    )
  }

  /**
   * Ripulisce i campi della form
   * @param form 
   */
  reset(form) {
      console.log(form)
      this.voce_glossario = {
        id: -1,  voce: "", def:"", short_def: ""
      }
      form.reset()
  }
}
