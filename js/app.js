/***********************************
Templates UnderScore usados para generar el HTML
************************************/

var template_lista_productos = _.template(`
    <div id="lista_de_productos"><table class="tablalistado">
    <tbody><tr><th>Codigo</th><th>Descripcion</th><th>Precio</th><th>Rubro</th><th>Borrar</th><th>Modificar</th></tr>
    <% _.each(lista_productos, function(producto) { %>
      <tr id="producto_<%=producto.codigoart%>">
          <td><%=producto.codigoart%></td>
          <td><%=producto.descripcionart%></td>
          <td><%=producto.precio%></td>
          <td><%=producto.descripcionrub%></td>
          <td onclick="borrarProducto(<%=producto.codigoart%>)" align="center"><img src="imagenes/borrar.jpg" width="20"/></td>
          <td onclick="modificarProducto(<%=producto.codigoart%>)" align="center"><img src="imagenes/editar.jpg" width="20"/></td></tr>
    <% }); %></tbody></table></div>`);

var template_body = _.template(`
   <!-- En este div coloco la lista de productos tomadas via ajax desde el webserver-->
   <div id="lista_de_productos"></div>
   <button id="alta_producto">Cargar Producto</button>
   <br/>
   Ingrese Codigo de producto:
   <input type="text" name="nro_producto" id="nro_producto" required>
   <button id="boton_buscar">Buscar Producto</button>
   <!-- En este div coloco el nombre del producto buscado recibido via ajax desde el webserver-->
   <div id="respuesta_de_busqueda"></div>
   <div id="ventana_alta_productos"></div>
   <div id="ventana_modificacion_productos"></div>`);

var template_respuesta_busqueda = _.template(`
    <br/>
    *** Producto <%= codigo %> ****
    <br/> Descripcion : <%= descripcion %>
    <br/> Precio : <%= precio %>`);

var template_ventana_alta_producto= _.template(`
   Nombre del producto:
   <input type="text" name="nombre_producto" id="nombre_producto" required>
   <br/>Precio del producto:
   <input type="text" name="precio_producto" id="precio_producto" required size="3">
   <br/>Seleccione Rubro<select name="codigo_rubro" id="codigo_rubro">
   <option value="3">carnes</option><option value="1">frutas</option><option value="2">verduras</option>
   </select>`);

var template_ventana_modificacion_producto = _.template(`
   <%  $('#ventana_modificacion_productos').dialog({
              title: 'Modificacion de '+descripcion });
   %>
   Nombre del producto:
   <input type="text" name="nombre_producto_modif" id="nombre_producto_modif" required value="<%=descripcion%>">
   <br/>Precio del producto:
   <input type="text" name="precio_producto_modif" id="precio_producto_modif" required size="3" value="<%=precio%>">
   <input type="hidden" name="nro_producto_modif" id="nro_producto_modif" required size="3" value="<%=codigo%>">
   <br/>Seleccione Rubro<select name="codigo_rubro_modif" id="codigo_rubro_modif">
   <% if(codigorubro==1) %>
      <option value="3">carnes</option><option value="1" selected>frutas</option><option value="2">verduras</option>
   <% if(codigorubro==2) %>
      <option value="3">carnes</option><option value="1">frutas</option><option value="2" selected>verduras</option>
   <% if(codigorubro==3) %>
      <option value="3" selected>carnes</option><option value="1">frutas</option><option value="2">verduras</option>
   %>
   </select>`);

/*****************************************
Fin de zona de Templates Underscore usados
*****************************************/



/****************************************************
 * Esto se ejecuta cuando se termina de cargar el DOM
 */
