import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry,  map, tap } from 'rxjs/operators';

import { NeuroApp } from '../../neuro-app'
import { Outcome } from '../../classes/outcome'
import { NeuroAppService } from '../neuro-app.service';
import { RecordPacchetto } from '../../classes/record-pacchetto'
import { RecordEsercizio } from '../../classes/record-esercizio'
import { RecordMediaEsercizio } from '../../classes/record-media-esercizio'
import { Gruppo } from '../../classes/gruppo';


/**
 * Il tipo restituito dalla procedura php che carica i pacchetti puo' essere:
 * RecordPacchetto (array), oppure
 * Outcome per segnalare un errore di database
 */
type out_pacchetto =  RecordPacchetto[] | Outcome;


@Injectable({
  providedIn: 'root'
})
export class FormazioneService {

  private G_URL_ROOT : string

  constructor() { }
}
