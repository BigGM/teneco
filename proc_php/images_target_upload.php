<?php
   header('Access-Control-Allow-Origin: *'); 
 
   // se ho uploadato almeno un file....
   $home_target_path  = "../htdocs/GCA/img_target";
   $stored_proc_name = "NeuroApp.aggiungi_target";

   if ( empty( $_FILES ) ) {
      echo 'Exception: File non trovato';
      die();  
   }

   // Path sul file system di upload del file
   $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
   $docName = str_replace(" ","_",$_FILES[ 'file' ][ 'name' ]);
   $uploadPath = $home_target_path . "/" . $docName;
  
   // questi sono i campi per la procedura oracle di inserimento del record
   $url = "/GCA/img_target/". $docName;
   $nome_target = $_POST['nome_target'];
   $categoria = $_POST['categoria'];
   $descrizione = $_POST['descrizione'];
     
   $ris = move_uploaded_file( $tempPath, $uploadPath );
   if (!$ris) {
      echo 'Exception: documento non trasferito';
      die();
   }

   $db_user = getenv('ANA_DB_USERNAME');
   $db_pwd  = getenv('ANA_DB_PASSWORD');
   $db_conn_string = getenv('ORACLE_CONN_STRING');
   $conn = oci_pconnect($db_user, $db_pwd, $db_conn_string, 'AL32UTF8');
 
   if (!$conn) {
      $e = oci_error();
      echo  "Exception: " . htmlentities($e['message'], ENT_QUOTES);
      die();
   }
 
   /*** Crea lo statement per eseguire la procedura oracle **/
   $cmd  = 'BEGIN ' . $stored_proc_name . '(:url, :nome_target, :categoria, :descrizione, :outcome); END;'; 
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
   oci_bind_by_name($stmt, ':nome_target'  , $nome_target, 4000);
   oci_bind_by_name($stmt, ':categoria'    , $categoria, 4000);
   oci_bind_by_name($stmt, ':descrizione'  , $descrizione, 4000);
   oci_bind_by_name($stmt, ':outcome'      , $outcome, 4000);

   /** Lancia la procedura **/
   $exec = oci_execute($stmt);
   if (!$exec) {
      $e = oci_error($stmt);
      echo  "Exception: " . htmlentities($e['message'], ENT_QUOTES);
      die();
   }

 
   /** 
   * Check esito della procedura via $outcome: ogni procedura PL/SQL dovra restituire
   * un messaggio di errore che inizia con "Exception"
   **/
   if ( substr($outcome,0,9)==="Exception" ) { 
      echo  htmlentities($outcome, ENT_QUOTES);
      die();
   }
   oci_free_statement($stmt);
   oci_close($conn);
  
   echo($outcome);
?>
