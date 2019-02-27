/*<TOAD_FILE_CHUNK>*/

rem
rem =====================================================================================================
rem Nome :  Angular.pkb
rem Descr:  Implementa le procedure di base per la manipolazione della tabella presentata su browser: 
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
PROMPT Package body NeuroApp....

SET SCAN OFF

CREATE OR REPLACE PACKAGE BODY NeuroApp AS


-- ============================================================================================
-- Name  : --parseParams--
-- Descr : Trasforma la lista delle coppie parametro=valore in ingresso in un array associativo.
--         La stringa in input ha la forma:
--         param_1=valore_1|param_2=valore_2|...|param_n=valore_n|
--         I campi valore_1,...,valore_n   possono contenere
--         1. una stringa con il valore del parametro;
--         2. la stringa '{}'     , puo' arrivare solo nell'azione di filtro e significa che il campo
--                                  non va inserito nella condizione di where (buildWhere);
--         3. la stringa '{null}' , significa che il campo e' null e deve essere inserito come null
--    
--         l'uscita e' un array hash in cui la chiave e' il nome di un parametro (es. param_1)
--         e il valore e' il valore corrispondente (es. valore_1)
-- Return: array associativo di coppie: nome_campo=valore_campo
-- ============================================================================================
Function parseParams(p_params in varchar2) return StringArray
IS
    k integer;
    nome varchar2(255);
    valore varchar2(1024);
    aparams StringArray;
    emptyArray StringArray;
    
    CURSOR C1 IS
    select regexp_substr(p_params,'[^|]+', 1, level) param from dual
    connect by regexp_substr(p_params, '[^|]+', 1, level) is not null;
    
BEGIN

    if (p_params is null or length(p_params)=0) then
        return emptyArray;
    end if;
    
    for c1rec in c1 loop
        k := instr(c1rec.param,'=');
        nome   := substr(c1rec.param,1,k-1);
        valore := substr(c1rec.param,k+1,length(c1rec.param));
                
        -- special cases : null
        if (valore='{null}') then
            valore := null;
        end if;
        
        aparams(nome) := valore;
        --if ( aparams(nome) is null) then
        --    dbms_output.put_line('<'||nome || '><null>');
        --else
        --    dbms_output.put_line('<'||nome || '><' || aparams(nome) || '>');
        --end if;
    end loop;
    
    return aparams;
    
EXCEPTION
   when others then return emptyArray;
END parseParams;


-- ========================================================================================
-- Name  : --buildWhere--
-- Descr : Costruisce la condizione di where da applicare nella lettura con filtro
-- Param : p_params - i valori assegnati ai campi nel filtro
-- Return: la condizione di where
-- ========================================================================================
Function buildWhere(p_params StringArray) return varchar2
IS
    where_cond varchar2(4000);
    field varchar2(255);
