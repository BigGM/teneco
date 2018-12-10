export class RecordMedia {
    id_media    : number
    url_media   : string
    descr_media : string
    usato_media : number    // 0: non collegato
                            // 1: collegato a qualche esercizio
                            
    constructor() {
        this.reset()
    }
    
    public reset() {
      this.id_media = -1
      this.url_media = ""
      this.descr_media = ""
      this.usato_media = 0
    }

    copy(rec:RecordMedia) {
      this.id_media = rec.id_media
      this.url_media = rec.url_media
      this.descr_media = rec.descr_media
      this.usato_media = rec.usato_media
    }
    
    public trim() {
      this.url_media = this.url_media.trim()
      this.descr_media = this.descr_media.trim()
    }
    
    
    public encode() : RecordMedia {
      let out = new RecordMedia()
      out.id_media = this.id_media
      out.usato_media = this.usato_media
      out.url_media = encodeURIComponent(this.url_media)
      out.descr_media = encodeURIComponent(this.descr_media)
      return out
    }
    
    public static decode(rec : RecordMedia) {
      rec.url_media = decodeURIComponent(rec.url_media)
      rec.descr_media = decodeURIComponent(rec.descr_media)
    }
    
} // RecordMedia
