<?php
foreach (get_class_methods('OCI-Lob') as $method ) {
    print "OCI-Lob::$method()" . "<br>";
}
?>