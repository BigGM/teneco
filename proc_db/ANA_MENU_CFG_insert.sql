SET DEFINE OFF;
Insert into ANA_MENU_CFG
   (FUNCTION_NAME, ITEM_NAME, SUBITEM_NAME, ITEM_PROG, ITEM_LINK, 
    SUBITEM_PROG, SUBITEM_LINK, SUBITEM_DESCR)
 Values
   ('CONF', 'Riabilitazione', 'Configurazione pacchetti', 3, NULL, 
    1, '[TBD]/cgi-tenconf/run.php/TEN_ANAG$.Startup', NULL);
Insert into ANA_MENU_CFG
   (FUNCTION_NAME, ITEM_NAME, SUBITEM_NAME, ITEM_PROG, ITEM_LINK, 
    SUBITEM_PROG, SUBITEM_LINK, SUBITEM_DESCR)
 Values
   ('CONF', 'Riabilitazione', 'Percorso riabilitativo paziente', 3, NULL, 
    2, '[TBD]/cgi-tenconf/run.php/TEN_CODIF$.Startup', NULL);
COMMIT;