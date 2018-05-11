<?php

function resuelveGet($nro_producto=0){

  //tomo la instancia global de la conexion a la DB
  global $mysql;

  //Lista TOTAL de productos
  if($nro_producto==0){
    /*****************************************************
    * Se encarga de armar el json con la lista de productos
    */


    $array_para_json=array();

    //Armo la consulta SQL
    $consulta_sql="select ar.codigo as codigoart,ar.descripcion as descripcionart,precio,ru.descripcion as descripcionrub from articulos as ar inner join rubros as ru on ru.codigo=ar.codigorubro order by descripcionart asc";

    //Ejecuto la consulta
    $registros=$mysql->query($consulta_sql) or die($mysql->error);

    //Itero sobre lo que me devuelve la base de datos de productos y cargo el array para generar el json a retornar
    while ($reg=$registros->fetch_array())
       $array_para_json[]=$reg;

    //genero el json con la lista de productos a partir del array
    $resultado=json_encode($array_para_json);

    //cierro la conexion a la base de datos
    $mysql->close();

    //Devuelvo el Json al browser con lista de productos
    return $resultado;
  }

   /*****************************************************************************
   * Se encarga de buscar un producto y devolver un json con los datos del mismo
   * si lo encuentra, sino envia un JSON con el error
   */

    //Si no encuentro mando este json por defecto indicando que no encontro nada
    $resultado="{\"descripcion\": \"NO ENCONTRADO!!\",\"precio\": \"0\",\"codigo\": \"0\"}";

    //Armo la consulta
    $consulta_sql="select * from articulos where codigo=".$nro_producto;

    //Ejecuto la query en el servidor
    $registros=$mysql->query($consulta_sql) or die($mysql->error);

    //Obtengo la respuesta del Mysql
    $reg=$registros->fetch_array(MYSQLI_ASSOC);

    //Se encontro el articulo?
    if ($reg)//Si encuentra algo, genero el json a enviar como respuesta al JS que hizo la consulta
        $resultado=json_encode($reg);

    //cierro conexion con el servidor Mysql
    $mysql->close();

    //Envio el json armado al JS que me hizo la consulta
    return $resultado;
}


function resuelveDelete($nro_producto){
    //tomo la instancia global de la conexion a la DB
    global $mysql;

    $mysql->query("delete from articulos where codigo=$nro_producto") or die($mysql->error);

    $mysql->close();
}


function resuelvePut($nro_producto,$_PUT){
    //tomo la instancia global de la conexion a la DB
    global $mysql;

    $consulta="update articulos set descripcion='$_PUT[nombre]',precio=$_PUT[precio],codigorubro=$_PUT[rubro] where codigo=$nro_producto";

    $mysql->query($consulta) or die($mysql->error());

    $mysql->close();
}


function resuelvePost(){
    //tomo la instancia global de la conexion a la DB
    global $mysql;

    //inserto en la base de datos el producto nuevo 
    $mysql->query("insert into articulos(descripcion,precio,codigorubro) values ('$_POST[nombre]',$_POST[precio],$_POST[rubro])") or die($mysql->error);

    //cierro la conexion a la base de datos
    $mysql->close();
}

?>
