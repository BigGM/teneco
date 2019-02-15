class Esercizio {
   id_esercizio : number
   nome_esercizio: string
   descr_esercizio : string
   assegnato : boolean

   public static decode (e: Esercizio) {
      e.nome_esercizio = decodeURIComponent(e.nome_esercizio)
      e.descr_esercizio = decodeURIComponent(e.descr_esercizio)
   }
}

export class EserciziPaziente {
   id_ambito : number
   id_pacchetto : number
   nome_pacchetto : string
   descr_pacchetto : string
   esercizi : Array<Esercizio>
   
   constructor() {
      this.esercizi = new Array<Esercizio>()
      this.id_ambito = -1
      this.id_pacchetto = -1
      this.nome_pacchetto = ""
      this.descr_pacchetto = ""
   }

   public static decode (p: EserciziPaziente) {
      p.nome_pacchetto = decodeURIComponent(p.nome_pacchetto)
      p.descr_pacchetto = decodeURIComponent(p.descr_pacchetto)
      p.esercizi.forEach (es => Esercizio.decode(es) )
   }
}
