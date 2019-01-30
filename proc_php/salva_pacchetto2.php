<?php

header('Access-Control-Allow-Origin: *'); 
//header('Access-Control-Allow-Methods: GET,POST,PATCH,DELETE,PUT,OPTIONS');
//header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Access-Control-Allow-Headers: *");
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
 

$proc  = rawurldecode($_POST['proc']);
$nome  = rawurldecode($_POST['nome']);
$descr = str_replace('&nbsp;', ' ', rawurldecode($_POST['descr']) );
$pre_req    = rawurldecode($_POST['pre_req']);
$contro_ind = rawurldecode($_POST['contro_ind']);
$alert_msg  = rawurldecode($_POST['alert_msg']);
$alert_msg_visibile  = rawurldecode($_POST['alert_msg_visibile']);
$bibliografia  = rawurldecode($_POST['bibliografia']);
$patologie_secondarie  = rawurldecode($_POST['patologie_secondarie']);
$valutazione  = rawurldecode($_POST['valutazione']);
$note  = rawurldecode($_POST['note']);
$ambito = rawurldecode($_POST['ambito']);
$id_scheda_val = rawurldecode($_POST['id_scheda_val']);

//echo '{"status":"exception", "message":"'.$contro_ind.'"}';
//die();


//$fp = fopen('myfile.txt', 'w');
//fwrite($fp, $descr);
//fclose($fp);
//die();


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


$descrCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$descrCLOB->writeTemporary($descr);

$pre_reqCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$pre_reqCLOB->writeTemporary($pre_req);

$contro_indCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$contro_indCLOB->writeTemporary($contro_ind);

$alert_msgCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$alert_msgCLOB->writeTemporary($alert_msg);

$alert_msg_visibileCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$alert_msg_visibileCLOB->writeTemporary($alert_msg_visibile);

$bibliografiaCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$bibliografiaCLOB->writeTemporary($bibliografia);

$patologie_secondarieCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$patologie_secondarieCLOB->writeTemporary($patologie_secondarie);

$valutazioneCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$valutazioneCLOB->writeTemporary($valutazione);

$noteCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$noteCLOB->writeTemporary($note);

$contro_ind_absCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$contro_ind_absCLOB->writeTemporary($contro_ind_abs);

$pre_req_compCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$pre_req_compCLOB->writeTemporary($pre_req_comp);

$come_valutareCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$come_valutareCLOB->writeTemporary($come_valutare);


oci_bind_by_name($stmt, ':nome'       , $nome, 255);
oci_bind_by_name($stmt, ":descr"      , $descrCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':pre_req'    , $pre_reqCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':contro_ind' , $contro_indCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':alert_msg'  , $alert_msgCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':alert_msg_visibile'   , $alert_msg_visibileCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':bibliografia'         , $bibliografiaCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':patologie_secondarie' , $patologie_secondarieCLOB,  -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':valutazione'          , $valutazioneCLOB,  -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':note'           , $noteCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':contro_ind_abs' , $contro_ind_absCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':pre_req_comp'   , $pre_req_compCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':come_valutare'  , $come_valutareCLOB, -1, OCI_B_CLOB);
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
