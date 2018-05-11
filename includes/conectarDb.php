<?php
   //Instancio un objeto mysqli, con los datos de conexion al servidor Mysql
   $mysql=new mysqli("localhost","iutw","iutw","iutw");
   if ($mysql->connect_error) die("Problemas con la conexion a la base de datos");
?>
