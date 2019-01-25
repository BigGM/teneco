export class RecordMedia {
    id_media    : number
    url_media   : string
    descr_media : string
    usato_media : number    // 0: non collegato
                            // 1: collegato a qualche esercizio
    url_snapshot : string   // url della snapshot se il media e' una applicazione
    url_param    : string   
                            
    constructor() {
        this.reset()
    }
    
    public reset() {
      this.id_media = -1
      this.url_media = ""
      this.descr_media = ""
      this.usato_media = 0
      this.url_snapshot = ""
      this.url_param = ""
    }

    copy(rec:RecordMedia) {
      this.id_media = rec.id_media
      this.url_media = rec.url_media
      this.descr_media = rec.descr_media
      this.usato_media = rec.usato_media
      this.url_snapshot = rec.url_snapshot
      this.url_param = rec.url_param
    }
    
    public trim() {
      this.url_media = this.url_media.trim()
      this.descr_media = this.descr_media.trim()
      this.url_snapshot = this.url_snapshot.trim()
      this.url_param = this.url_param.trim()
    }
    
    /**
     * Crea un nuovo RecordMedia codificando questo RecorMedia,
     * il RecordMedia corrente pertanto non viene modificato.
     */
    public encode() : RecordMedia {
      let out = new RecordMedia()
      out.id_media = this.id_media
      out.usato_media = this.usato_media
      out.url_media = encodeURIComponent(this.url_media)
      out.descr_media = encodeURIComponent(this.descr_media)
      out.url_snapshot = encodeURIComponent(this.url_snapshot)
      out.url_param = encodeURIComponent(this.url_param)
      return out
    }
    
    /**
     * Decodifica sul posto il RecordMedia in input.
     * @param rec 
     */
    public static decode(rec : RecordMedia) {
      rec.url_media = decodeURIComponent(rec.url_media)
      rec.descr_media = decodeURIComponent(rec.descr_media)
      rec.url_snapshot = decodeURIComponent(rec.url_snapshot)
      rec.url_param = decodeURIComponent(rec.url_param)
    }
    
} // RecordMedia
