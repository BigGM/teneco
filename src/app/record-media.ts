export class RecordMedia {
    id_media    : number
    url_media   : string
    descr_media : string
    usato_media : number    // 0: non collegato
                            // 1: collegato a qualche esercizio
}

export class RecordMediaError {
    id_media : string
    errmsg   : string
}
