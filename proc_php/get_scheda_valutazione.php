<?php

header('Access-Control-Allow-Origin: *'); 

include('msg_fmt.php');

//print_r($_GET);
//$keys = array_keys($_GET);
//print_r($keys);

/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc    - la procedura del DB di lettura
 * $ambito  - ambito (1,2)
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc = rawurldecode($proc);
$id_scheda =  rawurldecode($id_scheda);


/*****
echo $proc . "\n";
echo $id_scheda . "\n";
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
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}


/**
 * Crea lo statement per eseguire la procedura oracle 
 **/
$cmd  = 'BEGIN ' . $proc . '(:id_scheda, :outcome,:cursor); END;';
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
$refcur   = oci_new_cursor($conn);
$outcome  = "";
oci_bind_by_name($stmt, ':cursor'   , $refcur, -1, OCI_B_CURSOR);
oci_bind_by_name($stmt, ':id_scheda', $id_scheda, 100);
oci_bind_by_name($stmt, ':outcome'  , $outcome, 4000);

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

// NB. controllo esito DOPO il controllo ritorno procedura
$exec = oci_execute($refcur);

/**
 * Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
 * un messaggio di errore che inizia con "Exception" 
 */
if ( substr($outcome,0,9)==="Exception") { 
   $msg = msg_fmt( $outcome );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}
 
// NB. Mi faccio restituisce un record corrispondente alla struttura typescript RecordMedia.
//     !! La procedura restituisce un solo record !!
$start = "";
$outp  = $start;
while ($row=oci_fetch_array($refcur, OCI_BOTH+OCI_RETURN_NULLS) )
{
   if ($outp != $start) {$outp .= ",";}
   $outp .= '{'.
              '"id_media":'   . $id_scheda . ','  .
              '"url_media":"' . rawurlencode($row[1]) . '",' .
              '"descr_media":"' . rawurlencode($row[0]) . '",' .
              '"usato_media":0' .
            '}';
}
$outp .="";
echo($outp);

oci_free_statement($refcur);
oci_free_statement($stmt);
oci_close($conn);

?>
