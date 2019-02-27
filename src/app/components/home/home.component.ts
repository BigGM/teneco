import { Component, OnInit } from '@angular/core';

// il modulo in puro javascript dell'applicazione
declare var NeuroAppJS:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;


  constructor() { }

  ngOnInit() {
  }

}
