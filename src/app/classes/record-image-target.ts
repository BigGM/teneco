
export class RecordImageTarget {
   id   : number
   url  : string
   nome : string
   categoria : string
   descr : string

   constructor() {
      this.reset()
   }

   public reset() {
      this.id = -1
      this.url = ""
      this.nome = ""
      this.categoria = ""
      this.descr = ""
   }

   copy(rec:RecordImageTarget) {
      this.id = rec.id
      this.url = rec.url
      this.nome = rec.nome
      this.categoria = rec.categoria
      this.descr = rec.descr   
   }

   public trim() {
      this.url = this.url.trim()
      this.nome = this.nome.trim()
      this.categoria = this.categoria.trim()
      this.descr = this.descr.trim()
   }

   public encode() : RecordImageTarget {
      let out = new RecordImageTarget()
      out.id  = this.id
      out.url = encodeURIComponent ( this.url )
      out.nome = encodeURIComponent(this.nome)
      out.categoria = encodeURIComponent(this.categoria)
      out.descr = encodeURIComponent(this.descr)
      return out
   }

   public static decode(rec : RecordImageTarget) {
      rec.url   = decodeURIComponent(rec.url)
      rec.descr = decodeURIComponent(rec.descr)
      rec.nome = decodeURIComponent(rec.nome)
      rec.categoria = decodeURIComponent(rec.categoria)
   }
}