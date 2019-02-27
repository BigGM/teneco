<?php

header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Headers: *");
header('Content-Type: text/plain; charset=utf-8');

include('msg_fmt.php');



$proc     = rawurldecode($_POST['proc']);
$nome     = rawurldecode($_POST['nome']);
$cognome  = rawurldecode($_POST['cognome']);
$cf       = rawurldecode($_POST['cf']);
$sesso    = rawurldecode($_POST['sesso']);
$luogo_nascita = rawurldecode($_POST['luogo_nascita']);
$data_nascita  = rawurldecode($_POST['data_nascita']);
$residenza     = rawurldecode($_POST['residenza']);
$indirizzo     = rawurldecode($_POST['indirizzo']);
$nazionalita   = rawurldecode($_POST['nazionalita']);
$email         = rawurldecode($_POST['email']);
$note          = rawurldecode($_POST['note']);


/*****
echo $proc . "\n";
echo $nome. "\n";
echo $cognome. "\n";
echo $cf . "\n";
echo $sesso . "\n";
echo $luogo_nascita . "\n";
echo $data_nascita . "\n";
echo $residenza . "\n";
echo $indirizzo . "\n";
echo $nazionalita . "\n";
echo $email . "\n";
echo $note . "\n";
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
$cmd  = 'BEGIN ' . $proc . '(:nome, :cognome, :cf, :sesso, :luogo_nascita, :data_nascita,  :residenza, :indirizzo, :nazionalita, :email, :note, :outcome); END;'; 
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


oci_bind_by_name($stmt, ':nome'         , $nome, 255);
oci_bind_by_name($stmt, ':cognome'      , $cognome, 255);
oci_bind_by_name($stmt, ':cf'           , $cf, 255);
oci_bind_by_name($stmt, ':sesso'        , $sesso, 255);
oci_bind_by_name($stmt, ':luogo_nascita', $luogo_nascita, 255);
oci_bind_by_name($stmt, ':data_nascita' , $data_nascita, 255);
oci_bind_by_name($stmt, ':residenza'    , $residenza, 255);
oci_bind_by_name($stmt, ':indirizzo'    , $indirizzo, 255);
oci_bind_by_name($stmt, ':nazionalita'  , $nazionalita, 255);
oci_bind_by_name($stmt, ':note'         , $note, 1024);
oci_bind_by_name($stmt, ':email'        , $email, 1024);
oci_bind_by_name($stmt, ':outcome'      , $outcome, 4000);


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
