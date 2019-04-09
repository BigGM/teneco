<?php

header('Access-Control-Allow-Origin: *'); 

include('msg_fmt.php');

/**
 * Elimina caratteri di fine linea e doppi apici dalla stringa in input.
 * Necessario affinche' il ritorno sia interpretato corretamente in formato json.
 *
function msg_fmt( $e ) {
   $replace_what = array('&quot;');
   $replace_with = array(' ');
   $msg = htmlentities($e, ENT_QUOTES);
   $msg = str_replace($replace_what,$replace_with,$msg);
   $msg = preg_replace('#\R+#', '<br>', $msg);
   return $msg;
} */


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
oci_bind_by_name($stmt, ':cursor'  , $refcur, -1, OCI_B_CURSOR);
oci_bind_by_name($stmt, ':ambito'  , $ambito, 100);
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
   $msg = msg_fmt( $outcome );
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
              '"id":'          . rawurlencode($row[0]) . ','  .
              '"nome":"'       . rawurlencode($row[1]) . '",' .
              '"descr":"'      . rawurlencode($row[2]!=null ? $row[2]->load() : $row[2]) . '",' .
              '"contro_ind":"' . rawurlencode($row[3]!=null ? $row[3]->load() : $row[3]) . '",' .
              '"pre_req":"'    . rawurlencode($row[4]!=null ? $row[4]->load() : $row[4]) . '",' .
              '"alert_msg":"'  . rawurlencode($row[5]!=null ? $row[5]->load() : $row[5]) . '",' .
              '"alert_msg_visibile":"' . rawurlencode($row[6]!=null ? $row[6]->load() : $row[6]) . '",' .
              '"bibliografia":"'  . rawurlencode($row[7]!=null ? $row[7]->load() : $row[7]) . '",' .
              '"patologie_secondarie":"' . rawurlencode($row[8]!=null ? $row[8]->load() : $row[8]) . '",' .
              '"valutazione":"'  . rawurlencode($row[9]!=null ? $row[9]->load() : $row[9]) . '",' .
              '"num_esercizi":' . $row[10] . ',' .
              '"note":"'        . rawurlencode($row[11]!=null ? $row[11]->load() : $row[11]) . '",' .
              '"contro_ind_abs":"' . rawurlencode($row[12]!=null ? $row[12]->load() : $row[12]) . '",' .
              '"pre_req_comp":"'  . rawurlencode($row[13]!=null ? $row[13]->load() : $row[13]) . '",' .
              '"come_valutare":"'  . rawurlencode($row[14]!=null ? $row[14]->load() : $row[14]) . '",' .
              '"id_scheda_val":' . $row[15] .
            '}';
   
}
$outp .= "]";
echo($outp);

oci_free_statement($refcur);
oci_free_statement($stmt);
oci_close($conn);

?>
