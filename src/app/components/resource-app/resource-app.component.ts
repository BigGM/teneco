import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeuroAppService } from '../../services/neuro-app.service'
import { NeuroApp } from '../../neuro-app';
import { RecordMedia } from '../../classes/record-media'


declare var NeuroAppJS : any
declare var $ : any
declare var bootbox: any

@Component({
  selector: 'app-resource-app',
  templateUrl: './resource-app.component.html',
  styleUrls: ['./resource-app.component.css']
})
export class ResourceAppComponent implements OnInit {

  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  // lista delle apps presenti nel sistema
  lista_apps :  RecordMedia[];

  // per la registrazione al servizio di accesso alle procedure del DB
  mediaSubscr:  Subscription;

  /**
   * Costruttore
   * @param neuroAppService 
   * @param docService 
   */
  constructor (
    private neuroAppService : NeuroAppService
  ) {
    //console.log( "ResourceAppComponent=> constructor" )
    this.lista_apps = []
    this.mediaSubscr = null
  }

  ngOnInit() {
    //console.log( "ResourceAppComponent=> OnInit" )
  
    if (this.lista_apps)
      console.log( this.lista_apps.length )
    this.listaApps()
  }

  ngOnDestroy() {
    //console.log( "ResourceAppComponent => OnDestroy" )
    if (this.mediaSubscr)
      this.mediaSubscr.unsubscribe()
  }


  /**
   * Carica la lista delle applicazioni presenti sul sistema.
   */
  listaApps() {
    console.log("ResourceAppComponent.listaApps")

    $('#waitDiv').show();
    this.lista_apps = []
    let exclude_id  = '' // nessun id viene escluso 
    let tipo_media  = 'app'
    NeuroApp.showWait();

    let serv = this.neuroAppService.listaMedia(exclude_id, tipo_media)
    this.mediaSubscr = serv.subscribe(
        result => {
          result.map(app => {
            if (NeuroAppJS.DEVELOP_ENV)
              app.url_snapshot = NeuroApp.G_URL_ROOT +  "/" +app.url_snapshot
            console.log(app.url_snapshot)
          })
          NeuroApp.hideWait()
          this.lista_apps = result
          this.mediaSubscr.unsubscribe()
        },
        error => {
          NeuroApp.hideWait()
          NeuroApp.custom_error(error,"Error")
          this.mediaSubscr.unsubscribe()
        }
    )
  } // listaApps()


  /**
   * Apre l'applicazione in input su una nuova finestra.
   * @param app 
   */
  openApp(app: RecordMedia) {
    let url_app = app.url_media
    if (app.url_param != "")
      url_app += "?"+app.url_param

    if (NeuroAppJS.DEVELOP_ENV)
      url_app = NeuroApp.G_URL_ROOT +  "/" + url_app

    console.log(url_app)
    window.open(url_app,"","fullscreen=yes")
  }
}
