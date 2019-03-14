import { NeuroApp } from '../neuro-app'

export class RecordMediaEsercizio {
	
	id      : number
   id_pkt  : number
   id_ex   : number
   url     : string
   tipo    : string
   descr   : string
   url_snapshot: string
     
   constructor() {
      this.reset()
   }
 
   reset() {
		this.id      = -1
		this.id_pkt  = -1
		this.id_ex   = -1
		this.url     = ""
		this.tipo    = ""
      this.descr   = ""
      this.url_snapshot = ""
   }

   /**
     * Decodifica sul posto il RecordMedia in input.
     * @param rec 
     */
   public static decode(rec : RecordMediaEsercizio) {
      rec.url = decodeURIComponent(rec.url)
      rec.tipo = decodeURIComponent(rec.tipo)
      rec.descr = decodeURIComponent(rec.descr)
      rec.url_snapshot = decodeURIComponent(rec.url_snapshot)
   }

   public encode() : RecordMediaEsercizio {
      let out = new RecordMediaEsercizio()
      out.id  = this.id
      out.id_pkt  = this.id_pkt
      out.id_ex  = this.id_ex
      out.url = encodeURIComponent ( this.url )
      out.tipo = encodeURIComponent(this.tipo)
      out.descr = encodeURIComponent(this.descr)
      out.url_snapshot = encodeURIComponent(this.url_snapshot)
      return out
   }
}
