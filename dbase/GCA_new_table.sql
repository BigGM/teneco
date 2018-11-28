rem ---------------- AMBITO --------------------

DROP TABLE GCA_AMBITO CASCADE CONSTRAINTS;
CREATE TABLE GCA_AMBITO
(
  ID_AMBITO    INTEGER                          NOT NULL,
  AMBITO       VARCHAR2(512 BYTE)               NOT NULL
)
TABLESPACE TENECO_TBS;

SET DEFINE OFF;
Insert into GCA_AMBITO
   (ID_AMBITO, AMBITO)
 Values
   (1, 'RIBILITATIVO');
Insert into GCA_AMBITO
   (ID_AMBITO, AMBITO)
 Values
   (2, 'COGNITIVO');
COMMIT;

rem ---------------- GLOSSARIO --------------------

prompt Create table GCA_GLOSSARIO
DROP TABLE GCA_GLOSSARIO CASCADE CONSTRAINTS;
CREATE TABLE GCA_GLOSSARIO
(
  ID_VOCE      INTEGER        NOT NULL,
  VOCE         VARCHAR2(512)  NOT NULL,
  DEFINIZIONE  VARCHAR2(4000) 
)
TABLESPACE TENECO_TBS;

prompt Create sequence S_GCA_GLOSSARIO
DROP SEQUENCE S_GCA_GLOSSARIO;
CREATE SEQUENCE S_GCA_GLOSSARIO START WITH 1;

create unique index  UI_GCA_GLOSSARIO  
on GCA_GLOSSARIO (VOCE)
TABLESPACE TENECO_TBS;

create unique index  UI_GCA_GLOSSARIO_ID  
on GCA_GLOSSARIO (ID_VOCE)
TABLESPACE TENECO_TBS;

rem ---------------- PATOLOGIE --------------------

-- select * from TEN_ICD9CM_DIAGNOSI 
prompt Create table GCA_PATOLOGIE
DROP TABLE GCA_PATOLOGIE CASCADE CONSTRAINTS;
CREATE TABLE GCA_PATOLOGIE
(
  ID_PATOLOGIA   INTEGER        NOT NULL,
  PATOLOGIA      VARCHAR2(255)  NOT NULL,
  COD_ICD9CMDIA  VARCHAR2(255)
)
TABLESPACE TENECO_TBS;

prompt Create sequence S_GCA_PATOLOGIE
DROP SEQUENCE S_GCA_PATOLOGIE;
CREATE SEQUENCE S_GCA_PATOLOGIE START WITH 1;

DROP INDEX UI_GCA_PATOLOGIE_ID;
CREATE UNIQUE INDEX UI_GCA_PATOLOGIE_ID ON GCA_PATOLOGIE
(ID_PATOLOGIA)
TABLESPACE TENECO_TBS;

DROP INDEX UI_GCA_PATOLOGIE_COD;
CREATE UNIQUE INDEX UI_GCA_PATOLOGIE_COD ON GCA_PATOLOGIE
(COD_ICD9CMDIA)
TABLESPACE TENECO_TBS;

rem ---------------- PACCHETTI --------------------

prompt Create table GCA_PACCHETTI
DROP TABLE GCA_PACCHETTI CASCADE CONSTRAINTS;
CREATE TABLE GCA_PACCHETTI
(
  ID_PACCHETTO       INTEGER                    NOT NULL,
  NOME_PACCHETTO     VARCHAR2(255 BYTE)         NOT NULL,
  ID_AMBITO          INTEGER,
  ID_PATOLOGIA       INTEGER,
  CONTROINDICAZIONI  VARCHAR2(4000 BYTE),
  PREREQUISITI       VARCHAR2(4000 BYTE),
  ALERT              VARCHAR2(4000 BYTE),
  DESCR_PACCHETTO    VARCHAR2(4000 BYTE)
)
TABLESPACE TENECO_TBS

prompt Create sequence S_GCA_PACCHETTI_ID_PACCHETTO
DROP SEQUENCE S_GCA_PACCHETTI_ID_PACCHETTO;
CREATE SEQUENCE S_GCA_PACCHETTI_ID_PACCHETTO START WITH 1;

prompt Create unique index  UI_GCA_PACCHETTI (NOME_PACCHETTO)
create unique index  UI_GCA_PACCHETTI 
on GCA_PACCHETTI (NOME_PACCHETTO)
TABLESPACE TENECO_TBS;

