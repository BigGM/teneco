export class Paziente {
   id_paziente : number
   nome : string 
   cognome: string
   cf : string 
   sesso : string
   data_nascita : string
   luogo_nascita : string 
   nazionalita : string 
   residenza : string 
   indirizzo : string 
   note: string

   constructor() {
      this.reset()
   }

   reset() {
      this.id_paziente = -1
      this.nome = ""
      this.cognome= ""
      this.cf = ""
      this.sesso= ""
      this.data_nascita = ""
      this.luogo_nascita = ""
      this.nazionalita = ""
      this.residenza = ""
      this.indirizzo = ""
      this.note= ""
   }

   copy(p:Paziente) {
      this.id_paziente = p.id_paziente
      this.nome = p.nome
      this.cognome= p.cognome
      this.cf = p.cf
      this.sesso= p.sesso
      this.data_nascita = p.data_nascita
      this.luogo_nascita = p.luogo_nascita
      this.nazionalita = p.nazionalita
      this.residenza = p.residenza
      this.indirizzo = p.indirizzo
      this.note= p.note
   }


   public encode() : Paziente {
      let out = new Paziente
      out.id_paziente = this.id_paziente
      out.nome = encodeURIComponent(this.nome)
      out.cognome = encodeURIComponent(this.cognome)
      out.cf = encodeURIComponent(this.cf)
      out.sesso = encodeURIComponent(this.sesso)
      out.data_nascita = encodeURIComponent(this.data_nascita)
      out.luogo_nascita = encodeURIComponent(this.luogo_nascita)
      out.nazionalita = encodeURIComponent(this.nazionalita)
      out.residenza = encodeURIComponent(this.residenza)
      out.indirizzo = encodeURIComponent(this.indirizzo)
      out.note = encodeURIComponent(this.note)
      return out;
   }

   public static decode(p : Paziente) {
      p.nome = decodeURIComponent(p.nome)
      p.cognome = decodeURIComponent(p.cognome)
      p.cf = decodeURIComponent(p.cf)
      p.sesso = decodeURIComponent(p.sesso)
      p.data_nascita = decodeURIComponent(p.data_nascita)
      p.luogo_nascita = decodeURIComponent(p.luogo_nascita)
      p.nazionalita = decodeURIComponent(p.nazionalita)
      p.residenza = decodeURIComponent(p.residenza)
      p.indirizzo = decodeURIComponent(p.indirizzo)
      p.note = decodeURIComponent(p.note)
   }



}
