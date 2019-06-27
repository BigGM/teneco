SET DEFINE OFF;
Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (1, 1, 'Esercizio passivo', 'Questo tipo di esercizio è indicato per i soggetti che non riescono a partecipare attivamente all’esercizio. Il soggetto non deve compiere alcuno sforzo. A muovere gli arti è il terapista.');
Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (1, 2, 'Esercizio attivo-assistito', 'Questo tipo di esercizio è indicato per chi riesce a muovere i muscoli con un minimo di assistenza o le articolazioni, ma avverte dolore nel farlo. I soggetti muovono gli arti in autonomia, ma il terapista li aiuta a farlo con le mani o delle fasce o altra apparecchiatura.');
Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (1, 3, 'Esercizio autonomo', 'Questo tipo di esercizio è indicato per i soggetti che riescono a eseguire esercizi muscolari o articolari senza aiuto. Devono muovere gli arti in autonomia.');
Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (1, -1, '--nessun gruppo--', '');


Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (3, 1, 'Modalità passiva', 'Questo tipo di modalità è indicata per i soggetti che non riescono a partecipare attivamente alla modalità. Il soggetto non deve compiere alcuno sforzo. A muovere gli arti è il terapista.');
Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (3, 2, 'Modalità attivo-assistita', 'Questo tipo di modalità è indicata per chi riesce a muovere i muscoli con un minimo di assistenza o le articolazioni, ma avverte dolore nel farlo. I soggetti muovono gli arti in autonomia, ma il terapista li aiuta a farlo con le mani o delle fasce o altra apparecchiatura.');
Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (3, 3, 'Modalità autonoma', 'Questo tipo di modalità è indicata per i soggetti che riescono a eseguire esercizi muscolari o articolari senza aiuto. Devono muovere gli arti in autonomia.');

Insert into GCA_GRUPPI
   (ID_AMBITO, ID_GRUPPO, NOME_GRUPPO, DESC_GRUPPO)
 Values
   (3, -1, '--nessun gruppo--', '');
COMMIT;



