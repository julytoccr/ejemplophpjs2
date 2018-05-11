<?php
 include("../includes/conectarDb.php");
 include("../includes/funciones.php");

 $metodo=$_SERVER['REQUEST_METHOD'];
 $uri=$_SERVER['REQUEST_URI'];

 //desarmo la url para analizarla luego, la conviero en un arrary
 $array_uri = explode("/", $uri);

 //quito las primera parte de la uri
 $recurso = array_shift($array_uri);
 $recurso = array_shift($array_uri);


 switch($metodo){
  case 'GET'://Metodo GET entra por aca
        $recurso = array_shift($array_uri);
        //comienza con api
        if($recurso == 'api'){
           $recurso = array_shift($array_uri);
           $nro_producto = array_shift($array_uri);
           if(empty($nro_producto)){//pide lista completa
              echo resuelveGet();
           }
           else{
              //tengo que chequear que lo que siga tenga el formato de url requerido, sino, devuelvo un 400 
              if(is_numeric($nro_producto)){
                if(count($array_uri)==0){
                   echo resuelveGet($nro_producto);
                }
                else
                   header('HTTP/1.1 400 Bad Request');
              }
              else{
               header('HTTP/1.1 400 Bad Request');
              }
           }
        }else{// Sólo se aceptan que comienzen con productos
          header('HTTP/1.1 404 Not Found');
        }
       break;
  case 'POST':
       resuelvePost();
       break;
  case 'PUT':
        $recurso = array_shift($array_uri);
        //comienza con api
        if($recurso == 'api'){
           $recurso = array_shift($array_uri);
           //$recurso = array_shift($array_uri);
           $nro_producto = array_shift($array_uri);
           if(empty($nro_producto)){
               header('HTTP/1.1 400 Bad Request');
           }
           else{
              //tengo que chequear que lo que siga tenga el formato de url requerido, sino, devuelvo un 400
              if(is_numeric($nro_producto)){
                if(count($array_uri)==0){
                   parse_str(file_get_contents('php://input'), $_PUT);
                   echo resuelvePut($nro_producto,$_PUT);
                }
                else
                   header('HTTP/1.1 400 Bad Request');
              }
              else{
               header('HTTP/1.1 400 Bad Request');
              }
           }
        }else{// Sólo se aceptan que comienzen con productos
          header('HTTP/1.1 404 Not Found');
        }
        break;
  case 'DELETE':
        $recurso = array_shift($array_uri);
        //comienza con api
        if($recurso == 'api'){
           $recurso = array_shift($array_uri);
           $nro_producto = array_shift($array_uri);
           if(empty($nro_producto)){//no especifico que producto borrar
               header('HTTP/1.1 400 Bad Request');
           }
           else{
              //tengo que chequear que lo que siga tenga el formato de url requerido, sino, devuelvo un 400
              if(is_numeric($nro_producto)){
                if(count($array_uri)==0){
                   echo resuelveDelete($nro_producto);
                }
                else
                   header('HTTP/1.1 400 Bad Request');
              }
              else{
               header('HTTP/1.1 400 Bad Request');
              }
           }
        }else{// Sólo se aceptan que comienzen con productos
          header('HTTP/1.1 404 Not Found');
        }
       break;
  default:
        header('HTTP/1.1 405 Method not allowed');
        header('Allow: GET, PUT, DELETE, POST');
 }


?>
