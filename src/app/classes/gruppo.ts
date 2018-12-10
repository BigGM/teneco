
export class Gruppo {
   id_ambito : number    // i valori ammessi sono: 1, 2, 3, -1
   id   : number
   nome : string
   descr: string

   constructor() {
      this.id = -1
      this.nome = ""
      this.descr = ""
      this.id_ambito = -1
   }
}
