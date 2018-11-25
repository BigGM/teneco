import { NeuroApp } from '../neuro-app'

export class RecordMediaEsercizio {
	
	id      : number
   id_pkt  : number
   id_ex   : number
   url     : string
   tipo    : string
   descr   : string
     
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
   }
}
