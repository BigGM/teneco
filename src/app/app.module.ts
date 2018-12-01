// Moduli di sistema
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// !! Necessario per far funzionare il reload delle pagine !!
import { HashLocationStrategy, LocationStrategy} from '@angular/common'

// Librerie esterne
import { FileUploadModule } from 'ng2-file-upload'; 

// Componenti di progetto
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ResourceVideoComponent } from './components/resource-video/resource-video.component';
import { ResourceAudioComponent } from './components/resource-audio/resource-audio.component';
import { ResourceImagesComponent } from './components/resource-images/resource-images.component';
import { ResourceDocsComponent } from './components/resource-docs/resource-docs.component';
import { PazientiComponent } from './components/pazienti/pazienti.component';
import { GlossarioComponent } from './components/glossario/glossario.component';
import { ListaGlossarioComponent } from './components/glossario/lista-glossario/lista-glossario.component';
import { ModGlossarioComponent } from './components/glossario/mod-glossario/mod-glossario.component';
import { NewGlossarioComponent } from './components/glossario/new-glossario/new-glossario.component';
import { DynamicUploadComponent } from './components/dynamic-upload/dynamic-upload.component';
import { RiabilNeuromotoriaComponent } from './components/riabil-neuromotoria/riabil-neuromotoria.component';
import { RiabilCognitivaComponent } from './components/riabil-cognitiva/riabil-cognitiva.component';
import { ListaPacchettiComponent } from './components/riabil-neuromotoria/lista-pacchetti/lista-pacchetti.component'
import { ListaEserciziComponent } from './components/riabil-neuromotoria/lista-esercizi/lista-esercizi.component';
import { DettaglioEsercizioComponent } from './components/riabil-neuromotoria/dettaglio-esercizio/dettaglio-esercizio.component';
import { MediaCollegatiComponent } from './components/riabil-neuromotoria/dettaglio-esercizio/media-collegati/media-collegati.component';
import { ActionEsercizioComponent } from './components/riabil-neuromotoria/action-esercizio/action-esercizio.component';
import { ActionPacchettoComponent } from './components/riabil-neuromotoria/action-pacchetto/action-pacchetto.component';
import { FormazioneComponent } from './components/formazione/formazione.component';
import { UploadAudioComponent } from './components/resource-audio/upload-audio/upload-audio.component' 
import { UploadVideoComponent } from './components/resource-video/upload-video/upload-video.component'
import { UploadDocComponent } from './components/resource-docs/upload-doc/upload-doc.component'
import { UploadImageComponent } from './components//resource-images/upload-image/upload-image.component'


// Servizi di progetto
import { NeuroAppService } from './services/neuro-app.service'
import { GlossarioService } from './services/glossario/glossario.service'
import { RiabilNeuromotoriaService } from './services/riabil-neuromotoria/riabil-neuromotoria.service';


// Pipe
import { SafePipe } from './pipes/safe.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { PlaintextPipe } from './pipes/plaintext.pipe';
import { PacchettiFormazioneComponent } from './components/formazione/pacchetti-formazione/pacchetti-formazione.component';


@NgModule({
  declarations: [
    AppComponent,
    ResourceVideoComponent,
    ResourceAudioComponent,
    ResourceImagesComponent,
    ResourceDocsComponent,
    PazientiComponent,
    GlossarioComponent,
    ListaGlossarioComponent,
    ModGlossarioComponent,
    NewGlossarioComponent,
    DynamicUploadComponent,
    UploadAudioComponent,
    UploadVideoComponent,
    UploadDocComponent,
    UploadImageComponent,
    RiabilNeuromotoriaComponent,
    RiabilCognitivaComponent,
    ListaPacchettiComponent,
    SafePipe,
    TruncatePipe,
    PlaintextPipe,
    ListaEserciziComponent,
    DettaglioEsercizioComponent,
    MediaCollegatiComponent,
    ActionEsercizioComponent,
    ActionPacchettoComponent,
    FormazioneComponent,
    PacchettiFormazioneComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FileUploadModule
  ],
  providers: [
    NeuroAppService,
    GlossarioService,
    RiabilNeuromotoriaService,
    // la # location strategy serve a far funzionare il reload delle pagine
    // che, altrimennti, ritorna con 404 page non found
    {provide:LocationStrategy, useClass:HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
  entryComponents: [DynamicUploadComponent]
})
export class AppModule { }
