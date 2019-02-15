import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms'
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
  
  // accesso alla form nella pagina html
  @ViewChild(NgForm) newVoceForm: NgForm;

  
  constructor(private glossarioService : GlossarioService) {
  }

  
  ngOnInit() {
    this.voce_glossario = {
      id: -1,  voce: "", def:""
    }
    
    this.glossSubscr = null
  
    // Si registra sul servizio per ricevere la richiesta di reset
    // dei campi della form
    this.glossarioService.new_glos.subscribe(item => {
      this.reset(this.newVoceForm);
    })
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
    console.log("NewGlossarioComponent.salvaGlossario")
    console.log(form.value)
    console.log(this.voce_glossario)

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
        id: -1,  voce: "", def:""
      }
      form.reset()
  }
}
