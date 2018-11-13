 
     -- 
     -- Selezione elenco pazienti da TENECO  
     -- [TBV] identificativi paziente da altre tabelle ....  
     -- 
     SELECT TEN_IDENTIFICATIVI.EXTENSION CF ,
            max(nvl(ANAG_SESSO.VALORE_INT,TEN_PERSONE.ID_SESSO)) ID_SESSO,
            nvl(ANAG_DATA.VALORE_DATA,TEN_PERSONE.DATADINASCITA) DATADINASCITA,
            min(ANAG_COGNOME.VALORE_STR) COGNOME_NOME,
            min(TEN_NOMI.NOMECOMPLETO) NOMECOMPLETO, 
            -- min(ANAG_LUOGO.VALORE_STR) LUOGO, 
            min(ANAG_INDIR.VALORE_STR) INDIRIZZO 
     FROM (TEN_PERSONE 
           left outer join TEN_PERS_NOMI on 
                           TEN_PERS_NOMI.ID_PERSONA=TEN_PERSONE.ID_PERSONA                            
           left outer join TEN_NOMI on 
                           TEN_NOMI.ID_NOME=TEN_PERS_NOMI.ID_NOME),                            
          TEN_PERS_IDENT , 
          (TEN_IDENTIFICATIVI 
           left outer join TEN_LAST_ANAGR_PAZ ANAG_DATA on 
                           (ANAG_DATA.NOMECAMPO='DATADINASCITA' and 
                            ANAG_DATA.CODICEFISCALE=TEN_IDENTIFICATIVI.EXTENSION)
           left outer join TEN_LAST_ANAGR_PAZ ANAG_SESSO on 
                           (ANAG_SESSO.NOMECAMPO='ID_SESSO' and 
                            ANAG_SESSO.CODICEFISCALE=TEN_IDENTIFICATIVI.EXTENSION)
           left outer join TEN_LAST_ANAGR_PAZ ANAG_COGNOME on 
                           (ANAG_COGNOME.NOMECAMPO='NOME_PAZ' and 
                            ANAG_COGNOME.CODICEFISCALE=TEN_IDENTIFICATIVI.EXTENSION)                            
           left outer join TEN_LAST_ANAGR_PAZ ANAG_INDIR on 
                           (ANAG_INDIR.NOMECAMPO='IND_PAZ' and 
                            ANAG_INDIR.CODICEFISCALE=TEN_IDENTIFICATIVI.EXTENSION)                                                        
          )   
     WHERE  TEN_PERS_IDENT.ID_PERSONA = TEN_PERSONE.ID_PERSONA
       and  TEN_IDENTIFICATIVI.ID_IDENTIFICATIVO = TEN_PERS_IDENT.ID_IDENTIFICATIVO 
       and  length(TEN_IDENTIFICATIVI.EXTENSION) = 16
--  and TEN_IDENTIFICATIVI.EXTENSION='UNKUNK33M22B111A'
--  and TEN_IDENTIFICATIVI.EXTENSION='CMORNI80B19H501E' 
--  and TEN_IDENTIFICATIVI.EXTENSION='VRTCRS82D54A345H'
     group by TEN_IDENTIFICATIVI.EXTENSION,
              nvl(ANAG_DATA.VALORE_DATA,TEN_PERSONE.DATADINASCITA)     
     order by  1,3,2;
     
--+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
--+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

     -- 
     -- Selezione documentazione (TENECO) associata a CF='MORNI80B19H501E'
     -- 
     -- 
     SELECT TEN_IDENTIFICATIVI.EXTENSION CF, 
            TEN_DOCUMENTI.ID_TIPODOCUMENTO,
            TEN_TIPODOCUMENTO.TIPODOCUMENTO,
            TEN_DOCUMENTI.STATO,
            TEN_DOCUMENTI.DOC_CODE,
            TEN_DOCUMENTI.ID_DOCUMENTO,
            TEN_DOCUMENTI.ID_ORGANIZZAZIONE,
            TEN_DOCUMENTI.ID_PAZIENTE,
            TEN_PAZIENTI.ID_PERSONA
     FROM TEN_IDENTIFICATIVI,
          TEN_PERS_IDENT, 
          TEN_PAZIENTI,
          TEN_DOCUMENTI  
          left outer join TEN_TIPODOCUMENTO on
                          TEN_TIPODOCUMENTO.ID_TIPODOCUMENTO = TEN_DOCUMENTI.ID_TIPODOCUMENTO
     WHERE  
            TEN_IDENTIFICATIVI.EXTENSION='BSIMSA00A01H501F' -- BSIMSA00A01H501F  CMORNI80B19H501E
       and  TEN_PERS_IDENT.ID_IDENTIFICATIVO = TEN_IDENTIFICATIVI.ID_IDENTIFICATIVO  
       and  TEN_PAZIENTI.ID_PERSONA = TEN_PERS_IDENT.ID_PERSONA
       and  TEN_DOCUMENTI.ID_PAZIENTE = TEN_PAZIENTI.ID_PAZIENTE 
--  and TEN_IDENTIFICATIVI.EXTENSION='UNKUNK33M22B111A'
--  and TEN_IDENTIFICATIVI.EXTENSION='CMORNI80B19H501E' 
--  and TEN_IDENTIFICATIVI.EXTENSION='VRTCRS82D54A345H'
     order by  1;
        
     -- 
     -- +++++++++++++++ VisualizzaTesto 
     -- Chiave: ID_DOCUMENTO (es. 165)
     -- Tabelle: TEN_DOC_TESTO_SEZIONE, TEN_TIPOSEZIONE
     select 
            TEN_DOC_TESTO_SEZIONE.TITOLO,
            TEN_TIPOSEZIONE.TIPOSEZIONE, 
            TEN_TIPOSEZIONE.DESCRIZIONE,
            TEN_DOC_TESTO_SEZIONE.TESTO
     from   TEN_DOC_TESTO_SEZIONE 
            left outer join TEN_TIPOSEZIONE on
                     (TEN_TIPOSEZIONE.ID_TIPOSEZIONE = TEN_DOC_TESTO_SEZIONE.ID_TIPOSEZIONE)         
     where  TEN_DOC_TESTO_SEZIONE.ID_DOCUMENTO = 165; 










 -- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 -- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 -- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 -- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    -- DA_QUI estrarre documentazione paziente
    -- Diagnosi (ID_TIPOENTRY = 1), 
    -- Procedura, 
    -- Medicamenti, 
    -- Patologia, 
    -- Misurazioni, ... 

     SELECT TEN_DOC_TESTO_SEZIONE.* , TEN_ENTRY_SEZIONE.ID_TIPOENTRY
     FROM   TEN_DOC_TESTO_SEZIONE, TEN_ENTRY_SEZIONE, TEN_OSSERVAZIONI  
     WHERE TEN_DOC_TESTO_SEZIONE.ID_DOCUMENTO IN (124,144,183,182)
       and TEN_ENTRY_SEZIONE.ID_SEZIONE = TEN_DOC_TESTO_SEZIONE.ID_SEZIONE
       -- and TEN_ENTRY_SEZIONE.ID_TIPOENTRY = 1   
       and TEN_OSSERVAZIONI.ID_OSSERVAZIONE = TEN_ENTRY_SEZIONE.ID_ENTRY_REF;