create unique index  UI_GCA_PACCHETTI_ID 
on GCA_PACCHETTI (ID_PACCHETTO)
TABLESPACE TENECO_TBS;

rem -----------------------------------------------------

prompt Create table GCA_GRUPPI
DROP TABLE GCA_GRUPPI CASCADE CONSTRAINTS;
CREATE TABLE GCA_GRUPPI
(
  ID_GRUPPO    INTEGER        NOT NULL,
  NOME_GRUPPO  VARCHAR2(255)  NOT NULL,
  DESC_GRUPPO  VARCHAR2(4000)
)
TABLESPACE TENECO_TBS;

prompt Create sequence S_GCA_GRUPPI_ID_GRUPPO
DROP SEQUENCE S_GCA_GRUPPI_ID_GRUPPO;
CREATE SEQUENCE S_GCA_GRUPPI_ID_GRUPPO START WITH 1;

prompt Create unique index  UI_GCA_GRUPPI (NOME_GRUPPO)
create unique index  UI_GCA_GRUPPI 
on GCA_GRUPPI (NOME_GRUPPO)
TABLESPACE TENECO_TBS;

rem -----------------------------------------------------

prompt Create table GCA_PACCHETTI_ESERCIZI
DROP TABLE GCA_PACCHETTI_ESERCIZI CASCADE CONSTRAINTS;
CREATE TABLE GCA_PACCHETTI_ESERCIZI
(
  ID_PACCHETTO   INTEGER        NOT NULL,
  ID_ESERCIZIO   INTEGER        NOT NULL,
  NOME_ESERCIZIO VARCHAR2(255)  NOT NULL,
  DESC_ESERCIZIO VARCHAR2(4000)         ,
  ID_GRUPPO      INTEGER
)
TABLESPACE TENECO_TBS;

prompt Create sequence S_GCA_PACK_ESERC_ID_ESERCIZIO
DROP SEQUENCE S_GCA_PACK_ESERC_ID_ESERCIZIO;
CREATE SEQUENCE S_GCA_PACK_ESERC_ID_ESERCIZIO START WITH 1;

prompt Create unique index  UI_GCA_PACCHETTI_ESERCIZI (ID_PACCHETTO,NOME_ESERCIZIO)
create unique index  UI_GCA_PACCHETTI_ESERCIZI 
on GCA_PACCHETTI_ESERCIZI (ID_PACCHETTO,NOME_ESERCIZIO)
TABLESPACE TENECO_TBS;

rem -----------------------------------------------------

prompt Create table GCA_MULTIMEDIA
DROP TABLE GCA_MULTIMEDIA CASCADE CONSTRAINTS;
CREATE TABLE GCA_MULTIMEDIA
(
  ID_MEDIA      INTEGER        NOT NULL,
  URL           VARCHAR2(1024) NOT NULL,
  TIPO          VARCHAR2(100)          ,
  DESCR_MEDIA   VARCHAR2(256)
)
TABLESPACE TENECO_TBS;

prompt Create sequence S_GCA_MULTIMEDIA_ID_MEDIA
DROP SEQUENCE S_GCA_MULTIMEDIA_ID_MEDIA;
CREATE SEQUENCE S_GCA_MULTIMEDIA_ID_MEDIA START WITH 1;

prompt Create unique index UI_GCA_MULTIMEDIA (URL)
create unique index  UI_GCA_MULTIMEDIA 
on GCA_MULTIMEDIA (URL)
TABLESPACE TENECO_TBS;

rem -----------------------------------------------------

prompt Create table GCA_ESERCIZIO_MEDIA
DROP TABLE GCA_ESERCIZIO_MEDIA CASCADE CONSTRAINTS;
CREATE TABLE GCA_ESERCIZIO_MEDIA
(
  ID_PACCHETTO  INTEGER   NOT NULL,
  ID_ESERCIZIO  INTEGER   NOT NULL,
  ID_MEDIA      INTEGER   NOT NULL
)
TABLESPACE TENECO_TBS;

create unique index  UI_GCA_ESERCIZIO_MEDIA 
on GCA_ESERCIZIO_MEDIA (ID_PACCHETTO,ID_ESERCIZIO,ID_MEDIA)
TABLESPACE TENECO_TBS;

