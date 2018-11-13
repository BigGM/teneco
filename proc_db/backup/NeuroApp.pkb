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

                  


PROCEDURE lista_gruppi(p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    SELECT id_gruppo, nome_gruppo, nvl(desc_gruppo,'') as descr 
    from GCA_GRUPPI;
    
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
    'SELECT id_media, url, nvl(descr_media,'''') as descr, NeuroApp.media_collegato(id_media)' ||
    '  from GCA_MULTIMEDIA ' ||
    '  where tipo='''||p_tipo_media||''' ' ||
    '    and id_media not in ('||p_lista_video_id||')';
    
    return;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;   
END lista_media;



PROCEDURE lista_pacchetti(p_ambito in varchar2, p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    OPEN p_cursor FOR
    SELECT id_pacchetto, nome_pacchetto, trim(nvl(replace(descr_pacchetto,'"','\"'),'')) as descr,
           replace(controindicazioni,'"','"\'),
           replace(prerequisiti,'"','"\'),
           replace(alert,'"','"\')
           --nvl(GCA_PACCHETTI.id_ambito,-1) id_ambito,
           --trim(nvl(GCA_AMBITO.ambito,'')) ambito,
           --nvl(GCA_PACCHETTI.id_patologia,-1) id_patologia,  
           --trim(nvl(GCA_PATOLOGIE.PATOLOGIA,'')) patologia,
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


PROCEDURE salva_pacchetto(p_nome in varchar2, 
                          p_descr in varchar2,
                          p_prerequisiti in varchar2,
                          p_controindicazioni in varchar2,
                          p_alert in varchar2,
                          p_ambito in varchar2,
                          p_outcome in out varchar2)
IS
BEGIN
    p_outcome := 'OK';
    insert into GCA_PACCHETTI(id_pacchetto,
                              nome_pacchetto,
                              descr_pacchetto,
                              prerequisiti,
                              controindicazioni,
                              alert,
                              id_ambito ) 
    values (S_GCA_PACCHETTI_ID_PACCHETTO.nextval, 
            p_nome, 
            p_descr, 
            p_prerequisiti,
            p_controindicazioni,
            p_alert, 
            p_ambito);
    commit;
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END;


PROCEDURE salva_pacchetto_modificato(p_id_pacchetto in varchar2,
                          p_nome in varchar2, 
                          p_descr in varchar2, 
                          p_outcome in out varchar2)
                          IS
  esiste_pacchetto integer := 0;
BEGIN
    p_outcome := 'OK';
    
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
           descr_pacchetto = p_descr
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
END;



PROCEDURE lista_esercizi(p_id_pacchetto in varchar2, p_outcome in out varchar2, p_cursor OUT SYS_REFCURSOR)
IS
BEGIN
    p_outcome := 'OK';
    
    open p_cursor for
    select  GCA_PACCHETTI_ESERCIZI.id_pacchetto   id_pacchetto,
            GCA_PACCHETTI_ESERCIZI.id_esercizio   id_esercizio,
            GCA_PACCHETTI_ESERCIZI.nome_esercizio nome_esercizio,
            trim(GCA_PACCHETTI_ESERCIZI.desc_esercizio) desc_esercizio,
            decode(GCA_GRUPPI.id_gruppo,null,-1,GCA_GRUPPI.id_gruppo)  id_gruppo,
            GCA_GRUPPI.nome_gruppo                nome_gruppo,
            count(GCA_ESERCIZIO_MEDIA.id_media)   num_media
    from GCA_PACCHETTI_ESERCIZI
        left outer join GCA_GRUPPI
        on gca_gruppi.id_gruppo = GCA_PACCHETTI_ESERCIZI.id_gruppo 
        left outer join GCA_ESERCIZIO_MEDIA
        on GCA_ESERCIZIO_MEDIA.id_esercizio = GCA_PACCHETTI_ESERCIZI.id_esercizio and 
           GCA_ESERCIZIO_MEDIA.id_pacchetto = GCA_PACCHETTI_ESERCIZI.id_pacchetto
    where  GCA_PACCHETTI_ESERCIZI.id_pacchetto = p_id_pacchetto                
    group by GCA_PACCHETTI_ESERCIZI.id_pacchetto ,
            GCA_PACCHETTI_ESERCIZI.id_esercizio ,
            GCA_PACCHETTI_ESERCIZI.nome_esercizio ,
            GCA_PACCHETTI_ESERCIZI.desc_esercizio ,
            decode(GCA_GRUPPI.id_gruppo,null,-1,GCA_GRUPPI.id_gruppo ),
            GCA_GRUPPI.nome_gruppo 
    order by 1,2,3, 5;       
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
   
END;

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
            GCA_MULTIMEDIA.descr_media            descr_media                                    
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
                          p_desc_esercizio in varchar2,
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
    
    gruppo := p_id_gruppo;
    if p_id_gruppo = '-1' then
        gruppo := null;        
    end if;
    
    insert into GCA_PACCHETTI_ESERCIZI
                (id_pacchetto,
                 id_esercizio,
                 nome_esercizio,
                 desc_esercizio,
                 id_gruppo) values 
                 (p_id_pacchetto,
                  S_GCA_PACK_ESERC_ID_ESERCIZIO.nextval,
                  p_nome_esercizio,
                  p_desc_esercizio,
                  gruppo);
    commit;
    
EXCEPTION
    WHEN others then p_outcome:='Exception:' || sqlerrm;
END salva_esercizio;


PROCEDURE salva_esercizio_modificato(p_id_pacchetto in varchar2,
                          p_id_esercizio in varchar2,
                          p_desc_esercizio in varchar2,
                          p_id_gruppo in varchar2,
                          p_outcome in out varchar2)                          
IS
    gruppo varchar2(100);
BEGIN
    p_outcome := 'OK';
    
    gruppo := p_id_gruppo;
    if p_id_gruppo = '-1' then
        gruppo := null;        
    end if;
    
    update GCA_PACCHETTI_ESERCIZI
       set desc_esercizio = p_desc_esercizio,
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
--
PROCEDURE aggiungi_media_esercizio(p_id_pacchetto in varchar2,
                         p_id_esercizio in varchar2,
                         p_id_media in varchar2,
                         p_outcome in out varchar2)
IS
BEGIN             
    p_outcome := 'OK';
    
    insert into gca_esercizio_media ( id_pacchetto, id_esercizio, id_media)
    values (p_id_pacchetto, p_id_esercizio, p_id_media); 
 
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
    from GCA_GLOSSARIO;
    
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
      p_outcome:='Exception: il file "'||p_descr_media||'" esiste gia'' nella base dati';
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


END NeuroApp;
/

/*<TOAD_FILE_CHUNK>*/
show errors;
