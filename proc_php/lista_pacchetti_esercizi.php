<?php

/**
 * Questo script costruisce la lista dei pacchetti e per ogni pacchetto la lista dei suoi esercizi, richiamando
 * la opportuna procedura oracle che restituisce la lista in un cursore. Il valore di ritorno e' in formato json_decode
 * con la struttura riportata qui sotto:
      [
         {
            "id_pacchetto": "id del pacchetto",
            "nome_pacchetto": "nome di questo pacchetto",
            "descr_pacchetto": "descrizione del pacchetto di esercizi",
            "esercizi": [
               {
                  "id_esercizio": "id esercizio",
                  "nome_esercizio": "nome dell'esercizio",
                  "descr_esercizio": "descrizione esercizio",
                  "assegnato" : "S"/"N"
               },
               {
                  "id_esercizio": "id esercizio",
                  "nome_esercizio": "nome dell'esercizio",
                  "descr_esercizio": "descrizione esercizio",
                  "assegnato" : "S"/"N"
               },
               ....
            ]
         },
         ... prossimo pacchetto con i suoi esercizi
      ]
 **/

header('Access-Control-Allow-Origin: *'); 

include('msg_fmt.php');


/**
 * Parsa la query string. Restituisce questi attributi:
 * $proc        - la procedura del DB di lettura
 * $id_paziente - id del paziente
 * $ambito      - ambito (1,2)
 **/
parse_str($_SERVER['QUERY_STRING']);

$proc = rawurldecode($proc);
$id_paziente = rawurldecode($id_paziente);
//$id_ambito = rawurldecode($id_ambito);

/*****
echo $proc . "\n";
echo $id_paziente  . "\n";
die();
*****/

// Variabili accesso al DB
$db_user=getenv('ANA_DB_USERNAME');
$db_pwd=getenv('ANA_DB_PASSWORD');
$db_conn_string=getenv('ORACLE_CONN_STRING');

/**
 * Connessione al DB
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
$cmd  = 'BEGIN ' . $proc . '(:id_paziente, :outcome, :cursor); END;';
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
oci_bind_by_name($stmt, ':id_paziente', $id_paziente, 100);
//oci_bind_by_name($stmt, ':id_ambito'  , $id_ambito, 100);
oci_bind_by_name($stmt, ':outcome' , $outcome, 4000);
oci_bind_by_name($stmt, ':cursor'  , $refcur, -1, OCI_B_CURSOR);

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
 


// la lista dei pacchetti di ritorno
$array_pkt = array();

// una mappa hash di appoggio per ottenre rapidamente un pacchetto dal suo id
$hash_pkt = array();

// id del pacchetto corrente (-1: ancora non assegnato)
$id_pacchetto_curr = -1;

/**/
while ($row=oci_fetch_array($refcur, OCI_BOTH+OCI_RETURN_NULLS) )
{
   $id_pacchetto = rawurlencode($row[0]);
   
   // prossimo pacchetto
   if ( $id_pacchetto != $id_pacchetto_curr ) {
      $id_pacchetto_curr =  $id_pacchetto;
      $newPkt = new stdClass;
      $newPkt->id_ambito =  rawurlencode($row[7]);
      $newPkt->id_pacchetto =  $id_pacchetto;
      $newPkt->nome_pacchetto = rawurlencode($row[2]);
      $newPkt->descr_pacchetto = rawurlencode($row[3]!=null ? $row[3]->load() : $row[3]);

      // crea la lista degli esercizi per questo pacchetto
      $newPkt->esercizi = array();
      
      $newEx = new stdClass;
      $newEx->id_esercizio = rawurlencode($row[1]);
      $newEx->nome_esercizio = rawurlencode($row[4]);
      $newEx->descr_esercizio = rawurlencode($row[5]!=null ? $row[5]->load() : $row[5]);
      $newEx->assegnato = rawurlencode($row[6])=='S' ? true : false;
      
      // inserisce l'esercizio alla lista degli esercizi
      array_push($newPkt->esercizi, $newEx);
      
      // inserisce il pacchetto nella lista dei pacchetti
      array_push($array_pkt, $newPkt);
      
      // e assegna questo pacchetto alla mappa hash di appoggio col suo id
      $hash_pkt[ $id_pacchetto ] = $newPkt;
   }
   // prossimo esercizio del pacchetto attuale
   else {
      // recupera il pacchetto dalla mappa hash di appoggio ...
      $pkt = $hash_pkt[ $id_pacchetto ];

      // e ci aggiunge il prossimo esercizio 
      $newEx = new stdClass;
      $newEx->id_esercizio = rawurlencode($row[1]);
      $newEx->nome_esercizio = rawurlencode($row[4]);
      $newEx->descr_esercizio = rawurlencode($row[5]!=null ? $row[5]->load() : $row[5]);
      $newEx->assegnato = rawurlencode($row[6])=='S' ? true : false;
      array_push($pkt->esercizi, $newEx);
   }
}

$out = json_encode($array_pkt);
echo $out;

oci_free_statement($refcur);
oci_free_statement($stmt);
oci_close($conn);

?>
