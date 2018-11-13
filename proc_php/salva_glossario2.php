<?php

header('Access-Control-Allow-Origin: *'); 


//print_r($_GET);
//$keys = array_keys($_GET);
//print_r($keys);


/**
 * Parsa la query string. Restituisce questi attributi:
/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc        - la procedura del DB di lettura
 * $voce        - voce di glossario
 * $definizione - definizione della voce di glossario
 **/

parse_str($_SERVER['QUERY_STRING']);


$proc  = rawurldecode($proc);
$voce  = rawurldecode($voce);
$definizione = rawurldecode($definizione);

/*****
echo $proc . "\n";
echo $voce. "\n";
echo $$definizione . "\n";
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
$cmd  = 'BEGIN ' . $proc . '(:voce, :definizione, :outcome); END;'; 
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
$refcur   = oci_new_cursor($conn);
$outcome  = "";

oci_bind_by_name($stmt, ':voce'       , $voce, 512);
oci_bind_by_name($stmt, ':definizione', $definizione, 4000);
oci_bind_by_name($stmt, ':outcome'    , $outcome, 4000);

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
   $msg = htmlentities($e['message'], ENT_QUOTES);
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}

// Successo
echo '{"status":"ok", "message":"'.$outcome.'"}'; 

oci_free_statement($stmt);
oci_close($conn);

?>
