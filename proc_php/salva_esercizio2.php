<?php

header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Headers: *");


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
 * $proc  - la procedura del DB di lettura
 * $nome  - il nome del nuovo pacchetto 
 * $descr - la descrizione del pacchetto 
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc  = rawurldecode($_POST['proc']);
$id_pkt  = rawurldecode($_POST['id_pkt']);
$nome  = rawurldecode($_POST['nome']);
$descr = rawurldecode($_POST['descr']);
$testo = rawurldecode($_POST['testo']);
$alert = rawurldecode($_POST['alert']);
$limitazioni = rawurldecode($_POST['limitazioni']);
$id_grp = rawurldecode($_POST['id_grp']);


/*****
echo $proc . "\n";
echo $id_pkt . "\n";
echo $nome. "\n";
echo $descr . "\n";
echo $testo . "\n";
echo $alert . "\n";
echo $limitazioni . "\n";
echo $id_grp . "\n";
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
$cmd  = 'BEGIN ' . $proc . '(:id_pkt, :nome, :descr, :testo, :alert, :limitazioni, :id_grp, :outcome); END;'; 
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

$testoCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$testoCLOB->writeTemporary($testo);

$alertCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$alertCLOB->writeTemporary($alert);

$limitazioniCLOB = oci_new_descriptor($conn, OCI_D_LOB);
$limitazioniCLOB->writeTemporary($limitazioni);


oci_bind_by_name($stmt, ':id_pkt'      , $id_pkt, 255);
oci_bind_by_name($stmt, ':nome'        , $nome, 255);
oci_bind_by_name($stmt, ":descr"       , $descrCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':testo'       , $testoCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':alert'       , $alertCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':limitazioni' , $limitazioniCLOB, -1, OCI_B_CLOB);
oci_bind_by_name($stmt, ':id_grp'      , $id_grp, 255);
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
