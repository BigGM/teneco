import { Component, OnInit } from '@angular/core';
import { ListaGlossarioComponent } from './lista-glossario/lista-glossario.component'
import { ModGlossarioComponent } from './mod-glossario/mod-glossario.component'
import { NewGlossarioComponent } from './new-glossario/new-glossario.component'

@Component({
  selector: 'app-glossario',
  templateUrl: './glossario.component.html',
  styleUrls: ['./glossario.component.css']
})
export class GlossarioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
