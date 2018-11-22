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
     * Elimina gli spazi bianchi laterali dalla stringa in input considerando
     * che la stringa puo' essere contenuta tra i tag <p>...</p>.
     * @param s 
     */
    public trimField (s:string) {
      if (s==null || s=="undefined" || s==="")
        return s;
  
      let start_s = "";
      let end_s   = "";
      
      if (s.startsWith("<p>" ) ) {
        start_s = "<p>"
          s = s.substring(3)
      }
      if (s.endsWith("</p>" ) ) {
        end_s = "</p>"
          s = s.substring(0,s.length-4)
      }
      // il metodo trim_nbsp() toglie gli spazi laterali scritti come "&nbsp;"
      s = NeuroApp.trim_nbsp(s)
  
      // rimette tutto insieme
      return (start_s + s + end_s).trim();
    }
  
  
    /**
     * Elimina gli spazi laterari dai campi del record.
     */
    public trim() {
      this.nome         = this.trimField ( this.nome )
      this.descr        = this.trimField ( this.descr )
      this.contro_ind   = this.trimField ( this.contro_ind )
      this.pre_req      = this.trimField ( this.pre_req )
      this.alert_msg    = this.trimField ( this.alert_msg )
      this.alert_msg_visibile    = this.trimField ( this.alert_msg_visibile )
      this.bibliografia          = this.trimField ( this.bibliografia )
      this.patologie_secondarie  = this.trimField ( this.patologie_secondarie )
      this.valutazione           = this.trimField (this.valutazione)
      //this.short_descr  = this.trimField ( this.short_descr )
    } 

  } // RecordPacchetto
  
  