--------------------------------------------------------------------------
--@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
--------------------------------------------------------------------------
-- rem Caricamento tabelle

SET DEFINE OFF;
Insert into GCA_GRUPPI
   (ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (1, 'Esercizi passivi', 'Questo tipo di esercizio è indicato per i soggetti che non riescono a partecipare attivamente all’esercizio. Il soggetto non deve compiere alcuno sforzo. A muovere gli arti è il terapista.');
Insert into GCA_GRUPPI
   (ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (2, 'Esercizi attivo-assistiti', 'Questo tipo di esercizio è indicato per chi riesce a muovere i muscoli con un minimo di assistenza o le articolazioni, ma avverte dolore nel farlo. I soggetti muovono gli arti in autonomia, ma il terapista li aiuta a farlo con le mani o delle fasce o altra apparecchiatura.');
Insert into GCA_GRUPPI
   (ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (3, 'Esercizi autonomi', 'Questo tipo di esercizio è indicato per i soggetti che riescono a eseguire esercizi muscolari o articolari senza aiuto. Devono muovere gli arti in autonomia.');
COMMIT;

SET DEFINE OFF;
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (5, 'http://81.29.176.113:47000/GCA/audio/Allegro_Motivetto.mp3', 'audio', 'Allegro motivetto');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (6, 'http://81.29.176.113:47000/GCA/audio/Justin%20Timberlake%20-%20Filthy%20(Official%20Audio)%20(320%20%20kbps)%20(VidzToMp3.com).mp3', 'audio', 'Justin Timberlake-Filthy Choreography by Jake Kodish - audio solo');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (1, 'http://81.29.176.113:47000/GCA/video/Esercizi%20schiena%20%20Ginnastica%20Posturale%20%231.mp4', 'video', 'Esercizi di ginnastica posturale');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (2, 'http://81.29.176.113:47000/GCA/video/Justin+Timberlake+-+Filthy+-+Choreography+by+Jake+Kodish+-+%2523TMillyTV+ft.+Everyone.mp4', 'video', 'Justin Timberlake-Filthy Choreography by Jake Kodish');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (3, 'http://81.29.176.113:47000/GCA/video/La%20Contrazione%20Muscolare.mp4', 'video', 'La contrazione muscolare');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (4, 'http://81.29.176.113:47000/GCA/video/Saluteinmovimento_nervosciaticoinfiammato.mp4', 'video', 'Nervo sciatico infiammato');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (21, 'http://81.29.176.113:47000/GCA/img_riabilitazione/esercizi_riabilitazione_2.jpg', 'image', 'respirazione');
Insert into GCA_MULTIMEDIA
   (ID_MEDIA, URL, TIPO, DESCR_MEDIA)
 Values
   (22, 'http://81.29.176.113:47000/GCA/img_riabilitazione/esercizi_riabilitazione_1.png', 'image', 'respirazione');
COMMIT;

SET DEFINE OFF;
Insert into GCA_PACCHETTI
   (ID_PACCHETTO, NOME_PACCHETTO, DESCR_PACCHETTO, ID_AMBITO, CONTROINDICAZIONI, 
    PREREQUISITI, ALERT, ID_PATOLOGIA)
 Values
   (23, 'pacchetto di test', 'quarta modifica alla descrizione di questo pacchetto di test', 1, NULL, 
    NULL, NULL, NULL);
Insert into GCA_PACCHETTI
   (ID_PACCHETTO, NOME_PACCHETTO, DESCR_PACCHETTO, ID_AMBITO, CONTROINDICAZIONI, 
    PREREQUISITI, ALERT, ID_PATOLOGIA)
 Values
   (1, 'Esercizi vestibolari', 'Il sistema vestibolare fa parte dei sistemi che controllano l''equilibrio di una persona.Il sistema vestibolare fa parte dei sistemi che controllano l''equilibrio di una persona. I vestiboli sono due e si trovano in profondità all''interno delle orecchie. Comunicano la posizione del corpo nello spazio e danno informazioni di movimento. Un buon sistema vestibolare è utile per mantenere l''equilibrio soprattutto per quello che riguarda le rotazioni, i cambi di direzione e la direzionalità dello sguardo durante il movimento. Il sistema vestibolare può presentare diversi problemi, molti dei quali richiedono la visita specialistica di un otorino. In caso di vertigini e sensazioni di precipitare, è necessario consultare uno specialista. Tuttavia nel caso di una lesione cerebrale (trauma cranico, ictus...) è possibile che un vestibolo diventi maggiormente deficitario rispetto all''altro, con conseguenze sull''equilibrio. Gli esercizi proposti, sulla base degli studi effettuati finora, possono aiutare a ristabilire un corretto funzionamento di questo sistema.', 1, NULL, 
    NULL, NULL, 36);
Insert into GCA_PACCHETTI
   (ID_PACCHETTO, NOME_PACCHETTO, DESCR_PACCHETTO, ID_AMBITO, CONTROINDICAZIONI, 
    PREREQUISITI, ALERT, ID_PATOLOGIA)
 Values
   (2, 'Esercizi per l''arto superiore', 'Per arto superiore si intende indicare tre articolazioni: la spalla, il gomito e il polso. Quando si parla di spalla è bene ricordare che spesso possono verificarsi sublussazioni o instaurarsi sindromi dolorose. Esistono dei posizionamenti e degli esercizi che possono ridurre il rischio di una sublussazione e diminuire i sintomi di una sindrome da spalla dolorosa. E'' doveroso e necessario osservare bene l''arto prima di procedere a qualsiasi manovra e verificare le seguenti cose: se l''arto risulta caldo, gonfio, rosso o anche solo uno di questi fattori si verifica in modo marcato, non eseguire alcun esercizio o movimento e chiedere un parere medico. Se l''arto si presenta molto doloroso o con un dolore eccessivo rispetto allo standard del paziente, chiedere un parere medico. Se, infine, si presenta una marcata variazione del tono, cioè se un arto con spasticità diviene improvvisamente flaccido, o viceversa, o anche se un arto con spasticità lieve o moderata, aumenta fino a diventare una spasticità severa, senza nessuna causa evidente (febbre, crisi di pianto...) consultare un medico. Avere sempre cura di rispettare il dolore del paziente e la sua capacità di movimento residua.', 1, NULL, 
    NULL, NULL, 54);
Insert into GCA_PACCHETTI
   (ID_PACCHETTO, NOME_PACCHETTO, DESCR_PACCHETTO, ID_AMBITO, CONTROINDICAZIONI, 
    PREREQUISITI, ALERT, ID_PATOLOGIA)
 Values
   (3, 'Esercizi per l''arto inferiore', 'Gli arti inferiori sono collegati al tronco dal cingolo pelvico, formato dalle due ossa dell’anca articolate saldamente con l’osso sacro e con il coccige. Ciascun arto si può considerare diviso dal tronco per mezzo di una linea che dalla spina iliaca posterosuperiore segue il margine superiore della cresta iliaca, poi la piega inguinale, fino a raggiungere il tubercolo pubico. L’arto inferiore si può suddividere in sei regioni: anca, coscia, ginocchio, gamba, collo del piede e piede. La struttura ossea degli arti inferiori è robusta e, per ciascun arto, è rappresentata dall’osso dell’anca, dal femore, che forma la coscia, dalla tibia, che con il perone costituisce la gamba, e dalle ossa del piede. A differenza di quanto avviene negli arti superiori, per motivi ontogenetici e per adattamenti funzionali i muscoli flessori sono situati anteriormente e gli estensori posteriormente. Gli arti inferiori rappresentano la struttura principale cui è affidata la funzione statica e dinamica dell’intero corpo umano.', 1, NULL, 
    NULL, NULL, 44);
Insert into GCA_PACCHETTI
   (ID_PACCHETTO, NOME_PACCHETTO, DESCR_PACCHETTO, ID_AMBITO, CONTROINDICAZIONI, 
    PREREQUISITI, ALERT, ID_PATOLOGIA)
 Values
   (4, 'Esercizi respiratori', 'La riabilitazione respiratoria è utilizzata per migliorare le capacità polmonari in pazienti con malattie respiratorie. Questo obiettivo è raggiungibile tramite esercizi specifici ed educazione di pazienti e familiari. Il nostro sistema respiratorio ha lo scopo di effettuare scambi di gas, apportando ossigeno ai tessuti del nostro corpo e scartando anidride carbonica (prodotto di scarto del metabolismo delle nostre cellule).', 1, NULL, 
    NULL, NULL, 57);
COMMIT;

SET DEFINE OFF;
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (2, 38, 'Esercizio 3', 'Mobilitazione polso', 1);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (2, 36, 'Esercizio 1', 'Mobilitazione della spalla', 1);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (1, 1, 'Esercizio 1', 'Si esegue l''esercizio da seduti, posizionare il capo alla stessa altezza del target. Rimanere seduti in posizione corretta, senza incrociare le braccia e le gambe. Se si esegue l''esercizio in piedi, sostare davanti al target in posizione eretta con una lieve distanza tra i piedi e mantenere le braccia rilassate lungo i fianchi. Fissare il target. Muovee il capo a destra e sinistra continuando a fissare il target. Se durante lo svolgimento dell''esercizio in stazione eretta, sentite di perdere l''equilibrio, eseguite l''esercizio in posizione SEDUTA.', -1);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (1, 2, 'Esercizio 2', 'Si esegue l''esercizio da seduti, posizionare il capo alla stessa altezza del target. Rimanere seduti in posizione corretta, senza incrociare le braccia e le gambe. Se si esegue l''esercizio in piedi, sostare davanti al target in posizione eretta con una lieve distanza tra i piedi e mantenere le braccia rilassate lungo i fianchi. Fissare il target. Muovee il capo verso l''alto e verso il basso continuando a fissare il target. Se durante lo svolgimento dell''esercizio in stazione eretta, sentite di perdere l''equilibrio, eseguite l''esercizio in posizione seduta.', -1);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (1, 3, 'Esercizio 3', 'Si esegue l''esercizio da seduti, posizionare il capo alla stessa altezza del target. Rimanere seduti in posizione corretta, senza incrociare le braccia e le gambe. Se si esegue l''esercizio in piedi, sostare davanti al target in posizione eretta con una lieve distanza tra i piedi e mantenere le braccia rilassate lungo i fianchi. Mentre il target si muove, continuare a fissarlo muovendo il capo nella direzione opposta, ruotando da destra a sinistra. Se durante lo svolgimento dell''esercizio in stazione eretta, sentite di perdere l''equilibrio, eseguite l''esercizio in posizione seduta.', NULL);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (1, 4, 'Esercizio 4', 'Si esegue l''esercizio da seduti, posizionare il capo alla stessa altezza del target. Rimanere seduti in posizione corretta, senza incrociare le braccia e le gambe. Se si esegue l''esercizio in piedi, sostare davanti al target in posizione eretta con una lieve distanza tra i piedi e mantenere le braccia rilassate lungo i fianchi. Mentre il target si muove verso l''alto e verso il basso,muovete il capo nella direzione opposta sempre continuando a fissare il target. Se durante lo svolgimento dell''esercizio in stazione eretta, sentite di perdere l''equilibrio, eseguite l''esercizio in posizione seduta.', 1);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (4, 35, 'Esercizio 1', 'respirazione toracica e diaframmatica', NULL);
Insert into GCA_PACCHETTI_ESERCIZI
   (ID_PACCHETTO, ID_ESERCIZIO, NOME_ESERCIZIO, DESC_ESERCIZIO, ID_GRUPPO)
 Values
   (2, 37, 'Esercizio 2', 'Mobilitazione del gomito', 1);
COMMIT;


SET DEFINE OFF;
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 1, 1);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 1, 5);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 1, 6);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 1, 21);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 1, 22);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 2, 1);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 2, 2);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 4, 1);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 4, 2);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 4, 3);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 4, 4);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 4, 5);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (1, 4, 6);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (2, 36, 5);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (2, 37, 1);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (2, 37, 21);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (2, 37, 22);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (4, 35, 1);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (4, 35, 2);
Insert into GCA_ESERCIZIO_MEDIA
   (ID_PACCHETTO, ID_ESERCIZIO, ID_MEDIA)
 Values
   (4, 35, 21);
