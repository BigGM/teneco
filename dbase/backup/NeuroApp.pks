/*<TOAD_FILE_CHUNK>*/

rem

rem =====================================================================================================
rem Nome :  Angular.pks
rem Descr:  Definisce le procedure di base per la manipolazione della tabella presentata su browser: 
rem         lettura, inserimento record, cancellazione record, modifica record.
rem         Si osservi che mentre il nome delle procedure e quello dei parametri sono arbitrari,
rem         NON LO E' IL TIPO DEI PARAMETRI (comprese le specifiche 'in', 'out', 'in out') E L'ORDINE.
rem         Tutte le procedure utilizzano la funzione parseParams() che trasforma una lista di coppie
rem         nome=valore in un array associativo: !!!! NON MODIFICARE QUESTA FUNZIONE, PLEASE !!!!!
rem -----------------------------------------------------------------------------------------------------
rem Storia delle Revisioni:
rem
rem -----------------------------------------------------------------------------------------------------
rem Ver    Data         Autore     Commenti
rem 1.0    20.01.2016   BigGM      Prima Versione
rem =====================================================================================================
rem


PROMPT
PROMPT Package NeuroApp ...

SET SCAN OFF

CREATE OR REPLACE PACKAGE NeuroApp AS

--
-- Dichiarazione di eccezione di caricamento
--
NEUROAPP_EXCEPTION EXCEPTION;

--
-- Definizione di tipo: array associativo di stringhe indicizzate su intero
--
TYPE StringArray2 IS TABLE OF VARCHAR2(60) index by pls_integer;

--
-- Definizione di tipo: array associativo di stringhe indicizzate su stringa
--
TYPE StringArray IS TABLE OF VARCHAR2(1024) index by VARCHAR2(255);




Function parseParams (p_params in varchar2) return StringArray;

PROCEDURE glossario(  p_outcome in out varchar2, 
                      p_cursor OUT SYS_REFCURSOR);
                      
PROCEDURE def_glossario(  p_id_voce in varchar2,
                          p_outcome in out varchar2, 
                          p_cursor OUT SYS_REFCURSOR);


PROCEDURE lista_video(p_lista_video_id in varchar2,
                      p_outcome in out varchar2, 
                      p_cursor OUT SYS_REFCURSOR);
                      
PROCEDURE lista_media(p_tipo_media in varchar2,
                      p_lista_video_id in varchar2,
                      p_outcome in out varchar2, 
                      p_cursor OUT SYS_REFCURSOR);
                          

PROCEDURE lista_gruppi(p_outcome in out varchar2, 
                       p_cursor OUT SYS_REFCURSOR);
                          
                          
PROCEDURE lista_gruppi_patologie(p_outcome in out varchar2, 
                                 p_cursor OUT SYS_REFCURSOR);
                                 
PROCEDURE lista_patologie_gruppo(p_code_gruppo in varchar2,
                                 p_outcome in out varchar2, 
                                 p_cursor OUT SYS_REFCURSOR);
                          

PROCEDURE lista_pacchetti(p_ambito in varchar2,
                          p_outcome in out varchar2, 
                          p_cursor OUT SYS_REFCURSOR);



PROCEDURE salva_pacchetto(p_nome in varchar2, 
                          p_descr in varchar2,
                          p_prerequisiti in varchar2,
                          p_controindicazioni in varchar2,
                          p_alert in varchar2,
                          p_ambito in varchar2,
                          p_outcome in out varchar2);
                          
PROCEDURE salva_pacchetto_modificato(p_id_pacchetto in varchar2,
                          p_nome in varchar2, 
                          p_descr in varchar2, 
                          p_outcome in out varchar2);


PROCEDURE cancella_pacchetto(p_id_pacchetto in varchar2, p_outcome in out varchar2);


PROCEDURE lista_esercizi(p_id_pacchetto in varchar2, 
                         p_outcome in out varchar2, 
                         p_cursor OUT SYS_REFCURSOR);

PROCEDURE salva_esercizio(p_id_pacchetto in varchar2, 
                          p_nome_esercizio in varchar2,
                          p_desc_esercizio in varchar2,
                          p_id_gruppo in varchar2,
                          p_outcome in out varchar2);
                          
PROCEDURE salva_esercizio_modificato(p_id_pacchetto in varchar2,
                          p_id_esercizio in varchar2,
                          p_desc_esercizio in varchar2,
                          p_id_gruppo in varchar2,
                          p_outcome in out varchar2);
                          
                          
PROCEDURE cancella_esercizio(p_id_pacchetto in varchar2,
                             p_id_esercizio in varchar2,
                             p_outcome in out varchar2);


PROCEDURE lista_dettaglio_esercizio(p_id_pacchetto in varchar2,
                                    p_id_esercizio in varchar2,
                                    p_outcome in out varchar2, 
                                    p_cursor OUT SYS_REFCURSOR);
                                    
PROCEDURE cancella_media_esercizio(p_id_pacchetto in varchar2,
                         p_id_esercizio in varchar2,
                         p_id_media in varchar2,
                         p_outcome in out varchar2);
                         
PROCEDURE aggiungi_media_esercizio(p_id_pacchetto in varchar2,
                         p_id_esercizio in varchar2,
                         p_id_media in varchar2,
                         p_outcome in out varchar2);

PROCEDURE lista_glossario(p_outcome in out varchar2, 
                           p_cursor OUT SYS_REFCURSOR);

PROCEDURE salva_glossario(p_voce in varchar2,
                          p_definizione in varchar2,
                          p_outcome in out varchar2);

PROCEDURE salva_glossario_modificato(p_id_voce in varchar2,
                                     p_voce in varchar2, 
                                     p_definizione in varchar2, 
                                     p_outcome in out varchar2);

PROCEDURE cancella_glossario(p_id_voce in varchar2, 
                             p_outcome in out varchar2);                             


PROCEDURE aggiungi_media(p_url in varchar2,
                         p_descr_media in varchar2,
                         p_tipo_media in varchar2, 
                         p_outcome in out varchar2);

FUNCTION  media_collegato(p_id_media in varchar2) return varchar2;


PROCEDURE rimuovi_media(p_id_media in varchar2,
                        p_outcome in out varchar2);
                        

END NeuroApp;
/
/*<TOAD_FILE_CHUNK>*/

show errors;