Begin

    where_cond := '';
    
    field := p_params('descr'); 
    if ( field is null ) then
        where_cond := where_cond || ' descr is null and ';
    elsif ( length(field) > 0 ) then
        if (field='{}' ) then  -- campo vuoto: non entra nella condizione di where per il filtro
            null;
        elsif ( instr(field,'%') > 0) then
            where_cond := where_cond || ' descr like ''' || field || ''' and ';
        else 
            where_cond := where_cond || ' descr = ''' || field || ''' and ';
        end if;
    end if;

    field := p_params('radiceIdSiebel'); 
    if ( field is null ) then
        where_cond := where_cond || ' RADICEIDSIEBEL is null and ';
    elsif ( length(field) > 0 ) then
        if (field='{}' ) then  -- campo vuoto: non entra nella condizione di where per il filtro
            null;
        elsif ( instr(field,'%') > 0) then
            where_cond := where_cond || ' RADICEIDSIEBEL like ''' || field || ''' and ';
        else 
            where_cond := where_cond || ' RADICEIDSIEBEL = ''' || field || ''' and ';
        end if;
    end if;
        
    field := p_params('lastIdSiebel');
    if ( field is null ) then
        where_cond := where_cond || ' LASTIDSIEBEL is null and ';
    elsif ( length(field) > 0 ) then
        if (field='{}' ) then  -- campo vuoto: non entra nella condizione di where per il filtro
            null;
        elsif ( instr(field,'%') > 0) then
            where_cond := where_cond || ' LASTIDSIEBEL like ''' || field || ''' and ';
        else 
            where_cond := where_cond || ' LASTIDSIEBEL = ''' || field || ''' and ';
        end if;
    end if;
    
    field := p_params('dataPresaInCarico');
    dbms_output.put_line('dataPresaInCarico ' || field);
    if ( field is null ) then
        where_cond := where_cond || ' dataPresaInCarico is null and ';
    elsif ( length(field) > 0 ) then
        if (field = '{}') then
            null;
        else 
            where_cond := where_cond || ' dataPresaInCarico = to_date('''||field||''', ''YYYY-MM-DD"T"HH24:MI:SS'') and ';
        end if;
    end if;
    
    field := p_params('dataEspletamento');
    if ( field is null ) then
        where_cond := where_cond || ' dataEspletamento is null and ';
    elsif ( length(field) > 0 ) then
        if (field = '{}') then
            null;
        else 
            where_cond := where_cond || ' dataEspletamento = to_date('''||field||''', ''YYYY-MM-DD"T"HH24:MI:SS'') and ';
        end if;
    end if;
    
    field := p_params('aol');
    if ( field is null ) then
        where_cond := where_cond || ' ID_AOL is null and ';
    elsif ( length(field) > 0 ) then
        if (field='{}' ) then  -- campo vuoto: non entra nella condizione di where per il filtro
            null;
        elsif ( instr(field,'%') > 0) then
            where_cond := where_cond || ' ID_AOL like ''' || field || ''' and ';
        else 
            where_cond := where_cond || ' ID_AOL = ' || field || ' and ';
        end if;
    end if;
    
    
    field := p_params('workType');
    if ( field is null ) then
        where_cond := where_cond || ' ID_WORK_TYPE is null and ';
    elsif ( length(field) > 0 ) then
        if (field = '{}') then
            null;
        elsif ( instr(field,'%') > 0) then
            where_cond := where_cond || ' ID_WORK_TYPE like ''' || field || ''' and ';
        else 
            where_cond := where_cond || ' ID_WORK_TYPE = ' || field || ' and ';
        end if;
    end if;
    
    
    field := p_params('dataFinale');
    if ( field is null ) then
        where_cond := where_cond || ' DATAFINALE is null and ';
    elsif ( length(field) > 0 ) then
        if (field = '{}') then
            null;
        else 
            where_cond := where_cond || ' DATAFINALE = to_date('''||field||''', ''YYYY-MM-DD"T"HH24:MI:SS'') and ';
        end if;
    end if;
    
        dbms_output.put_line('where_cond ' || where_cond);
    
    field := p_params('htmlField');
    if ( field is null ) then
        where_cond := where_cond || ' HTMLFIELD is null and ';
    elsif ( length(field) > 0 ) then
        if (field = '{}') then
            null;
        else 
            where_cond := where_cond || ' HTMLFIELD=''' || field || ''' and ';
        end if;
    end if;
    
        dbms_output.put_line('where_cond ' || where_cond);

    -- Chiude correttamente l'ultimo 'and' con una condizione ovviamente vera
    if ( length(where_cond) > 0 ) then
        where_cond := 'WHERE ' || where_cond || ' 1=1';
    end if;
    
    return where_cond;
    
Exception
    when others then
    dbms_output.put_line(sqlerrm); 
    
    where_cond:=null;
    return where_cond;

End  buildWhere;



PROCEDURE glossario(p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    select id_voce, voce, definizione
      from GCA_GLOSSARIO
     order by voce;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END glossario;


PROCEDURE def_glossario(  p_id_voce in varchar2,
                          p_outcome in out varchar2, 
                          p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    select id_voce, voce, definizione
      from GCA_GLOSSARIO
     where id_voce = p_id_voce;
      

EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END def_glossario;        
            


PROCEDURE lista_gruppi(p_ambito in varchar2, p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    if p_ambito > 0 then
        OPEN p_cursor FOR
        SELECT id_ambito, id_gruppo, nome_gruppo, nvl(desc_gruppo,'') as descr 
        from GCA_GRUPPI
        where id_ambito = p_ambito
        order by id_gruppo asc;
        
        --  and id_gruppo <> -1;
    else
        OPEN p_cursor FOR
        SELECT id_ambito, id_gruppo, nome_gruppo, nvl(desc_gruppo,'') as descr 
        from GCA_GRUPPI
        order by id_ambito, id_gruppo asc; 
        -- where id_gruppo <> -1;
    end if;    
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_gruppi;



PROCEDURE lista_gruppi_patologie(p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    select id_patologia, cod_icd9CMDIA, patologia
     from GCA_PATOLOGIE_1
    where cod_icd9CMDIA between 290 and 359
    order by 1;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_gruppi_patologie;


PROCEDURE lista_patologie_gruppo(p_code_gruppo in varchar2,
                                 p_outcome in out varchar2, 
                                 p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    select id_patologia, cod_icd9CMDIA, patologia
    from GCA_PATOLOGIE
    where cod_icd9CMDIA like p_code_gruppo||'.%'
    order by 2;

EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_patologie_gruppo;                                 



--
-- Ritorna la lista dei video presenti sulla tabella dei media escludendo gli id_media
-- definiti nella lista p_lista_video_id
--
PROCEDURE lista_video(p_lista_video_id in varchar2,
                      p_outcome in out varchar2, 
                      p_cursor OUT SYS_REFCURSOR)
IS
    p_id    integer;
    p_url   varchar2(1024);
    p_descr varchar2(4000);
BEGIN
    p_outcome := 'OK';
    
    OPEN p_cursor FOR
    'SELECT id_media, url, nvl(descr_media,'''') as descr ' ||
    '  from GCA_MULTIMEDIA ' ||
    '  where tipo=''video'' ' ||
    '    and id_media not in ('||p_lista_video_id||')';
    
    return;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_video;


