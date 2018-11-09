

/**
 * Descrive l'esito della esecuzione di una procedura ORACLE
 * status : OK/exception
 * message: un messaggio di ritorno, in particolare descrive l'errore verificatosi
 *          se status=exception
 */
export class Outcome {
    status:string;
    message:string;
}