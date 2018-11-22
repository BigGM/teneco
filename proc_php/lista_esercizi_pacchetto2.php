<?php

header('Access-Control-Allow-Origin: *'); 

/**
 * Elimina caratteri di fine linea e doppi apici dalla stringa in input.
 * Necessario affinche' il ritorno sia interpretato corretamente in formato json.
 */
function msg_fmt( $e ) {
   $replace_what = array('&quot;');
   $replace_with = array(' ');
   $msg = htmlentities($e, ENT_QUOTES);
   $msg = str_replace($replace_what,$replace_with,$msg);
   $msg = preg_replace('#\R+#', '<br>', $msg);
   return $msg;
}


//print_r($_GET);
//$keys = array_keys($_GET);
//print_r($keys);


/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc   - la procedura del DB di lettura
 * $id_pkt  - id del pacchetto di esercizi 
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc   = rawurldecode($proc);
$id_pkt = rawurldecode($id_pkt);


/*****
echo $proc . "\n";
echo $id_pkt . "\n";
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
$cmd  = 'BEGIN ' . $proc . '(:id_pkt,:outcome,:cursor); END;';
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
oci_bind_by_name($stmt, ':id_pkt'  , $id_pkt, 255);
oci_bind_by_name($stmt, ':cursor'  , $refcur, -1, OCI_B_CURSOR);
oci_bind_by_name($stmt, ':outcome' , $outcome, 4000);

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
   echo  htmlentities($outcome, ENT_QUOTES);
   $msg = msg_fmt( $outcome );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}
 

$start = "[";
$outp  = $start;
while ($row=oci_fetch_array($refcur, OCI_BOTH+OCI_RETURN_NULLS) )
{
   if ($outp != $start) {$outp .= ",";}
   $outp .= '{"id_pkt":'      . $row[0] . 
            ',"id_ex":'       . $row[1] .
            ',"nome":"'       . $row[2] .'"'.
            ',"descr":"'      . $row[3] .'"'.
            ',"testo":"'      . $row[4] .'"'.
            ',"alert":"'      . $row[5] .'"'.
            ',"limitazioni":"'. $row[6] .'"'.
            ',"id_grp":'      . $row[7] .
            ',"nome_grp":"'   . $row[8] .'"'.
            ',"count_media":' . $row[9] . '}';
}
$outp .="]";
echo($outp);

oci_free_statement($refcur);
oci_free_statement($stmt);
oci_close($conn);

?>
