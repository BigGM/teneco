<?php

header('Access-Control-Allow-Origin: *'); 
header('Content-Type: text/html; charset=utf-8');



//print_r($_GET);
//$keys = array_keys($_GET);
//print_r($keys);


/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc   - la procedura del DB di lettura
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc = rawurldecode($proc);

/*****
echo $proc . "\n";
echo $id_voce . "\n";
die();
*****/

// Variabili accesso al DB
$db_user=getenv('ANA_DB_USERNAME');
$db_pwd=getenv('ANA_DB_PASSWORD');
$db_conn_string=getenv('ORACLE_CONN_STRING');

/**
 * Connessione al data base 
 **/
$conn = oci_pconnect($db_user, $db_pwd, $db_conn_string, 'AL32UTF8');

if (!$conn) {
   $e = oci_error();
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"voce":"exception", "descr":"'.$msg.'"}';
   die();
}


/**
 * Crea lo statement per eseguire la procedura oracle 
 **/
$cmd  = 'BEGIN ' . $proc . '(:id_voce, :outcome, :cursor); END;';
$stmt = oci_parse($conn, $cmd);
if (!$stmt) {
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"voce":"exception", "descr":"'.$msg.'"}';
   die();
}

oci_set_prefetch($stmt,1000);


/**
 * Imposta i parametri della procedura 
 **/
$refcur   = oci_new_cursor($conn);
$outcome  = "";
oci_bind_by_name($stmt, ':id_voce' , $id_voce, 100);
oci_bind_by_name($stmt, ':outcome' , $outcome, 4000);
oci_bind_by_name($stmt, ':cursor'  , $refcur, -1, OCI_B_CURSOR);

/**
 * Lancia la procedura 
 **/
$exec = oci_execute($stmt);
if (!$exec) {
   $e = oci_error($stmt);
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"voce":"exception", "descr":"'.$msg.'"}';
   die();
}

// NB. controllo esito DOPO il controllo ritorno procedura
$exec = oci_execute($refcur);

/**
 * Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
 * un messaggio di errore che inizia con "Exception" 
 */
if ( substr($outcome,0,9)==="Exception") { 
   $msg = htmlentities($outcome, ENT_QUOTES);
   echo '{"voce":"exception", "descr":"'.$msg.'"}';
   die();
}
 
$id_voce=-1;
$voce = "";
$def = "";
while ($row=oci_fetch_array($refcur, OCI_BOTH+OCI_RETURN_NULLS) ) {
   $id_voce = $row[0];
   $voce    = $row[1];
   $def     = $row[2];
}
oci_free_statement($refcur);
oci_free_statement($stmt);
oci_close($conn);

echo '{"voce":"'.$voce.'", "descr":"'.$def.'"}';

//echo "  <label class='voce-glossario'><i>" . $voce . ":</i></label><br>";
//echo "  <label class='def-glossario'>" . $def . "</label>";


?>
