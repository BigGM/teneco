import { NeuroApp } from '../neuro-app'


/**
 * La struttura record di un esercizio
 */
export class RecordEsercizio {
   id_pkt      : number      // id del pacchetto di appartenenza
   id_ambito   : number      // ambito
   id_ex       : number      // id dell'esercizio
   nome        : string
   descr       : string
   testo       : string
   alert       : string
   limitazioni : string
   id_grp      : number
   nome_grp    : string
   count_media : number

   constructor() {
      this.reset()
      this.id_pkt    = -1
      this.id_ambito = -1
   }
  
   /**
    * Copia l'esercizio in input su questo esercizio.
    * @param rec il record da ricopiare
    */
   copy(rec:RecordEsercizio) {
      this.id_pkt      = rec.id_pkt
      this.id_ambito   = rec.id_ambito
      this.id_ex       = rec.id_ex
      this.nome        = rec.nome
      this.descr       = rec.descr
      this.testo       = rec.testo
      this.alert       = rec.alert
      this.limitazioni = rec.limitazioni
      this.id_grp      = rec.id_grp
      this.nome_grp    = rec.nome_grp
      this.count_media = rec.count_media
   }
  
   /**
    * Reinizializza gli attributi della classe.
    * I campi numerici sono impostati a -1, i campi stringa a un valore vuoto. 
    */
   public reset() {
      //this.id_pkt      = -1
      //this.id_ambito   = -1
      this.id_ex       = -1
      this.nome        = ""
      this.descr       = ""
      this.testo       = ""
      this.alert       = ""
      this.limitazioni = ""
      this.id_grp      = -1
      this.nome_grp    = ""
      this.count_media = -1
   }

   /**
    * Elimina gli spazi laterari dai campi del record.
    */
   public trim() {
      this.nome        = NeuroApp.trimField ( this.nome )
      this.descr       = NeuroApp.trimField ( this.descr )
      this.testo       = NeuroApp.trimField ( this.testo )
      this.alert       = NeuroApp.trimField ( this.alert )
      this.limitazioni = NeuroApp.trimField ( this.limitazioni )
      this.nome_grp    = NeuroApp.trimField ( this.nome_grp )
   }

   /**
     * Crea una copia dell'esercizio corrente con i campi stringa codificati.
     */
   public encode() : RecordEsercizio {
      let out = new RecordEsercizio
      out.id_ex = this.id_ex
      out.id_pkt = this.id_pkt
      out.id_ambito = this.id_ambito
      out.id_grp = this.id_grp
      out.count_media = this.count_media
      out.nome  = encodeURIComponent(this.nome)
      out.descr = encodeURIComponent(this.descr)
      out.testo = encodeURIComponent(this.testo)
      out.alert = encodeURIComponent(this.alert)
      out.limitazioni = encodeURIComponent(this.limitazioni)
      out.nome_grp = encodeURIComponent(this.nome_grp)
      
      return out
   }

   /**
     * Decodifica i campi stringa dell'esercizio in input.
     * @param es
     */
   public static decode(es : RecordEsercizio) {
      es.nome  = decodeURIComponent(es.nome)
      es.descr = decodeURIComponent(es.descr)
      es.testo = decodeURIComponent(es.testo)
      es.alert = decodeURIComponent(es.alert)
      es.limitazioni = decodeURIComponent(es.limitazioni)
      es.nome_grp = decodeURIComponent(es.nome_grp)
   }

   
   /**
    * Sostuisce le string "&nbsp;" con il carattere spazio
    */
    public replace_nbsp() {
      this.descr  = NeuroApp.replace_nbsp ( this.descr )
      this.descr       = NeuroApp.replace_nbsp ( this.descr )
      this.testo       = NeuroApp.replace_nbsp ( this.testo )
      this.alert       = NeuroApp.replace_nbsp ( this.alert )
      this.limitazioni = NeuroApp.replace_nbsp ( this.limitazioni )     
    }
}