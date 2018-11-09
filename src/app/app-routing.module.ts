import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PktRiabilitativiComponent } from './components/pkt-riabilitativi/pkt-riabilitativi.component';
import { PktCognitiviComponent } from './components/pkt-cognitivi/pkt-cognitivi.component';
import { ResourceVideoComponent } from './components/resource-video/resource-video.component';
import { ResourceAudioComponent } from './components/resource-audio/resource-audio.component';
import { ResourceImagesComponent } from './components/resource-images/resource-images.component';
import { ResourceDocsComponent } from './components/resource-docs/resource-docs.component';
import { PazientiComponent } from './components/pazienti/pazienti.component';
import { GlossarioComponent } from './components/glossario/glossario.component';


const routes: Routes = [
  { path: 'pkt_riabil', component: PktRiabilitativiComponent },
  { path: 'pkt_cogn', component: PktCognitiviComponent },
  { path: 'video', component: ResourceVideoComponent },
  { path: 'audio', component: ResourceAudioComponent },
  { path: 'images', component: ResourceImagesComponent },
  { path: 'docs', component: ResourceDocsComponent },
  { path: 'pazienti', component: PazientiComponent },
  { path: 'glossario', component: GlossarioComponent },

  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {enableTracing: false}) ] // <-- debugging purposes only)
})
export class AppRoutingModule {}