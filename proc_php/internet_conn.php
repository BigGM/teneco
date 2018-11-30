<?php

/**
 * Questo script non fa assolutamente nulla, ma viene periodicamente richiamato
 * dal client per controllare la connessione.
 **/

header('Access-Control-Allow-Origin: *'); 
parse_str($_SERVER['QUERY_STRING']);

?>
