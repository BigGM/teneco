// Moduli di sistema
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


// Componenti di progetto
import { AppComponent } from './app.component';
import { PktRiabilitativiComponent } from './components/pkt-riabilitativi/pkt-riabilitativi.component';
import { AppRoutingModule } from './app-routing.module';
import { PktCognitiviComponent } from './components/pkt-cognitivi/pkt-cognitivi.component';
import { ResourceVideoComponent } from './components/resource-video/resource-video.component';
import { ResourceAudioComponent } from './components/resource-audio/resource-audio.component';
import { ResourceImagesComponent } from './components/resource-images/resource-images.component';
import { ResourceDocsComponent } from './components/resource-docs/resource-docs.component';
import { PazientiComponent } from './components/pazienti/pazienti.component';
import { GlossarioComponent } from './components/glossario/glossario.component';
import { ListaGlossarioComponent } from './components/glossario/lista-glossario/lista-glossario.component';
import { ModGlossarioComponent } from './components/glossario/mod-glossario/mod-glossario.component';
import { NewGlossarioComponent } from './components/glossario/new-glossario/new-glossario.component';


// Servizi di progetto
import { GlossarioService } from './services/glossario/glossario.service';

@NgModule({
  declarations: [
    AppComponent,
    PktRiabilitativiComponent,
    PktCognitiviComponent,
    ResourceVideoComponent,
    ResourceAudioComponent,
    ResourceImagesComponent,
    ResourceDocsComponent,
    PazientiComponent,
    GlossarioComponent,
    ListaGlossarioComponent,
    ModGlossarioComponent,
    NewGlossarioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [GlossarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