COMMIT;



SET DEFINE OFF;
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'SPASTICITÀ', 'La spasticità è un disturbo che consiste nell''eccessivo e anomalo aumento del tono muscolare. Più precisamente, la spasticità è caratterizzata da spasmi di uno o più muscoli scheletrici e dall''aumento del tono dei riflessi di stiramento. Generalmente, la spasticità costituisce il segno clinico di gravi patologie di base, che possono avere diversa origine e natura. La spasticità è una condizione fortemente debilitante, le cui conseguenze possono essere anche gravi; da qui l''importanza dell''individuare il trattamento che meglio si adegua alle caratteristiche di ciascun paziente, in modo tale da migliorarne, per quanto possibile, la qualità della vita.');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'FLACCIDITÀ', 'Si verifica quando si ha una lesione del 2° neurone di moto, e risulta manifestata con le seguenti caratteristiche:
- Ipotono
- Iporeflessia
- Atrofia
Se la lesione è a livello cervicale ad esempio, cioè tra C5 e D1 e tra C8 e D1, si avrà una paralisi flaccida agli arti superiori (perché si è interretto il secondo neurone di moto agli arti superiori, e quindi ci saranno le caratteristiche dell’ipotono, dell’iporeflessia e dell’atrofia) e spastica agli arti inferiori.
Se la lesione è a livello toracico viene preso solo il fascio piramidale (paraplegia), è la sede più frequente di lesioni, in genere anche i traumatizzati sono prevalentemente paraplegici spastici.
Se la lesione è a livello lombare, sia livello del rigonfiamento lombare a livello del midollo, cioè  L2 - L3 ad S1, sia che sia interessata la cauda equina, cioè le radici che sono fuoriuscite dalle corna anteriori del rigonfiamento lombare, si tratta di paraparesi flaccida agli arti inferiori .
E’ chiaro che se la lesione è a livello di C2 C4, cioè al disopra del rigonfiamento cervicale, la paralisi sarà una tetraplegia (spastica in questo caso).');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'CLONO', 'Tipo di contrazione del muscolo striato. È un reperto dell’esame neurologico obiettivo, un tipo di riflesso profondo, ed indica una serie ritmica di contrazioni muscolari scatenate da una tensione continuata e brusca del tendine (ad esempio clono del piede e c. della rotula o c. patellare). Compare in certe lesioni delle vie piramidali. Tale fenomeno può comparire anche in soggetti sani soprattutto allorquando c’è uno stato di fatica muscolare.Contrazioni cloniche sono presenti anche nell’epilessia, ma in tal caso sono caratteristiche della fase clonica che segue la fase tonica di contrattura muscolare perchè la contrattura corporea anziché essere continua come nella fase tonica cede, scompare per un attimo, per poi riprendere: questa determina l’aspetto clonico della fase clonica.');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'PARALISI, PARESI o PLEGIA', 'I deficit di forza (Paralisi, paresi o plegia) possono essere distinti fondamentalmente in due tipologie:
- Spastica
- Flaccida 
La paralisi (paresi o plegia) è il deficit di forza, che si traduce nell’impossibilità o difficoltà a compiere un movimento volontario. Per paralisi spastica è dovuta ad una lesione del 1° neurone di moto (lesione che può esserci dalla corteccia fino all’unione di questo assone con il midollo spinale).
I livelli di lesione possono essere tantissimi, (si possono avere lesioni midollari, encefalica, corticale, sotto corticale, etc),ma in ogni caso in qualsiasi punto il fascio piramidale venga leso prima del suo raggiungimento del secondo neurone di moto determina una paralisi di tipo spastico. La paralisi flaccida è dovuta alla lesione del 2° neurone di moto (ricordiamo che per 2° neurone di moto s’intende dal secondo alla periferia, ovvero dalle corna anteriori del midollo spinale fino alla periferia muscolare). La differenza tra paralisi flaccida e spastica può essere effettuata facendo l’attenzione su alcuni parametri quali:
- Trofismo
- Tono
- Riflessi');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'POA', 'Le paraosteoartropatie (POA) sono neoformazioni calci che, di consistenza e natura simile all’osso, che si sviluppano nei tessuti molli periarticolari (tendini, legamenti e aponeurosi), senza interessare direttamente le articolazioni. Di solito compaiono nel primo anno dopo l’evento traumatico e sono appannaggio delle articolazioni sottolesionali (arti inferiori, anca e ginocchio, per i paraplegici, gomiti nelle lesioni cervicali “basse”, spalle solo in quelle “alte”) oppure nel caso di concomitante lesione cerebrale (trauma cranico). Piu` raramente si possono formare anche in fase cronica, per lo piu` secondarie ad intercorrenti complicanze locali (traumi, infezioni, trombosi). Le cause piu` accreditate sono rappresentate dai microtraumi meccanici (spasticita`, immobilizzazione prolungata, mobilizzazioni inappropriate), dalle alterazioni del controllo neurologico del microcircolo periarticolare e da necrosi tessutale conseguente ad ischemia.');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'EQUILIBRIO', 'L’equilibrio umano è controllato dal sistema vestibolare che risiede nell’orecchio e consente l’interazione dinamica con l’ambiente esterno, in armonia con la forza di gravità. I principali recettori, attraverso riflessi otolitici, consentono il mantenimento della postura e, grazie a un continuo aggiustamento automatico, ci permettono di contrastare la forza di gravità. Questa è una sommaria DEFINIZIONEizione del concetto di equilibrio. Si pensa spesso che giramenti di testa e vertigini si possano attribuire alla mancanza di equilibrio, ma in realtà possono essere causati dalla compressione delle vertebre cervicali.');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'SISTEMA VESTIBOLARE', 'Il sistema vestibolare è costituito dagli organi vestibolari (canali semicircolari, sacculo, otricolo), contenuti nell’orecchio interno, dalle fibre nervose vestibolari del nervo acustico (VIII paio), dai nuclei vestibolari del bulbo e da fibre efferenti dirette ai nuclei motori spinali, ai nuclei dei nervi oculomotori, al cervelletto e al mesencefalo.. Elabora e controlla riflessi posturali in risposta alle accelerazioni lineari e angolari della testa.');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'AFASIA', 'L’afasia è un disturbo del linguaggio. Chi è colpito da afasia ha difficoltà a esprimersi e a comprendere il linguaggio parlato, a leggere, a scrivere e a fare calcoli. L’afasia  è  la conseguenza  di  un  danno  cerebrale,  il  più spesso di origine vascolare (ictus), ma in altri casi può essere dovuta ad un trauma o ad un tumore cerebrale.');
Insert into GCA_GLOSSARIO
   (ID_VOCE, VOCE, DEFINIZIONE)
 Values
   (S_GCA_GLOSSARIO.nextval, 'SENSIBILITÀ', 'E'' la capacità di sentire e di distinguere (potere risolutivo della sensibilità) gli stimoli. Quanto più è acuta la sensibilità di un individuo, tanto più è ricca la gamma delle sfumature di senso che è in grado di cogliere, in campo percettivo e in campo emotivo: un cultore e appassionato d’arte, per esempio, vedrà in un quadro molti più dettagli e più significati di quanti non ne scorga una persona non particolarmente sensibile in quel campo. Lo stesso discorso vale per quel che riguarda la musica. I ciechi sviluppano una particolare sensibilità acustica e tattile, i sommelier gustativa; alcuni individui hanno un olfatto che rivaleggia (quasi) con quello dei cani, ecc. Ma è ragionevole parlare di sensibilità anche al di fuori del campo artistico e di quello percettivo: c’è chi ha una particolare sensibilità per la matematica e, all’interno della matematica, per l’algebra piuttosto che per la statistica. Chi è particolarmente sensibile ai fenomeni fisici (pare che Enrico Fermi, da bambino, giocando con la trottola, già si chiedesse come il giocattolo restasse in equilibrio sulla punta, sospettando le leggi del movimento giroscopico). Evidentemente, in questi casi, la sensibilità coincide con l’intelligenza, ma, altrettanto evidentemente, la sensibilità si estende molto al di là dell’intelligenza. La sensibilità acustica, olfattiva, visiva di molti animali supera di gran lunga quella dell’uomo. Entro certi limiti, la sensibilità, con l’esercizio e una buona guida, si può affinare e potenziare. Abbiamo già detto che la decifrazione dei sogni è un’arte che può, in una certa misura, essere acquisita: lo stesso vale per la sensibilità artistica, per quella scientifica, ecc. La sensibilità è una facoltà del cervello ricevitore/proiettore. La creatività è una facoltà del cervello trasmettitore/motore.');
COMMIT;

insert into GCA_PATOLOGIE ( id_patologia,COD_ICD9CMDIA, patologia )  
(select ID_ICD9CMDIA id_patologia ,  
        COD_ICD9CMDIA COD_ICD9CMDIA,  
        ICD9CMDIA PATOLOGIA
 from TEN_ICD9CM_DIAGNOSI);
