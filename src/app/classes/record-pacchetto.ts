import { NeuroApp } from '../neuro-app'
import { RecordMedia } from './record-media'


/**
 * La struttura del record del pacchetto
 */
export class RecordPacchetto {

    id             : number
    nome           : string
    descr          : string
    contro_ind     : string           // controindicazioni relative
    contro_ind_abs : string           // controindicazioni assolute
    pre_req        : string           // prerequisiti fisici
    pre_req_comp   : string           // prerequisiti comportamentali
    alert_msg      : string
    alert_msg_visibile : string
    bibliografia : string
    patologie_secondarie : string
    valutazione   : string
    come_valutare : string
    num_esercizi  : number
    note          : string
    id_scheda_val : number
  
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
      this.contro_ind_abs   = rec.contro_ind_abs
      this.pre_req      = rec.pre_req
      this.pre_req_comp = rec.pre_req_comp
      this.alert_msg    = rec.alert_msg
      this.alert_msg_visibile = rec.alert_msg_visibile
      this.bibliografia = rec.bibliografia
      this.patologie_secondarie  =rec.patologie_secondarie
      this.valutazione  = rec.valutazione
      this.come_valutare  = rec.come_valutare
      this.num_esercizi = rec.num_esercizi
      this.note  = rec.note
      this.id_scheda_val = rec.id_scheda_val
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
      this.contro_ind_abs = ""
      this.pre_req      = ""
      this.pre_req_comp = ""
      this.alert_msg    = ""
      this.alert_msg_visibile   = ""
      this.bibliografia         = ""
      this.patologie_secondarie = ""
      this.valutazione          = ""
      this.come_valutare        = ""
      this.num_esercizi = -1
      this.note = ""
      this.id_scheda_val = -1
    }
  

    /**
     * Elimina gli spazi laterari dai campi del record.
     */
    public trim() {
      this.nome           = NeuroApp.trimField ( this.nome )
      this.descr          = NeuroApp.trimField ( this.descr )
      this.contro_ind     = NeuroApp.trimField ( this.contro_ind )
      this.contro_ind_abs = NeuroApp.trimField ( this.contro_ind_abs )
      this.pre_req        = NeuroApp.trimField ( this.pre_req )
      this.pre_req_comp   = NeuroApp.trimField ( this.pre_req_comp )
      this.alert_msg      = NeuroApp.trimField ( this.alert_msg )
      this.alert_msg_visibile   = NeuroApp.trimField ( this.alert_msg_visibile )
      this.bibliografia         = NeuroApp.trimField ( this.bibliografia )
      this.patologie_secondarie = NeuroApp.trimField ( this.patologie_secondarie )
      this.valutazione          = NeuroApp.trimField (this.valutazione)
      this.come_valutare        = NeuroApp.trimField (this.come_valutare)
      this.note                 = NeuroApp.trimField (this.note)
    }


    /**
     * Sostuisce le string "&nbsp;" con il carattere spazio
     */
    public replace_nbsp() {
      this.descr          = NeuroApp.replace_nbsp ( this.descr )
      this.contro_ind     = NeuroApp.replace_nbsp ( this.contro_ind )
      this.contro_ind_abs = NeuroApp.replace_nbsp ( this.contro_ind_abs )
      this.pre_req        = NeuroApp.replace_nbsp ( this.pre_req )
      this.pre_req_comp   = NeuroApp.replace_nbsp ( this.pre_req_comp )
      this.alert_msg      = NeuroApp.replace_nbsp ( this.alert_msg )
      this.alert_msg_visibile   = NeuroApp.replace_nbsp ( this.alert_msg_visibile )
      this.bibliografia         = NeuroApp.replace_nbsp ( this.bibliografia )
      this.patologie_secondarie = NeuroApp.replace_nbsp ( this.patologie_secondarie )
      this.valutazione          = NeuroApp.replace_nbsp (this.valutazione)
      this.come_valutare        = NeuroApp.replace_nbsp (this.come_valutare)
      this.note                 = NeuroApp.replace_nbsp (this.note)
    }


    /**
     * Crea una nuova istanza di questo pacchetto con i campi codificati.
     */
    public encode() : RecordPacchetto {
       let out = new RecordPacchetto
       out.id   = this.id
       out.num_esercizi = this.num_esercizi
       out.nome = encodeURIComponent(this.nome)
       out.descr = encodeURIComponent(this.descr)
       out.contro_ind = encodeURIComponent(this.contro_ind)
       out.contro_ind_abs = encodeURIComponent(this.contro_ind_abs)
       out.pre_req = encodeURIComponent(this.pre_req)
       out.pre_req_comp = encodeURIComponent(this.pre_req_comp)
       out.alert_msg = encodeURIComponent(this.alert_msg)
       out.alert_msg_visibile = encodeURIComponent(this.alert_msg_visibile)
       out.bibliografia = encodeURIComponent(this.bibliografia)
       out.patologie_secondarie = encodeURIComponent(this.patologie_secondarie)
       out.valutazione = encodeURIComponent(this.valutazione)
       out.come_valutare = encodeURIComponent(this.come_valutare)
       out.note = encodeURIComponent(this.note)
       out.id_scheda_val = this.id_scheda_val
       return out
    }

    /**
     * Decodifica il pacchetto in input.
     * @param pkt 
     */
    public static decode(pkt : RecordPacchetto) {
      pkt.nome = decodeURIComponent(pkt.nome)
      pkt.descr = decodeURIComponent(pkt.descr)
      pkt.contro_ind = decodeURIComponent(pkt.contro_ind)
      pkt.contro_ind_abs = decodeURIComponent(pkt.contro_ind_abs)
      pkt.pre_req = decodeURIComponent(pkt.pre_req)
      pkt.pre_req_comp = decodeURIComponent(pkt.pre_req_comp)
      pkt.alert_msg = decodeURIComponent(pkt.alert_msg)
      pkt.alert_msg_visibile = decodeURIComponent(pkt.alert_msg_visibile)
      pkt.bibliografia = decodeURIComponent(pkt.bibliografia)
      pkt.patologie_secondarie = decodeURIComponent(pkt.patologie_secondarie)
      pkt.valutazione = decodeURIComponent(pkt.valutazione)
      pkt.come_valutare = decodeURIComponent(pkt.come_valutare)
      pkt.note = decodeURIComponent(pkt.note)
    }

  } // RecordPacchetto
  
  