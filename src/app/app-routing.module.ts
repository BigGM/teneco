import { NgModule }             from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { RiabilNeuromotoriaComponent } from './components/riabil-neuromotoria/riabil-neuromotoria.component'
import { RiabilCognitivaComponent } from './components/riabil-cognitiva/riabil-cognitiva.component'
import { ResourceVideoComponent } from './components/resource-video/resource-video.component'
import { ResourceAudioComponent } from './components/resource-audio/resource-audio.component'
import { ResourceImagesComponent } from './components/resource-images/resource-images.component'
import { ResourceDocsComponent } from './components/resource-docs/resource-docs.component'
import { PazientiComponent } from './components/pazienti/pazienti.component'
import { GlossarioComponent } from './components/glossario/glossario.component'
import { FormazioneComponent } from './components/formazione/formazione.component'


const routes: Routes = [
  { path: 'riabil_neuromotoria', component: RiabilNeuromotoriaComponent },
  { path: 'riabil_cognitiva', component: RiabilCognitivaComponent },
  { path: 'formazione', component: FormazioneComponent },
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