PROCEDURE lista_media(p_tipo_media in varchar2,
                      p_lista_video_id in varchar2,
                      p_outcome in out varchar2, 
                      p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    OPEN p_cursor FOR
    'SELECT id_media, url, nvl(descr_media,'''') as descr, NeuroApp.media_collegato(id_media), url_snapshot, url_param' ||
    '  from GCA_MULTIMEDIA ' ||
    '  where tipo like '''||p_tipo_media||'%'' ' ||
    '    and id_media not in ('||p_lista_video_id||') order by tipo, upper(descr)';

    return;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_media;


FUNCTION count_esercizi (p_id_pacchetto in integer) return integer
IS
  num_es integer;
BEGIN
    num_es := 0;
    select count('x') into num_es 
      from gca_pacchetti_esercizi 
     where id_pacchetto = p_id_pacchetto;
    return num_es;
EXCEPTION
    when others then return -1;
end count_esercizi;



FUNCTION count_media (p_id_pacchetto in integer, p_id_esercizio in integer) return integer
IS
  num_es integer;
BEGIN
    num_es := 0;  
    select count('x') into num_es
      from GCA_ESERCIZIO_MEDIA 
     where id_pacchetto = p_id_pacchetto 
       and id_esercizio = p_id_esercizio;
       
    return num_es;
EXCEPTION
    when others then return -1;
end count_media;




PROCEDURE lista_pacchetti(p_ambito in varchar2, p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    SELECT id_pacchetto, nome_pacchetto, trim(nvl(replace(descr_pacchetto,'"','\"'),'')) as descr,
           replace(controindicazioni,'"','"\'),
           replace(prerequisiti,'"','"\'),
           replace(alert,'"','"\'),
           replace(alert_visibile,'"','"\'),
           replace(bibliografia,'"','"\'),
           replace(patologie_secondarie,'"','"\'),
           replace(valutazione,'"','"\'),
           count_esercizi(id_pacchetto),
           note,
           CONTROINDICAZIONI_ASS, 
           PREREQUISITI_COMP,
           COME_VALUTARE,
           ID_SCHEDA_VALUTAZIONE
    from GCA_PACCHETTI
        left outer join GCA_AMBITO on 
            GCA_AMBITO.id_ambito=GCA_PACCHETTI.id_ambito
        left outer join GCA_PATOLOGIE on 
            GCA_PATOLOGIE.id_patologia=GCA_PACCHETTI.id_patologia
    where GCA_PACCHETTI.id_ambito = p_ambito
    order by nome_pacchetto;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END lista_pacchetti;



PROCEDURE lista_pacchetti2(p_ambito in varchar2, p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    SELECT id_pacchetto, nome_pacchetto, descr_pacchetto,
           controindicazioni,
           prerequisiti,
           alert,
           alert_visibile,
           bibliografia,
           patologie_secondarie,
           valutazione,
           count_esercizi(id_pacchetto),
           note,
           controindicazioni_ass,
           prerequisiti_comp,
           come_valutare,
           nvl(id_scheda_valutazione,-1)
    from GCA_PACCHETTI
        left outer join GCA_AMBITO on 
            GCA_AMBITO.id_ambito=GCA_PACCHETTI.id_ambito
        left outer join GCA_PATOLOGIE on 
            GCA_PATOLOGIE.id_patologia=GCA_PACCHETTI.id_patologia
    where GCA_PACCHETTI.id_ambito = p_ambito
    order by nome_pacchetto;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END lista_pacchetti2;


PROCEDURE get_scheda_valutazione(p_id_scheda in varchar2,
                                 p_outcome in out varchar2, 
                                 p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    OPEN p_cursor FOR
      select descr_media, url
        from GCA_multimedia
       where id_media = p_id_scheda;

     
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END get_scheda_valutazione;


PROCEDURE salva_pacchetto(p_nome in varchar2, 
                          p_descr in clob,
                          p_prerequisiti in clob,
                          p_controindicazioni in clob,
                          p_alert in clob,
                          p_alert_visibile in clob,
                          p_bibliografia in clob,
                          p_patologie_secondarie in clob,
                          p_valutazione in clob,
                          p_note in clob,                          
                          p_controindicazioni_ass in clob,
                          p_prerequisiti_comp in clob,
                          p_come_valutare in clob,
                          p_ambito in varchar2,
                          p_id_scheda_val in varchar2,
                          p_outcome in out varchar2)
IS
 scheda_valutazione integer := p_id_scheda_val;
BEGIN
    p_outcome := 'OK';
    
    if scheda_valutazione= -1 then
      scheda_valutazione := null;
    end if;
    
    insert into GCA_PACCHETTI(id_pacchetto,
                              nome_pacchetto,
                              descr_pacchetto,
                              prerequisiti,
                              controindicazioni,
                              alert,
                              alert_visibile,
                              bibliografia,
                              patologie_secondarie,
                              valutazione,
                              note,
                              controindicazioni_ass,
                              prerequisiti_comp,
                              come_valutare,
                              id_scheda_valutazione,
                              id_ambito ) 
    values (S_GCA_PACCHETTI_ID_PACCHETTO.nextval, 
            p_nome, 
            p_descr, 
            p_prerequisiti,
            p_controindicazioni,
            p_alert, 
            p_alert_visibile,
            p_bibliografia,
            p_patologie_secondarie,
            p_valutazione,
            p_note,
            p_controindicazioni_ass,
            p_prerequisiti_comp,
            p_come_valutare,
            scheda_valutazione,
            p_ambito);
    commit;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END;


PROCEDURE salva_pacchetto_modificato (
                          p_id_pacchetto in varchar2,
                          p_nome in varchar2, 
                          p_descr in clob, 
                          p_prerequisiti in clob,
                          p_controindicazioni in clob,
                          p_alert in clob,                          
                          p_alert_visibile in clob,
                          p_bibliografia in clob,
                          p_patologie_secondarie in clob,
                          p_valutazione in clob,
                          p_note in clob,
                          p_controindicazioni_ass in clob,
                          p_prerequisiti_comp in clob,
                          p_come_valutare in clob,
                          p_id_scheda_val in varchar2,
                          p_outcome in out varchar2)
IS
  esiste_pacchetto integer := 0;
  scheda_valutazione integer := p_id_scheda_val;
BEGIN
    p_outcome := 'OK';
    
    if scheda_valutazione= -1 then
      scheda_valutazione := null;
    end if;
    
    -- Non deve esiste un pacchetto col nuovo nome scelto
    select count('x') into esiste_pacchetto
      from gca_pacchetti where lower(nome_pacchetto) = lower(p_nome)
       and id_pacchetto <> p_id_pacchetto;
      
    if esiste_pacchetto > 0 then
      p_outcome:='Exception: esiste un pacchetto col nome "'||p_nome||'"';
      return;
    end if;
    
    -- e' possibile eseguire l'aggiornamento
    update gca_pacchetti
       set nome_pacchetto = p_nome,
           descr_pacchetto = p_descr,
           prerequisiti = p_prerequisiti,
           controindicazioni =  p_controindicazioni,
           alert = p_alert ,
           alert_visibile = p_alert_visibile ,
           bibliografia = p_bibliografia ,            
           patologie_secondarie = p_patologie_secondarie,
           valutazione = p_valutazione,
           note = p_note,
           controindicazioni_ass = p_controindicazioni_ass,
           prerequisiti_comp = p_prerequisiti_comp,
           come_valutare = p_come_valutare,
           id_scheda_valutazione = scheda_valutazione
     where id_pacchetto = p_id_pacchetto;
    
    commit;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END;


PROCEDURE cancella_pacchetto(p_id_pacchetto in varchar2, p_outcome in out varchar2)
IS
BEGIN
    p_outcome := 'OK';
    delete gca_esercizio_media where id_pacchetto = p_id_pacchetto;
    delete gca_pacchetti_esercizi  where id_pacchetto = p_id_pacchetto;
    delete gca_pacchetti where id_pacchetto = p_id_pacchetto;
    commit;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END cancella_pacchetto;



PROCEDURE lista_esercizi(p_id_pacchetto in varchar2, p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    open p_cursor for
    select  GCA_PACCHETTI_ESERCIZI.id_pacchetto   id_pacchetto,
            GCA_PACCHETTI.id_ambito id_ambito,
            GCA_PACCHETTI_ESERCIZI.id_esercizio   id_esercizio,
            GCA_PACCHETTI_ESERCIZI.nome_esercizio nome_esercizio,
            GCA_PACCHETTI_ESERCIZI.desc_esercizio desc_esercizio,
            GCA_PACCHETTI_ESERCIZI.testo_esercizio testo_esercizio,
            GCA_PACCHETTI_ESERCIZI.alert_esercizio alert_esercizio,
            GCA_PACCHETTI_ESERCIZI.limitazioni_esercizio limitazioni_esercizio,            
            GCA_GRUPPI.id_gruppo        id_gruppo,
            GCA_GRUPPI.nome_gruppo      nome_gruppo,
            NeuroApp.count_media(GCA_PACCHETTI_ESERCIZI.id_pacchetto,GCA_PACCHETTI_ESERCIZI.id_esercizio) num_media
    from  GCA_GRUPPI, GCA_PACCHETTI, GCA_PACCHETTI_ESERCIZI
    where  GCA_PACCHETTI_ESERCIZI.id_pacchetto = p_id_pacchetto  and
           GCA_PACCHETTI_ESERCIZI.id_pacchetto = GCA_PACCHETTI.ID_PACCHETTO and 
           GCA_PACCHETTI_ESERCIZI.id_gruppo = gca_gruppi.id_gruppo and 
           GCA_PACCHETTI.id_ambito = gca_gruppi.id_ambito
    order by 1,4;   
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END lista_esercizi;


PROCEDURE lista_dettaglio_esercizio(p_id_pacchetto in varchar2,
                                    p_id_esercizio in varchar2,
                                    p_outcome in out varchar2, 
                                    p_cursor OUT SYS_REFCURSOR) 
IS
BEGIN
    p_outcome := 'OK';
    
    open p_cursor for
    select  GCA_PACCHETTI_ESERCIZI.id_pacchetto   id_pacchetto,
            GCA_PACCHETTI_ESERCIZI.id_esercizio   id_esercizio,
            nvl(GCA_MULTIMEDIA.id_media,-1)       id_media,
            GCA_MULTIMEDIA.url                    url,
            GCA_MULTIMEDIA.tipo                   tipo,
            GCA_MULTIMEDIA.descr_media            descr_media,
            GCA_MULTIMEDIA.url_snapshot           url_snapshot
    from GCA_PACCHETTI_ESERCIZI
        left outer join GCA_ESERCIZIO_MEDIA
        on GCA_ESERCIZIO_MEDIA.id_esercizio = GCA_PACCHETTI_ESERCIZI.id_esercizio and 
           GCA_ESERCIZIO_MEDIA.id_pacchetto = GCA_PACCHETTI_ESERCIZI.id_pacchetto
        left outer join GCA_MULTIMEDIA
        on GCA_MULTIMEDIA.id_media = GCA_ESERCIZIO_MEDIA.id_media                   
    where   GCA_PACCHETTI_ESERCIZI.id_pacchetto = p_id_pacchetto and 
            GCA_PACCHETTI_ESERCIZI.id_esercizio = p_id_esercizio               
    order by 1,2,3;  
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
   
END;


PROCEDURE salva_esercizio(p_id_pacchetto in varchar2, 
                          p_nome_esercizio in varchar2,
                          p_desc_esercizio in clob,
                          p_testo_esercizio in clob,
                          p_alert_esercizio in clob,
                          p_limitazioni_esercizio in clob,
                          p_id_gruppo in varchar2,
                          p_outcome in out varchar2)                          
IS
    esiste_esercizio integer;
    gruppo varchar2(100);
BEGIN
    p_outcome := 'OK';
    
    select count('x') into esiste_esercizio
      from GCA_PACCHETTI_ESERCIZI
     where lower(nome_esercizio) = lower(p_nome_esercizio)
        and id_pacchetto = p_id_pacchetto; 
      
    if esiste_esercizio >0 then
      p_outcome := 'Exception: esiste un esercizio con il nome "' || p_nome_esercizio || '"';
      return;
    end if;
    
   
    insert into GCA_PACCHETTI_ESERCIZI
                (id_pacchetto,
                 id_esercizio,
                 nome_esercizio,
                 desc_esercizio,
                 testo_esercizio,
                 alert_esercizio,
                 limitazioni_esercizio,
                 id_gruppo) values 
                 (p_id_pacchetto,
                  S_GCA_PACK_ESERC_ID_ESERCIZIO.nextval,
                  p_nome_esercizio,
                  p_desc_esercizio,
                  p_testo_esercizio,
                  p_alert_esercizio,
                  p_limitazioni_esercizio,
                  p_id_gruppo);
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_esercizio;


PROCEDURE salva_esercizio_modificato(p_id_pacchetto in varchar2,
                          p_id_esercizio in varchar2,
                          p_desc_esercizio in clob,
                          p_testo_esercizio in clob,
                          p_alert_esercizio in clob,
                          p_limitazioni_esercizio in clob,
                          p_id_gruppo in varchar2,
                          p_outcome in out varchar2)                      
IS
    gruppo varchar2(100);
BEGIN
    p_outcome := 'OK';
      
    update GCA_PACCHETTI_ESERCIZI
       set desc_esercizio = p_desc_esercizio,
           testo_esercizio = p_testo_esercizio,
           alert_esercizio = p_alert_esercizio,
           limitazioni_esercizio = p_limitazioni_esercizio,
           id_gruppo = p_id_gruppo
     where id_pacchetto = p_id_pacchetto
       and id_esercizio = p_id_esercizio;

    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END;





PROCEDURE cancella_esercizio(p_id_pacchetto in varchar2,
                             p_id_esercizio in varchar2,
                             p_outcome in out varchar2)
IS
BEGIN             
    p_outcome:= 'OK';
    
     delete gca_esercizio_media
     where id_pacchetto = p_id_pacchetto
       and id_esercizio = p_id_esercizio;
     
     delete gca_pacchetti_esercizi
     where id_pacchetto = p_id_pacchetto
       and id_esercizio = p_id_esercizio;
       
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END;


--
-- cancella un elemento multimedia dall'esercizio specificato
--
PROCEDURE cancella_media_esercizio(p_id_pacchetto in varchar2,
                         p_id_esercizio in varchar2,
                         p_id_media in varchar2,
                         p_outcome in out varchar2)
IS
BEGIN
    p_outcome:= 'OK';

    delete gca_esercizio_media
     where id_pacchetto = p_id_pacchetto
       and id_esercizio = p_id_esercizio
       and id_media = p_id_media;

    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END cancella_media_esercizio;


--
-- aggiunge un elemento multimedia all'esercizio specificato
-- p_id_pacchetto : id del pacchetto
-- p_id_esercizio : id dell'esercizio
-- p_id_media     : lista degli id media da inserire, valori separati da virgola
--
PROCEDURE aggiungi_media_esercizio(p_id_pacchetto in varchar2,
                         p_id_esercizio in varchar2,
                         p_id_media in varchar2,
                         p_outcome in out varchar2)
IS
    CURSOR C1 IS
        select regexp_substr(p_id_media,'[^,]+', 1, level) id_media from dual
        connect by regexp_substr(p_id_media, '[^,]+', 1, level) is not null;
BEGIN             
    p_outcome := 'OK';
    
    for c1rec in c1 loop
        insert into gca_esercizio_media ( id_pacchetto, id_esercizio, id_media)
        values (p_id_pacchetto, p_id_esercizio, c1rec.id_media);
    end loop;
 
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END aggiungi_media_esercizio;

PROCEDURE lista_glossario(p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    SELECT id_voce, 
           voce, 
           trim(nvl(definizione,'')) as definizione 
    from GCA_GLOSSARIO
    order by upper(voce);
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_glossario;

PROCEDURE salva_glossario(p_voce in varchar2,
                          p_definizione in varchar2,
                          p_outcome in out varchar2)                          
IS
    esiste_rec integer;
    
BEGIN
    -- p_outcome := 'Exception: p_voce '||p_voce||' p_definizione '|| p_definizione;
    -- return;

    p_outcome := 'OK';   
    
    select count('x') into esiste_rec
    from GCA_GLOSSARIO
    where lower(voce) = lower(p_voce); 
          
    if esiste_rec >0 then
      p_outcome := 'Exception: esiste nel glossario la voce "' || p_voce ||'"';
      return;
    end if;
    
    insert into GCA_GLOSSARIO
                (id_voce,
                 voce,
                 definizione) values 
                 (S_GCA_GLOSSARIO.nextval,
                  p_voce,
                  p_definizione);
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_glossario;


PROCEDURE salva_glossario_modificato(p_id_voce in varchar2,
                                     p_voce in varchar2, 
                                     p_definizione in varchar2, 
                                     p_outcome in out varchar2)
IS
    esiste_rec integer := 0;
BEGIN
    p_outcome := 'OK';
    
    -- Non deve esiste un pacchetto col nuovo nome scelto
    select count('x') into esiste_rec
      from gca_glossario 
     where lower(voce) = lower(p_voce)
       and id_voce <> p_id_voce;
      
    if esiste_rec > 0 then
      p_outcome:='Exception: esiste nel glossario la voce "'||p_voce||'"';
      return;
    end if;
    
    -- e' possibile eseguire l'aggiornamento
    update gca_glossario
       set voce = p_voce,
           definizione = p_definizione
     where id_voce = p_id_voce;
    
    commit;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_glossario_modificato;

PROCEDURE cancella_glossario(p_id_voce in varchar2, p_outcome in out varchar2)
IS
BEGIN
    p_outcome := 'OK';
    
    delete gca_glossario where id_voce = p_id_voce;
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END cancella_glossario;


function nameFromURL(p_url in varchar2) return varchar2 is
 k integer;
 name varchar2(200);
begin
    select instr(p_url, '/', -1) into k from dual;
    select substr(p_url, k+1) into name from dual;
    return name;
EXCEPTION
    WHEN others then name:=p_url;
    return name;
    
end nameFromURL;


/**
 * Aggiunge un elemento multimediale sulla tabella GCA_MULTIMEDIA,
 * url         - URL dell'elemento
 * descr_media - Titolo/descrizione dell'elemento
 * tipo_media  - 'video', 'audio', 'image', 'doc'
 */
PROCEDURE aggiungi_media(p_url in varchar2,
                         p_descr_media in varchar2,
                         p_tipo_media in varchar2, 
                         p_outcome in out varchar2)
IS
    esiste_rec integer := 0;

BEGIN
    p_outcome := 'OK';

    -- Non deve esiste un audio con la url di input
    select count('x') into esiste_rec
      from gca_multimedia 
     where url = p_url;
      
    if esiste_rec > 0 then
      p_outcome:='Exception: il file "'||p_url||'" esiste gia'' nella base dati';
      return;
    end if;

    insert into GCA_MULTIMEDIA  (ID_MEDIA, url, tipo, descr_media) 
    values (S_GCA_MULTIMEDIA_ID_MEDIA.nextval, p_url, p_tipo_media, p_descr_media);
    commit;

EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END aggiungi_media;


FUNCTION  media_collegato(p_id_media in varchar2) return varchar2
IS
    count_rec integer := 0;
BEGIN
   select count('x') into count_rec
     from gca_esercizio_media 
    where id_media = p_id_media;
    
   if count_rec=0 then
        return '0';
   else
        return '1';
   end if;
    
END media_collegato;


PROCEDURE rimuovi_media(p_id_media in varchar2,
                        p_outcome in out varchar2)
IS
    esiste_rec integer := 0;

BEGIN
    p_outcome:= 'OK';

    delete gca_esercizio_media 
     where id_media = p_id_media;

    delete gca_multimedia
     where id_media = p_id_media;

    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END rimuovi_media;


PROCEDURE lista_target(p_categoria in varchar2, 
                       p_outcome in out varchar2, 
                       p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    if p_categoria is not null then
        OPEN p_cursor FOR
        SELECT id_target, url_target, nome_target, len_nome_target, nvl(GCA_CATEGORIA.categoria,'') as categoria , nvl(descr_target,'') as descr 
        from GCA_TARGET_ATTIVITA
        left outer join GCA_CATEGORIA
            on GCA_CATEGORIA.id_cat = GCA_TARGET_ATTIVITA.id_cat 
        where upper(GCA_CATEGORIA.categoria) = upper(p_categoria)
        order by GCA_CATEGORIA.categoria, nome_target;        
    else
        OPEN p_cursor FOR
        SELECT id_target, url_target, nome_target, len_nome_target, nvl(GCA_CATEGORIA.categoria,'') as categoria , nvl(descr_target,'') as descr 
        from GCA_TARGET_ATTIVITA
        left outer join GCA_CATEGORIA
            on GCA_CATEGORIA.id_cat = GCA_TARGET_ATTIVITA.id_cat
        order by GCA_CATEGORIA.categoria, nome_target;
    end if;    
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_target;


PROCEDURE lista_categorie(p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    SELECT id_cat, categoria 
    from GCA_CATEGORIA;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_categorie;



PROCEDURE aggiungi_target(p_url in varchar2,
                          p_nome_target in varchar2,
                          p_categoria in varchar2,
                          p_descrizione in varchar2,
                          p_outcome in out varchar2)
IS
    esiste_rec integer := 0;
BEGIN
    p_outcome := 'OK';
    
    -- Controlla se gia' esiste il target
    select count('x') into esiste_rec
      from gca_target_attivita 
     where url_target = p_url;
      
    if esiste_rec > 0 then
      p_outcome:='Exception: il file "'||p_url||'" esiste gia'' nella base dati';
      return;
    end if;
    
    INSERT INTO GCA_TARGET_ATTIVITA (
       ID_TARGET,
       URL_TARGET,
       NOME_TARGET,
       LEN_NOME_TARGET,
       DESCR_TARGET,
       ID_CAT
    ) 
    select S_GCA_TARGET_ATTIVITA_ID.nextval,
           p_url, p_nome_target, length(p_nome_target), p_descrizione, id_cat
      from gca_categoria
     where upper(GCA_CATEGORIA.categoria) = upper(p_categoria);
     
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END aggiungi_target;



PROCEDURE cancella_target(p_id_target in varchar2,
                          p_outcome in out varchar2)
IS
BEGIN
    p_outcome:= 'OK';

    delete GCA_TARGET_ATTIVITA 
     where ID_TARGET = p_id_target;

    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END cancella_target;


PROCEDURE salva_dati_app(p_id_user  in varchar2,
                         p_appl_name in varchar2,
                         p_config_app in varchar2,
                         p_result_app in varchar2,                         
                         p_outcome in out varchar2) 
IS
    esiste_rec integer := 0;
BEGIN
    p_outcome:= 'OK';

    -- Controlla se gia' esiste il target
    select count('x') into esiste_rec
      from GCA_RESULT_APP 
     where ID_USER = p_id_user 
       and APP_NAME = p_appl_name;
      
    if esiste_rec > 0 then

        UPDATE GCA_RESULT_APP 
        SET CONFIG_APP = p_config_app, 
            RESULT_APP = p_result_app,
            DATE_APP = sysdate
        WHERE ID_USER = p_id_user 
          AND APP_NAME = p_appl_name;    
    else
        INSERT INTO GCA_RESULT_APP (
           ID_USER, 
           APP_NAME,
           CONFIG_APP,
           RESULT_APP,
           DATE_APP
        ) VALUES (p_id_user , p_appl_name, p_config_app,p_result_app, sysdate );
        
    end if;

    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_dati_app;


PROCEDURE controllaAccesso(p_id_login  in varchar2,
                           p_passwd  in varchar2,
                           p_outcome in out varchar2, 
                           p_cursor OUT SYS_REFCURSOR)
IS
    esiste_rec      integer := 0;
    lIdPaziente     integer := 0;
    lPasswd         varchar2(50); 
    lUltimoAccesso  varchar2(50);
BEGIN
    p_outcome := 'OK';

    begin
        select id_paziente into lIdPaziente
        from    GCA_ANAGRAFICA_PAZIENTI 
        where   codice_fiscale = p_id_login;
        
    exception
        when no_data_found then    
            OPEN p_cursor FOR
                select -2 id_esito , -1 id_utente, null ultimo_accesso
                from dual;
            return;                                
    end;

    -- Controlla se utente gia' registrato
    begin
        select passwd, to_char(ultimo_accesso,'DD/MM/YYYY HH24:MI:SS') ultimo_accesso
        into   lPasswd , lUltimoAccesso
        from GCA_LOGIN_UTENTE 
        where id_utente = lIdPaziente;

        -- Controllo password
        if ( lPasswd = p_passwd) then 
            update GCA_LOGIN_UTENTE
            set  ultimo_accesso=sysdate
            where id_utente = lIdPaziente;
            commit;
            
            OPEN p_cursor FOR
                select 1 id_esito, lIdPaziente id_utente, to_char(ultimo_accesso,'DD/MM/YYYY HH24:MI:SS') ultimo_accesso
                from GCA_LOGIN_UTENTE 
                where id_utente = lIdPaziente;     
            return;                
        else
            OPEN p_cursor FOR
                select -1 id_esito , lIdPaziente id_utente, lUltimoAccesso ultimo_accesso                
                from dual;
            return;                            
        end if;

    exception
        when no_data_found then    
            -- Utente non ancora registrato
            OPEN p_cursor FOR
                select 0 id_esito , -1 id_utente, null ultimo_accesso
                from dual;
            return;                
    end;

    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END controllaAccesso;                             


PROCEDURE registraLogin(p_id_login  in varchar2,
                        p_passwd in varchar2,
                        p_outcome in out varchar2, 
                        p_cursor OUT SYS_REFCURSOR)
IS
    esiste_rec  integer := 0;
    lIdPaziente integer := 0;
    lPasswd     varchar2(50);
BEGIN
    p_outcome := 'OK';

    begin
        select id_paziente into lIdPaziente
        from    GCA_ANAGRAFICA_PAZIENTI 
        where   codice_fiscale = p_id_login;
    exception
        when no_data_found then    
            OPEN p_cursor FOR
                select -2 id_esito , -1 id_utente, null ultimo_accesso
                from dual;
            return;                                
    end;


    -- Controlla se gia' esiste il target
    select count('x') into esiste_rec
    from GCA_LOGIN_UTENTE 
    where id_utente = lIdPaziente;

    -- Controlla se utente gia' registrato
    if (esiste_rec > 0) then 
        OPEN p_cursor FOR
            select 0 id_esito , -1 id_utente, null ultimo_accesso
            from dual;
        return;                
    else
        -- Utente non ancora registrato
        INSERT INTO GCA_LOGIN_UTENTE (
           ID_UTENTE, 
           PASSWD,
           DATA_CREAZIONE,
           ULTIMO_ACCESSO
        ) 
        select lIdPaziente , p_passwd, sysdate, null from dual;
                
        commit;

        OPEN p_cursor FOR
            select 1 id_esito, lIdPaziente id_utente, to_char(ultimo_accesso,'DD/MM/YYYY HH24:MI:SS') ultimo_accesso
            from GCA_LOGIN_UTENTE 
            where id_utente = lIdPaziente;
    end if;

    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END registraLogin; 



PROCEDURE lista_pazienti(p_outcome in out varchar2,p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    OPEN p_cursor FOR
    select id_paziente, nome, cognome, to_char(data_nascita,'dd/mm/YYYY') data_nascita, luogo_nascita
      from GCA_ANAGRAFICA_PAZIENTI 
      order by cognome,nome;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_pazienti;


PROCEDURE dettaglio_paziente(p_id_paziente in varchar2, 
                             p_outcome in out varchar2, 
                             p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    OPEN p_cursor FOR
    select id_paziente, nome, cognome, codice_fiscale, sesso, to_char(data_nascita,'dd/mm/YYYY') data_nascita, luogo_nascita, nazionalita, 
           luogo_residenza, indirizzo_domicilio, email, note
      from GCA_ANAGRAFICA_PAZIENTI
      where GCA_ANAGRAFICA_PAZIENTI.ID_PAZIENTE = p_id_paziente;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END dettaglio_paziente;                             


-- ==============================================================================
-- Restituisce se un esercizio di un pacchetto e' assegnato a un paziente.
--  p_id_paziente  - id del paziente
--  p_id_pacchetto - id del pacchetto di esercizi
--  p_id_esercizio - id dell'esercizio
--  Return: 'S' o 'N'
-- ==============================================================================
FUNCTION esercizioAssegnato(p_id_paziente in varchar2, p_id_pacchetto in varchar2, p_id_esercizio in varchar2) return varchar2
IS
   assegnato integer;
BEGIN
   select count('x') into assegnato
     from gca_pazienti_esercizi
    where id_paziente = p_id_paziente
      and id_pacchetto = p_id_pacchetto
      and id_esercizio = p_id_esercizio;
      
      if assegnato=0 then
        return 'N';
      else
        return 'S';
      end if;

EXCEPTION
    WHEN others then return 'N';
END esercizioAssegnato;


-- ============================================================================================
-- Dato un paziente in input restituisce la lista di tutti i pacchetti e di tutti gli esercizi
-- dell'ambito indicato, specificando per ogni esercizio se e' assegnao o meno al paziente.
-- ============================================================================================
PROCEDURE lista_pacchetti_esercizi(p_id_paziente in varchar2, 
                                   p_outcome in out varchar2,
                                   p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';

     OPEN p_cursor FOR
     Select gca_pacchetti.id_pacchetto,
            gca_pacchetti_esercizi.id_esercizio,
            nome_pacchetto,
            descr_pacchetto,
            nome_esercizio,
            desc_esercizio,
            esercizioAssegnato(p_id_paziente, gca_pacchetti.id_pacchetto, gca_pacchetti_esercizi.id_esercizio) assegnato,
            gca_pacchetti.id_ambito
      from gca_pacchetti, gca_pacchetti_esercizi
     where gca_pacchetti.id_ambito in (1,2)
       and gca_pacchetti.id_pacchetto = gca_pacchetti_esercizi.id_pacchetto
      order by gca_pacchetti.id_ambito, nome_pacchetto, nome_esercizio;

EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_pacchetti_esercizi;


procedure associa_esercizi_paziente(p_id_paziente in varchar2, p_id_esercizi in varchar2, p_outcome in out varchar2)
IS 
  CURSOR C1 IS
     select regexp_substr(p_id_esercizi,'[^,]+', 1, level) id_esercizio from dual
     connect by regexp_substr(p_id_esercizi, '[^,]+', 1, level) is not null;
BEGIN       
    p_outcome := 'OK';
    
    delete gca_pazienti_esercizi where id_paziente = p_id_paziente;
    
    for c1rec in c1 loop
       insert into gca_pazienti_esercizi (id_paziente, id_esercizio, id_pacchetto)
       select p_id_paziente, c1rec.id_esercizio, id_pacchetto
        from gca_pacchetti_esercizi
       where gca_pacchetti_esercizi.id_esercizio = c1rec.id_esercizio;
    end loop;
 
    COMMIT;
   
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END associa_esercizi_paziente;


PROCEDURE salva_paziente(p_nome in varchar2, p_cognome in varchar2,
                         p_cf   in varchar2, p_sesso in varchar2, 
                         p_luogo_nascita in varchar2, p_data_nascita in varchar2,
                         p_residenza in varchar2, p_indirizzo in varchar2,
                         p_nazionalita in varchar2, p_email in varchar2, 
                         p_note in varchar2,
                         p_outcome in out varchar2)
IS
BEGIN
    p_outcome := 'OK';
    
    Insert into GCA_ANAGRAFICA_PAZIENTI
   (ID_PAZIENTE, CODICE_FISCALE, COGNOME, NOME, SESSO, 
    DATA_NASCITA, LUOGO_NASCITA, LUOGO_RESIDENZA, INDIRIZZO_DOMICILIO, NAZIONALITA,
    EMAIL, NOTE) 
 Values
   (S_GCA_ANAGRAFICA_PAZIENTI.nextval, p_cf, p_cognome, p_nome, p_sesso, 
    TO_DATE(p_data_nascita, 'YYYY/MM/DD'), p_luogo_nascita, p_residenza, p_indirizzo, p_nazionalita, p_email, p_note);
    
    COMMIT;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_paziente;


PROCEDURE salva_modifiche_paziente(p_id_paziente in varchar2,
                         p_residenza in varchar2, p_indirizzo in varchar2,
                         p_email in varchar2, p_note in varchar2,
                         p_outcome in out varchar2)
IS
BEGIN
    p_outcome := 'OK';
    
    update GCA_ANAGRAFICA_PAZIENTI
        set LUOGO_RESIDENZA = p_residenza,
            INDIRIZZO_DOMICILIO = p_indirizzo,
            email = p_email,
            NOTE = p_note
    where id_paziente = p_id_paziente;
    
    COMMIT;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_modifiche_paziente;
                         


PROCEDURE cancella_paziente(p_id_paziente in varchar2,p_outcome in out varchar2)
IS
BEGIN
    p_outcome := 'OK';
    DELETE GCA_ANAGRAFICA_PAZIENTI where id_paziente = p_id_paziente;
    COMMIT;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END cancella_paziente;

END NeuroApp;
/

/*<TOAD_FILE_CHUNK>*/
show errors;
