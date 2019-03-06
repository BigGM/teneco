import { Component, OnInit, OnDestroy } from '@angular/core';

// il modulo in puro javascript dell'applicazione
declare var NeuroAppJS:any;

// jQuery
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  debug : boolean = NeuroAppJS.DEBUG;
  show_debug:boolean;

  constructor() { }

  ngOnInit() {
    $('body').addClass('home-background');
  }

  ngOnDestroy() {
    $('body').removeClass('home-background');
  }

}
