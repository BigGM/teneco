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
import { NeuroAppService } from './services/neuro-app.service'
import { GlossarioService } from './services/glossario/glossario.service'
import { ResourceDocsService } from './services/resource-docs/resource-docs.service';
import { ResourceAudioService } from './services/resource-audio/resource-audio.service';
import { ResourceImagesService } from './services/resource-images/resource-images.service';
import { UploadDocComponent } from './components/resource-docs/upload-doc/upload-doc.component';
import { UploadAudioComponent } from './components/resource-audio/upload-audio/upload-audio.component';
import { UploadImageComponent } from './components/resource-images/upload-image/upload-image.component';
import { UploadVideoComponent } from './components/resource-video/upload-video/upload-video.component';
import { DynamicUploadComponent } from './components/dynamic-upload/dynamic-upload.component';


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
    NewGlossarioComponent,
    UploadDocComponent,
    UploadAudioComponent,
    UploadImageComponent,
    UploadVideoComponent,
    DynamicUploadComponent,
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
    ResourceDocsService,
    ResourceAudioService,
    ResourceImagesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DynamicUploadComponent]
})
export class AppModule { }
