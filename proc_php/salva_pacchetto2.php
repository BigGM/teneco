<?php

header('Access-Control-Allow-Origin: *'); 
header('Content-Type: text/plain; charset=utf-8');


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
/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc    - la procedura del DB di lettura
 * $nome    - il nome del nuovo pacchetto 
 * $descr   - la descrizione del pacchetto 
 * $pre_req - pre requisiti
 * $contro_ind - contro indicazioni 
 * $alert_msg  - messaggio di alert 
 **/

parse_str($_SERVER['QUERY_STRING']);

$proc  = rawurldecode($proc);
$nome  = rawurldecode($nome);
$descr = rawurldecode($descr);
$pre_req    = rawurldecode($pre_req);
$contro_ind = rawurldecode($contro_ind);
$alert_msg  = rawurldecode($alert_msg);
$alert_msg_visibile  = rawurldecode($alert_msg_visibile);
$bibliografia  = rawurldecode($bibliografia);
$patologie_secondarie  = rawurldecode($patologie_secondarie);
$valutazione  = rawurldecode($valutazione);
$note  = rawurldecode($note);
$ambito = rawurldecode($ambito);
$id_scheda_val = rawurldecode($id_scheda_val);

/*****
echo $proc . "\n";
echo $nome. "\n";
echo $descr . "\n";
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
   $msg = msg_fmt( $e['message'] );
   echo '{"status":"exception", "message":"'.$msg.'"}';
   die();
}


/**
 * Crea lo statement per eseguire la procedura oracle 
 **/
$cmd  = 'BEGIN ' . $proc . '(:nome, :descr, :pre_req, :contro_ind, :alert_msg, :alert_msg_visibile,  :bibliografia, :patologie_secondarie, :valutazione, :note, :contro_ind_abs, :pre_req_comp, :come_valutare, :ambito, :id_scheda_val, :outcome); END;'; 
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

oci_bind_by_name($stmt, ':nome'    , $nome, 255);
oci_bind_by_name($stmt, ':descr'   , $descr, 4000);
oci_bind_by_name($stmt, ':pre_req' , $pre_req, 4000);
oci_bind_by_name($stmt, ':contro_ind' , $contro_ind, 4000);
oci_bind_by_name($stmt, ':alert_msg'  , $alert_msg, 255);
oci_bind_by_name($stmt, ':alert_msg_visibile' , $alert_msg_visibile, 4000);
oci_bind_by_name($stmt, ':bibliografia' , $bibliografia, 4000);
oci_bind_by_name($stmt, ':patologie_secondarie' , $patologie_secondarie, 4000);
oci_bind_by_name($stmt, ':valutazione' , $valutazione, 4000);
oci_bind_by_name($stmt, ':note' , $note, 4000);
oci_bind_by_name($stmt, ':contro_ind_abs' , $contro_ind_abs, 4000);
oci_bind_by_name($stmt, ':pre_req_comp'   , $pre_req_comp, 4000);
oci_bind_by_name($stmt, ':come_valutare'  , $come_valutare, 4000);
oci_bind_by_name($stmt, ':ambito'         , $ambito, 100);
oci_bind_by_name($stmt, ':id_scheda_val'  , $id_scheda_val, 100);
oci_bind_by_name($stmt, ':outcome'        , $outcome, 4000);


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
echo '{"status":"ok", "message":"'. msg_fmt($outcome) .'"}';

oci_free_statement($stmt);
oci_close($conn);

?>
