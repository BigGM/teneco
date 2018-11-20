<?php

header('Access-Control-Allow-Origin: *'); 

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

/*****
echo $proc . "\n";
echo $ambito . "\n";
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
$cmd  = 'BEGIN ' . $proc . '(:ambito, :outcome,:cursor); END;';
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
oci_bind_by_name($stmt, ':cursor'  , $refcur, -1, OCI_B_CURSOR);
oci_bind_by_name($stmt, ':ambito'  , $ambito, 100);
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

// NB. controllo esito DOPO il controllo ritorno procedura
$exec = oci_execute($refcur);

/**
 * Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
 * un messaggio di errore che inizia con "Exception" 
 */
if ( substr($outcome,0,9)==="Exception") { 
   $msg = htmlentities($outcome, ENT_QUOTES);
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}
 
//$outp = $outcome . "|";
$start = "[";
$outp  = $start;
while ($row=oci_fetch_array($refcur, OCI_BOTH+OCI_RETURN_NULLS) )
{
   if ($outp != $start) {$outp .= ",";}
   $outp .= '{'.
              '"id":'          . $row[0] . ','  . 
              '"nome":"'       . $row[1] . '",' .
              '"descr":"'      . $row[2] . '",' .
              '"contro_ind":"' . $row[3] . '",' .
              '"pre_req":"'    . $row[4] . '",' .
              '"alert_msg":"'  . $row[5] . '",'  .
              '"alert_msg_visibile":"'  . $row[6] . '",'  .
              '"bibliografia":"'  . $row[7] . '",'  .
              '"patologie_secondarie":"'  . $row[8] . '",'  .
              '"valutazione":"'  . $row[9] . '"'  .
            '}';
}
$outp .="]";
echo($outp);

oci_free_statement($refcur);
oci_free_statement($stmt);
oci_close($conn);

?>
