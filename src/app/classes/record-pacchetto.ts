import { NeuroApp } from '../neuro-app'


/**
 * La struttura del record del pacchetto
 */
export class RecordPacchetto {

    id           : number
    nome         : string
    descr        : string
    contro_ind   : string
    pre_req      : string
    alert_msg    : string
    alert_msg_visibile : string
    bibliografia : string
    patologie_secondarie : string
    valutazione  : string
  
    constructor() {
        this.reset()
    }
  
    /**
     * Copia un pacchetto in input su questo pacchetto.
     * @param rec il record da ricopiare sul pacchetto corrente
     */
    copy(rec:RecordPacchetto) {
      this.id           = rec.id
      this.nome         = rec.nome
      this.descr        = rec.descr
      this.contro_ind   = rec.contro_ind
      this.pre_req      = rec.pre_req
      this.alert_msg    = rec.alert_msg
      this.alert_msg_visibile = rec.alert_msg_visibile
      this.bibliografia = rec.bibliografia
      this.patologie_secondarie  =rec.patologie_secondarie
      this.valutazione  = rec.valutazione
    }
  
  
    /**
     * Reinizializza gli attributi della classe.
     * I campi numerici sono impostati a -1, i campi stringa a un valore vuoto. 
     */
    public reset() {
      this.id = -1
      this.nome         = ""
      this.descr        = ""
      this.contro_ind   = ""
      this.pre_req      = ""
      this.alert_msg    = ""
      this.alert_msg_visibile   = ""
      this.bibliografia         = ""
      this.patologie_secondarie = ""
      this.valutazione          = ""
    }
  

    /**
     * Elimina gli spazi laterari dai campi del record.
     */
    public trim() {
      this.nome         = NeuroApp.trimField ( this.nome )
      this.descr        = NeuroApp.trimField ( this.descr )
      this.contro_ind   = NeuroApp.trimField ( this.contro_ind )
      this.pre_req      = NeuroApp.trimField ( this.pre_req )
      this.alert_msg    = NeuroApp.trimField ( this.alert_msg )
      this.alert_msg_visibile    = NeuroApp.trimField ( this.alert_msg_visibile )
      this.bibliografia          = NeuroApp.trimField ( this.bibliografia )
      this.patologie_secondarie  = NeuroApp.trimField ( this.patologie_secondarie )
      this.valutazione           = NeuroApp.trimField (this.valutazione)
    }

  } // RecordPacchetto
  
  