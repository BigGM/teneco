
/** 
 * La classe CommonUpload contiene metodi statici comuni alle componenti di upload.
 */
import { FileUploader, FileItem } from 'ng2-file-upload';
import { NeuroApp } from '../neuro-app'


export class CommonUpload {

  /**
   * Controlla se il campo desrizione dell'item in input e' vuoto.
   * Ritorna true se e' vuoto, altrimenti false.
   * @param item FileItem
   */
  static descrIsEmpty(item:FileItem) : boolean {
    let descr = item.formData['descrizione']
    if (descr==null || descr=='undefined' || descr.trim()=="" )
      return true
    else
      return false
  }


  /**
   * Esegue l'upload sul server del FileItem in input. 
   * La descrizione e' obbligatoria, pertanto prima di delegare al metodo upload()
   * dell'item controlla che il campo sia valorizzato.
   * 
   * @param item item da inviare al server
   */
  static upload(item:FileItem) {
    if ( CommonUpload.descrIsEmpty(item) ) {
        NeuroApp.custom_error("La descrizione non può essere vuota: upload annullato.", "Errore")
        return
    }
    item.upload()
  }


  /**
   * Upload di tutti i file. Controlla che i campi descrizione siano tutti definiti, se non e'
   * cosi' emette un messaggio di errore e annulla l'operazione.
   */
  static uploadAll(uploader:FileUploader) {
    let foundEmptyDescr = false
    
    let items = uploader.getNotUploadedItems().filter( (item) => { return !item.isUploading })
    items.forEach( item => {
      if ( this.descrIsEmpty(item) ) {
        foundEmptyDescr = true
      }
    })
    if ( foundEmptyDescr ) {
      NeuroApp.custom_error("Uno o più campi di descrizione sono vuoti: upload annullato.", "Errore")
      return
    }
    uploader.uploadAll()
  } // uploadAll()
  
}
