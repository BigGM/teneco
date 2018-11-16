// Moduli di sistema
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Librerie
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


// Servizi di progetto
import { NeuroAppService } from './services/neuro-app.service'
import { GlossarioService } from './services/glossario/glossario.service'
import { RiabilNeuromotoriaService } from './services/riabil-neuromotoria/riabil-neuromotoria.service'


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
    RiabilNeuromotoriaComponent,
    RiabilCognitivaComponent,
    ListaPacchettiComponent,
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
    RiabilNeuromotoriaService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DynamicUploadComponent]
})
export class AppModule { }