$( document ).ready(function() {

   //genero el "body" desde el template y lo cargo al body, valga la redundancia :)
   $("body").append(template_body());

   //Cargo, al entrar, la lista de productos
   buscarListaDeProductos();

   /*
    * Designo handlers(la funcion buscarProducto()) del evento "click"
    * del boton Buscar y de Alta de productos
    */
   $("#boton_buscar").on('click',buscarProducto);
   $("#alta_producto").on('click',function(){
       $('#ventana_alta_productos').html(template_ventana_alta_producto());
       $('#ventana_alta_productos').dialog('open');
   });

   // Ejecuto cada 3 seg (3000 ms) la funcion que refresca la lista de productos
   setInterval( buscarListaDeProductos ,3000 );

   //Este popup se despliega cuando cargo un producto nuevo
   $('#ventana_alta_productos').dialog({
        autoOpen: false,
        title: 'Alta de Producto',
        width: 340,
        height: 190,
        modal: true,
        resizable: false,
        buttons: {
            'Cargar Producto': function () {
                var nombre = $("#nombre_producto").val();
                var precio = $("#precio_producto").val();
                var rubro = $("#codigo_rubro").val();
                $.ajax({
                    method: "POST",
                    url: "api/productos/",
                    data: {
                        nombre:nombre,
                        rubro:rubro,
                        precio:precio
                    },
                    success:function(salida){
                      buscarListaDeProductos();
                    }
                });
                $(this).dialog('close');
            },
            'Cancelar': function () {
                $(this).dialog('close');
            }
        }
    });

   //Este popup se despliega cuando modifico un producto 
   $('#ventana_modificacion_productos').dialog({
        autoOpen: false,
        width: 340,
        height: 190,
        modal: true,
        resizable: false,
        buttons: {
            'Modificar Producto': function () {
                var nombre = $("#nombre_producto_modif").val();
                var precio = $("#precio_producto_modif").val();
                var rubro = $("#codigo_rubro_modif").val();
                var nro_producto = $("#nro_producto_modif").val();
                $.ajax({
                    method: "PUT",
                    url: "api/productos/"+nro_producto,
                    data: {
                        nombre:nombre,
                        rubro:rubro,
                        precio:precio
                    },
                    success:function(salida){
                          buscarListaDeProductos();
                         // esto lo tengo que reemplazar por algo que modifique solo el TR del producto modificado
                         // no tiene que cargar toda la lista completa...
                    }
                });
                $(this).dialog('close');
            },
            'Cancelar': function () {
                $(this).dialog('close');
            }
        }
    });

});

/***************** FIN DE DOCUMENT READY *************************/




/*******************************************************
 * Funcion para buscar la lista de productos
 * El Backend Lamp solo devuelve un Json con la lista de productos
 * JS se encargara de armar el DOM con este Json
 */
var buscarListaDeProductos = function(){
  //Realizo el GET Ajax hacia el Lamp
  $.ajax({
    method: "GET",
    url: "api/productos/",
    success:function (json_recibido) {
             /*
              * Recibo del backend un Array de Json con la lista de productos
              * Se lo mando al Template y armo la lista que cargo en el DIV correspondiente
              */
              $("#lista_de_productos").html(template_lista_productos({lista_productos : JSON.parse(json_recibido)}));
         }
  });
}


/*************************************************************
 * Funcion que se asocia al evento "click" del boton de Buscar
 * Recibe del backend un JSON via la API
 */
var buscarProducto = function(){
    //Tomo el nro de producto a buscar, escrito en el input
    var nro_producto = $("#nro_producto").val();

    $.ajax({
       method: "GET",
       url: "api/productos/"+nro_producto,
       success:function(json_recibido){
            //  Uso el Json recibido del API y se lo paso al template correspondiente(template_respuesta_busqueda), que va a generar
            //  el HTML que inseerto en el DIV
            $("#respuesta_de_busqueda").html(template_respuesta_busqueda(JSON.parse(json_recibido)));
       }
    });
}


/************************************************************
* Funcion asociada al evento  click de los botones de borrar productos
*/
var borrarProducto = function(nro_producto){
    if (confirm('¿Esta seguro que quiere borrar este producto?')){
       $.ajax({
          method: "DELETE",
          url: "api/productos/"+nro_producto,
          success:function(respuesta){
             $("#producto_" + nro_producto).fadeOut(1000);
          }
       });
    }
}

/************************************************************
* Funcion asociada al evento  click de los botones de modificar productos
*/
var modificarProducto = function(nro_producto){
    $.ajax({
        method: "GET",
        url: "api/productos/"+nro_producto,
        success:function(json_recibido){
             // Recibo un Json con los datos del producto a modificar
             // y se los paso al template para despues asignarlo a la ventana de modificacion
             $('#ventana_modificacion_productos').html(template_ventana_modificacion_producto(JSON.parse(json_recibido)));
             $('#ventana_modificacion_productos').dialog('open');
        }
    });
}
