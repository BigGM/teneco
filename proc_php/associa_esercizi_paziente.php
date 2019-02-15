<?php

header('Access-Control-Allow-Origin: *'); 

include('msg_fmt.php');


/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc    - la procedura pl/sql di cancellazione
 * $id_pkt  - id del pacchetto da cancellare
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc  = rawurldecode($proc);
$id_paziente = rawurldecode($id_paziente);
$id_esercizi = rawurldecode($id_esercizi);


/*****
echo $id_proc . "\n";
echo $id_paziente . "\n";
echo $id_esercizi . "\n";
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
   $msg = msg_fmt( $e['message'] );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}


/**
 * Crea lo statement per eseguire la procedura oracle 
 **/
$cmd  = 'BEGIN ' . $proc . '(:id_paziente, :id_esercizi, :outcome); END;'; 
$stmt = oci_parse($conn, $cmd);
if (!$stmt) {
   $e = oci_error($conn);
   $msg = msg_fmt( $e['message'] );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}

oci_set_prefetch($stmt,1000);


/**
 * Imposta i parametri della procedura 
 **/
$outcome = "";

oci_bind_by_name($stmt, ':id_paziente' , $id_paziente, 255);
oci_bind_by_name($stmt, ':id_esercizi' , $id_esercizi, 4000);
oci_bind_by_name($stmt, ':outcome'     , $outcome, 4000);


/**
 * Lancia la procedura 
 **/
$exec = oci_execute($stmt);
if (!$exec) {
   $e = oci_error($stmt);
   $msg = msg_fmt( $e['message'] );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}


/**
 * Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
 * un messaggio di errore che inizia con "Exception" 
 **/
if ( substr($outcome,0,9)==="Exception") { 
   $msg = msg_fmt( $outcome );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}
 
// Successo
echo '{"status":"ok", "message":"'. msg_fmt( $outcome ) .'"}'; 


oci_free_statement($stmt);
oci_close($conn);

?>
