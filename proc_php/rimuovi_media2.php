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
/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc         - la procedura pl/sql di cancellazione
 * $id_media     - l'id sul DB dell'oggetto multimediale
 * $nome_media   - nome del file multimediale
 * $tipo_media   - video, audio, doc, image 
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc  = rawurldecode($proc);
$id_media = rawurldecode($id_media);
$nome_media = rawurldecode($nome_media);
$tipo_media = rawurldecode($tipo_media);

/*****
echo $proc . "\n";
echo $id_media . "\n";
echo $nome_media . "\n";
echo $tipo_media . "\n";
echo $_SERVER['DOCUMENT_ROOT'] . "\n";
die();
*****/

// Tutti i messaggi di errore devono essere restituiti nel modo qui indicato
//echo '{"status":"exception", "message":"fake error message"}';
//die();



$home_media_file = $_SERVER['DOCUMENT_ROOT'] . "/GCA/";
$dir_media_file = array();
$dir_media_file['video'] = $home_media_file . "video/";
$dir_media_file['audio'] = $home_media_file . "audio/";
$dir_media_file['doc']   = $home_media_file . "docs/";
$dir_media_file['image'] = $home_media_file . "img_riabilitazione/";

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
$cmd  = 'BEGIN ' . $proc . '(:id_media, :outcome); END;'; 
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
$outcome  = "";

oci_bind_by_name($stmt, ':id_media',$id_media, 255);
oci_bind_by_name($stmt, ':outcome',$outcome, 4000);


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
oci_free_statement($stmt);
oci_close($conn);

//echo $dir_media_file[$tipo_media] . $nome_media;
unlink( $dir_media_file[$tipo_media] . $nome_media );


// Successo
echo '{"status":"ok", "message":"'. msg_fmt( $outcome ) .'"}'; 

?>
