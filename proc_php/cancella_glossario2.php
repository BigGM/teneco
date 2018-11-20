<?php

header('Access-Control-Allow-Origin: *'); 


//print_r($_GET);
//$keys = array_keys($_GET);
//print_r($keys);


/**
 * Parsa la query string. Restituisce questi attributi:
/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc    - la procedura pl/sql di cancellazione
 * $id_voce  - id della voce da cancellare
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc  = rawurldecode($proc);
$id_voce = rawurldecode($id_voce);

/*****
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
//$conn = oci_connect("telecom", "hp01pvv", 'hpdev01.tandi.it:1521/dbtest', 'AL32UTF8');
$conn = oci_pconnect($db_user, $db_pwd, $db_conn_string, 'AL32UTF8');

if (!$conn) {
   $e = oci_error();
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}


/**
 * Crea lo statement per eseguire la procedura oracle 
 **/
$cmd  = 'BEGIN ' . $proc . '(:id_voce, :outcome); END;'; 
$stmt = oci_parse($conn, $cmd);
if (!$stmt) {
   $e = oci_error($conn);
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}

oci_set_prefetch($stmt,1000);

/**
 * Imposta i parametri della procedura 
 **/
$outcome  = "";

oci_bind_by_name($stmt, ':id_voce'  , $id_voce, 255);
oci_bind_by_name($stmt, ':outcome' , $outcome, 4000);


/**
 * Lancia la procedura 
 **/
$exec = oci_execute($stmt);
if (!$exec) {
   $e = oci_error($stmt);
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}

/**
 * Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
 * un messaggio di errore che inizia con "Exception" 
 **/
if ( substr($outcome,0,9)==="Exception") { 
   $msg = htmlentities($outcome, ENT_QUOTES);
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}
 
// Successo
echo '{"status":"ok", "message":"'.$outcome.'"}'; 

oci_free_statement($stmt);
oci_close($conn);

?>
