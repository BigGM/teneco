import { NeuroApp } from '../neuro-app'


/**
 * La struttura record di un esercizio
 */
export class RecordEsercizio {
   id_pkt      : number      // id del pacchetto di appartenenza
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
   }
  
   /**
    * Copia l'eserizio in input su questo esercizio.
    * @param rec il record da ricopiare
    */
   copy(rec:RecordEsercizio) {
      this.id_pkt      = rec.id_pkt
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
      this.id_pkt      = -1
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
}