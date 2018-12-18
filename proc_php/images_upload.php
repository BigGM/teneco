<?php

header('Access-Control-Allow-Origin: *'); 

// se ho uploadato almeno un file....
$home_images_path  = "../htdocs/GCA/img_riabilitazione";
$stored_proc_name = "NeuroApp.aggiungi_media";

if ( empty( $_FILES ) ) {
  echo 'Exception: File non trovato';
  die();  
  }

$titolo_images="";
$tempPath = $_FILES[ 'file' ][ 'tmp_name' ];	

if (isset($_POST['descrizione']))  {
   $titolo_images=$_POST['descrizione'];
}
$imagesFileName=str_replace(" ","_",$_FILES[ 'file' ][ 'name' ]);
$uploadPath=$home_images_path."/".$imagesFileName;

$ris=move_uploaded_file( $tempPath, $uploadPath );

 
 if (!$ris) {
      echo 'Exception: File immagine non trasferito';
      die();
 }
 // NB. url da inserire in ambiente di test
 //$url = "http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT']."/GCA/img_riabilitazione/". $imagesFileName;
 $url = "/GCA/img_riabilitazione/". $imagesFileName;  
 $descr_media = $titolo_images;
 $tipo_media = "image";
 $db_user=getenv('ANA_DB_USERNAME');
 $db_pwd=getenv('ANA_DB_PASSWORD');
 $db_conn_string=getenv('ORACLE_CONN_STRING');
 $conn = oci_pconnect($db_user, $db_pwd, $db_conn_string, 'AL32UTF8');
 
 if (!$conn) {
    $e = oci_error();
    echo  "Exception: " . htmlentities($e['message'], ENT_QUOTES);
    die();
 }
 
/*** Crea lo statement per eseguire la procedura oracle **/
 $cmd  = 'BEGIN ' . $stored_proc_name . '(:url, :descr_media, :tipo_media, :outcome); END;'; 
 $stmt = oci_parse($conn, $cmd);
 if (!$stmt) {
    $e = oci_error($conn);
    echo  "Exception: " . htmlentities($e['message'], ENT_QUOTES);
    die();
 }
 
 oci_set_prefetch($stmt,1000);
 
 /** Imposta i parametri della procedura **/
 $outcome  = "";
 oci_bind_by_name($stmt, ':url'          , $url, 4000);
 oci_bind_by_name($stmt, ':descr_media'  , $descr_media, 4000);
 oci_bind_by_name($stmt, ':tipo_media'   , $tipo_media, 4000);
 oci_bind_by_name($stmt, ':outcome'      , $outcome, 4000);
 
/*** Lancia la procedura **/
$exec = oci_execute($stmt);
if (!$exec) {
   $e = oci_error($stmt);
   echo  "Exception: " . htmlentities($e['message'], ENT_QUOTES);
   die();
}

/*** Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
 * un messaggio di errore che inizia con "Exception" **/
 if ( substr($outcome,0,9)==="Exception") { 
    echo  htmlentities($outcome, ENT_QUOTES);
    die();
 }
 echo($outcome);
 oci_free_statement($stmt);
 oci_close($conn);    
?>