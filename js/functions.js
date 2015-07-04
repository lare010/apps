
$(function() 
{
	//$SqlSrvCon = 'http://webserver1.no-ip.org/server/sqlsrv/sql.php';
	//$SqlSrvCon = 'http://192.168.0.36/server/sqlsrv/sql.php';

	$SqlSrvCon = 'http://localhost/server/sqlsrv/sql.php';

	//$SqlSrvCon = 'http://localhost/server/mysql/sql.php';
	//$SqlSrvCon = 'http://lyrstudios.com/apps/sql.php';

	

	//...............................................................................................		
	//VARIABLES GLOBALES

		var $serial  = '';  //guarda los datos serializados del fieldset
		var $asaldo  = 0;   //variable que controla el total a pagar
		var $tiempoC = 0;
		var ArrCheck = []; //array que guarda los datos de cada check pulsado
		var $zona    = '';
		//var $zona    = '002';

$('#pequeno').on('click',function(){
	$('#table-custom-2').addClass( "ui-mini" );
	//$('#table-custom-2').trigger("refresh");
	$( '#table-custom-2' ).table( "refresh" );
}) 


$('#grande').on('click',function(){ 
	$('#table-custom-2').removeClass( "ui-mini" );
	$( '#table-custom-2' ).table( "refresh" );
	//$('#table-custom-2').trigger("refresh");

})   
		

	//...............................................................................................		
	/*FUNCION QUE RELLENA DE CEROS LOS CAMPOS*/
	function ceros(numero,ceros) 
	{	
		dif = ceros - numero.length; 
		insertar=0;
		for(m=1; m < dif; m++)
		{ 		  
		  insertar += '0';
		} 			
	  	return insertar += numero; 
	}

	/*FUNCION QUE QUITA LA COMA A LOS TOTALES*/

	function quitcoma_num(valor)
	{	
	    var busca = ",";
	 	var reemplaza = "";
	 	while (valor.toString().indexOf(busca) != -1)
	    	valor = valor.toString().replace(busca,reemplaza);
	  	return valor;
	}

	//...............................................................................................		
	//FUNCION QUE DA FORMATO A LOS TOTALES*/
    function format_num(valor)
    {	
      	var nuevo_numero = new oNumero(valor);
   		//alert(nuevo_numero.formato(2, true));
   		return 	nuevo_numero.formato(2, true);
    }
    
    function oNumero(numero)
    {	
    	//Propiedades 
        this.valor = numero || 0
        this.dec = -1;
 
        //Métodos 
    	this.formato = numFormat;
    	this.ponValor = ponValor;
 
       //Definición de los métodos
      	function ponValor(cad) 
      	{
        	if (cad =='-' || cad=='+') return
        	if (cad.length ==0) return
        	if (cad.indexOf('.') >=0)
            	this.valor = parseFloat(cad);
         	else
            	this.valor = parseInt(cad);
      	} 
 
      	function numFormat(dec, miles) 
      	{
        	var num = this.valor, signo=3, expr;
        	var cad = ""+this.valor;
        	var ceros = "", pos, pdec, i;
        	for (i=0; i < dec; i++)
        	{
            	ceros += '0';
         	}
        	pos = cad.indexOf('.')
        	
        	if (pos < 0) {
            	cad = cad+"."+ceros;
         	} 
         	else 
         	{
            	pdec = cad.length - pos -1;
 
            	if (pdec <= dec) 
            	{
                	for (i=0; i< (dec-pdec); i++) 
                	{
                		cad += '0';
                	}
            	} 
            	else 
            	{
               		num = num*Math.pow(10, dec);
               		num = Math.round(num);
               		num = num/Math.pow(10, dec);
               		cad = new String(num);
            	}
         	}
         	pos = cad.indexOf('.')
 
         	if (pos < 0)
         	{
            	pos = cad.lentgh;
         	}
 
         	if (cad.substr(0,1)=='-' || cad.substr(0,1) == '+') 
         	{
            	signo = 4;
         	}
 
         	if (miles && pos > signo) 
         	{
            	do {
               		expr = /([+-]?\d)(\d{3}[\.\,]\d*)/
               		cad.match(expr)
               		cad=cad.replace(expr, RegExp.$1+','+RegExp.$2);
            	}
 
            	while (cad.indexOf(',') > signo) 
            	{
            		if (dec <= 0) 
            		{
                  		cad = cad.replace(/\./,'');
               		}
            	}
        	}
        return cad;
      	}
    }//Fin del objeto oNumero:

	//...............................................................................................		
	//FUNCION QUE SALTA DENTRE LOS INPUT*/
	$('input, button, select, a').keyup(function(e) 
	{	
		if (e.keyCode == 13) 
		{ 
			val=0;
			obj= (this.id);
			tb = parseInt($(this).attr("tabindex"));

			if (obj=='usuario' && $(this).val()=='') val=1;

			if (obj=='password' && $(this).val()=='') val=1;

		  	if (val==0) 
		  	{
		  		$('[tabindex=' + (tb+1) + ']').focus();
		  	};
	  	}	
    });

	//...............................................................................................	
	//FUNCION QUE HACE LOGIN AL USUARIO		
	$('#loginbtn').on('click focus',function()
	{	
	    try
	    {
			var us= $.trim($("#usuario").val());
			var ps= $.trim($("#password").val());
			if (us=='') 
			{
				$("#usuario").focus();
			} 
			else if(ps=='')
			{
				$("#password").focus();
			} 
			else 
			{
				
				$("#usuario").val(null);
				$("#password").val(null);
		
				$.mobile.loading('show',"b", "Cargando...");

				$.ajax({
				   url: $SqlSrvCon,
				   data: {var1: us, var2:ps, fl:"login"} ,
				   dataType: 'JSON',
				   type: 'POST',
				   success: function (res) 
				   { 		
				    	$.mobile.loading( "hide" );
				    	//alert(res); return; 

						if(res[0] > 0)
						{
							//Inicio sesion correctamente
							LbMenu = $.trim(res[1]);
							$zona  = $.trim(res[2]);
							//alert($zona)

							$.mobile.changePage( "#menu", { transition: "slide", reverse: true});
							$("#labelusuario").html('<b>'+LbMenu+'</b>');
							//$('#menu').trigger("refresh");
									
						}
						else if(res[0]==0)
						{
							alert("Usuario o Password incorrectos");
							$("#usuario").focus();					
						}
						else
							alert(res);
				    }
		    	});
		 	}
	    }
	    catch(ex)
	    {
	        alert("Error al cargar los datos ajax!!");
	    }	
	})

	//...............................................................................................
	//FUNCION QUE BUSCA LOS CLIENTES PENDIENTES*/
	$('#btnCpendiente').on('click',function()
	{	
	    try
	    {
	        $.mobile.loading('show',"b", "Cargando...");

			$.ajax({
				url: $SqlSrvCon,
                data: {fl:"pendientepago", var1:$zona} ,
  			    dataType: 'JSON',
                type: "POST",
				async: true,
			    success: function (res) 
			    { 

			    	$.mobile.loading( "hide" );
					//alert(res[0][0]); return; 
					
					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						$("#ListaDatos").html(null);
						alert('No hay Clientes Pendientes para hoy.');
					} 
					else if ($.trim(res[0][0]) == 1) //SI ES 1 ES UN ERROR
					{
 						$("#ListaDatos").html(null);
						alert(res);
					}
					else
					{
						var lista = "";
		                $.each( res, function( key, value ) 
		                {
	                        lista += '<li id="'+value[0]+'" name="'+value[0]+'">';
	                        lista += '<a href="#">';
	                        lista += '<h2>'+value[1]+'</h2>';
	                        lista += '<p><b>'+value[2]+'</b></p>';
	                        lista += '<p>'+value[3]+'</p>';
	                        lista += '<span class="ui-li-count ui-body-inherit">'+value[4]+'</span>';
	                        lista += '</a>';
	                        lista += '</li>';
		                }); 

		                $("#ListaDatos").html(lista);
		                $("#ListaDatos").listview().listview('refresh');
					}					
			    }
	    	});

	    }
	    catch(ex)
	    {
	        alert("Error al cargar los datos ajax!!");
	    }
	});


	//...............................................................................................	
	//FUNCION QUE BUSCA LOS CLIENTES DEL PROMOTOR*/

	$('.frmBusqCliente').on('click',function()
	{	

	    try
	    {
			panel= this.id;
			nPanel='';	        
	        if ($.trim(panel)=='bqdcl1') 
	        {
	        	nPanel='ListaCliente1';
	        }
	        else
	        	nPanel='ListaCliente';

	        $.mobile.loading('show',"b", "Cargando...");

			$.ajax({
				url: $SqlSrvCon,
                data: {fl:"clientespromotor", var1:$zona} ,
  			    dataType: 'JSON',
                type: "POST",
				async: true,
			    success: function (res) 
			    { 		
					
			    	$.mobile.loading( "hide" );
					//alert(res[0][0]); return; 
					
					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						$("#"+nPanel).html(null);
						alert('No hay registros para esta consulta.');
					} 
					else if ($.trim(res[0][0]) == 1) //SI ES 1 ES UN ERROR
					{
 						$("#"+nPanel).html(null);
						alert(res);
					}
					else
					{
						var lista = "";
		                
		                $.each( res, function( key, value ) 
		                {
	                        lista += '<li id="'+value[0]+'" name="'+value[0]+'">';                        
	                        lista += '<a href="#" >';
	                        lista += '<h2>'+value[1]+'</h2>';
	                        lista += '<p><b>'+value[2]+'</b></p>';
	                        lista += '<p>'+value[3]+'</p>';
	                        lista += '</a>';
	                        lista += '</li>';

		                }); 

		                $("#"+nPanel).html(lista);
		                $("#"+nPanel).listview().listview('refresh');

					}					
			    }
	    	});

	    }
	    catch(ex)
	    {
	        alert("Error al cargar los datos ajax!!");
	    }
	});


	//...............................................................................................	
	//FUNCION QUE CARGA TABLA DEL CLIENTE PARA HACER PAGOS*/

	function TABLAPAGO(doc)
	{	
	    try
	    {
	        //alert('document= '+doc);return
	        $.mobile.loading('show',"b", "Cargando...");

			$.ajax({
				url: $SqlSrvCon,
                data: {fl:"cargarpago",var1:doc} ,
  			    dataType: 'JSON',
                type: "POST",
				async: true,
			    success: function (res) 
			    {  		
					
			    	$.mobile.loading( "hide" );
					//alert(res[0][0]); return; 
					
					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						clearform();
						alert('No hay registros para esta consulta.');
					} 
					else if ($.trim(res[0][0]) == 1) //SI ES 1 ES UN ERROR
					{
 						clearform();
						alert(res);
					}
					else
					{
		                $('#recibo').  val(null);
		                $('#prestamo').val($.trim(res[0][0]));
		                $('#fecha').   val($.trim(res[0][1]));
		                $('#cliente'). val( 
		                	$.trim(res[0][2]) +', '+$.trim(res[0][3]) + ',\n'+$.trim(res[0][4]));

		                $tiempoC = parseInt(res[0][13]);

		                $('#btnsalvaringreso').removeClass( "ui-state-disabled" );
		                $('#printrecibo').css('visibility', 'hidden');

		                //alert($tiempoC);return;

						//LLENA EL GRID CHECK CON LA CONSULTA
						//var fset      = '<fieldset data-role="controlgroup" data-type="vertical" id="ListaCuotas">';
						var	fset     = '<legend>CUOTAS DEL CIENTE:</legend>';
						//var fsetclose = '</fieldset>';	
						var lista     = "";
						
						for (var i = 0, ilen = res.length; i < ilen; i++) 
						{
	                        lista += '<input type="checkbox" name="'+$.trim(res[i][5])+'" id="'+$.trim(res[i][5])+'" >';                        
	                        lista += '<label for="'+$.trim(res[i][5])+'" >';
	                        lista += 'CUOTA :<b class="bcheck" >  '+$.trim(res[i][5])+'  </b><br>';
	                        lista += 'FECHA :<b class="bcheck" >  '+$.trim(res[i][6])+'  </b><br>';
	                        lista += 'MONTO :<b class="bcheck" >  '+format_num(parseFloat(res[i][7]))+'  </b><br>';	                    
	                        
	                        if (parseFloat(res[i][8]) > 0) 
	                        	{
			                        lista += 'MORA :<b class="bcheckb" >  '+format_num(parseFloat(res[i][8]))+'  </b><br> ';
			                        lista += 'PENDIENTE :<b class="bcheckb" >  '
			                        	  +   format_num( parseFloat(res[i][9])+parseFloat(res[i][8]) )+'</b>';
	                        	} else
	                        	{
			                        lista += 'MORA :<b class="bcheck" >  '+format_num(parseFloat(res[i][8]))+'  </b><br> ';
			                        lista += 'PENDIENTE :<b class="bcheck" >  '
			                              +   format_num(parseFloat(res[i][9]))+'</b>';
	                        	};

	                        //lista += '<b class="">  <br>'+Math.round(parseFloat(res[i][10])+'</b>' ;
	                        lista += '<b class="btnoff">  <br>'+res[i][10]+'</b>' ;
	                        lista += '<b class="btnoff">  <br>'+res[i][11]+'</b>';
	                        lista += '<b class="btnoff">  <br>'+res[i][12]+'</b>';
	                        lista += '</label>';
						}
						
		                
		                //$("#cuotasaldar").html(fset+lista+fsetclose);
		                $("#ListaCuotas").html(fset+lista);
		                $("#ListaCuotas").trigger("create");
					}					
			    }
	    	});

	    }
	    catch(ex)
	    {
	        alert("Error al cargar los datos ajax!!");
	    }
	};
	
	//...............................................................................................	
	//FUNCION QUE CARGA TABLA DEL CLIENTE PARA HACER PAGOS*/

	function CONSULTAPAGO(doc)
	{	
	    try
	    {
	        //alert(doc);return
	        $.mobile.loading('show',"b", "Cargando...");

			$.ajax({
				url: $SqlSrvCon,
                data: {fl:"consultapago",var1:doc} ,
  			    dataType: 'JSON',
                type: "POST",
				async: true,
			    success: function (res) 
			    {  		
					
			    	$.mobile.loading( "hide" );
					//alert(res[0][0].length); return; 
					
					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						clearform();
						alert('No ha realizado pagos con este Número.');
					} 
					else if (($.trim(res[0][0]) == 1) && $.trim(res[0][0]).length < 10 ) //SI ES 1 ES UN ERROR
					{
 						clearform();
						alert(res);
					}
					else
					{

		                $('#recibo').  val($.trim(res[0][0]));
		                $('#prestamo').val($.trim(res[0][1]));
		                $('#fecha').   val($.trim(res[0][2]));
		                $('#cliente'). val( 
		                	$.trim(res[0][3]) +', '+$.trim(res[0][4]) + ',\n'+$.trim(res[0][5]));

		                $('#concepto'). val($.trim(res[0][6]));
		                $('#totalp').   val(format_num($.trim(res[0][7])));

		                $('#btnsalvaringreso').addClass( "ui-state-disabled" );
		                $('#printrecibo').css('visibility', 'visible');

						//LLENA EL GRID CHECK CON LA CONSULTA
						//var fset      = '<fieldset data-role="controlgroup" data-type="vertical" id="ListaCuotas">';
						var	fset     = '<legend>PAGOS DEL CIENTE:</legend>';
						//var fsetclose = '</fieldset>';	
						var lista     = "";
						
						for (var i = 0, ilen = res.length; i < ilen; i++) 
						{
	                        lista += '<input disabled="" type="checkbox" name="'+$.trim(res[i][8])+'" id="'+$.trim(res[i][8])+'" >';                        
	                        lista += '<label  for="'+$.trim(res[i][8])+'" >';
	                        lista += 'CUOTA :<b class="bcheck" >  '+$.trim(res[i][8])+'  </b><br>';
	                        lista += 'FECHA :<b class="bcheck" >  '+$.trim(res[i][9])+'  </b><br>';
	                        lista += 'MONTO :<b class="bcheck" >  '+format_num(parseFloat(res[i][10]))+'  </b><br>';	                    

	                        lista += 'MORA :<b class="bcheck" >  '+format_num(parseFloat(res[i][11]))+'  </b><br> ';
	                        lista += 'PENDIENTE :<b class="bcheck" >  '
	                              +   format_num(parseFloat(res[i][12]))+'</b>';

	                        //lista += '<b class="">  <br>'+Math.round(parseFloat(res[i][10])+'</b>' ;
	                        lista += '</label>';
						}
						
		                
		                //$("#cuotasaldar").html(fset+lista+fsetclose);
		                $("#ListaCuotas").html(fset+lista);
		                $("#ListaCuotas").trigger("create");
					}					
			    }
	    	});

	    }
	    catch(ex)
	    {
	        alert("Error al cargar los datos ajax!!");
	    }
	};

	//...............................................................................................
	//FUNCION QUE MANEJA LOS CALCULOS Y ESTADOS DE LOS CHECK EN EL FORM INGRESO

	$(document).on('change', 'input[type="checkbox"]', function() 
	{	
	    idcheck = (this.id); //captura el id del check pulsado

	    cntlbcheck = $("label[for='"+idcheck+"']"); //captura todo el label del obj check
		elementcheck = ($('#'+idcheck).is(':checked') ? 1 : 0); //captura si el check esta activo o no
	    
	    label= cntlbcheck.text();
		label = label.split("  "); //divide la cadena cd vez que encuentra 2 espacios en blanco y convierte la cadena en un array

		
		$serial  = '';
	    $serial  = $("#ListaCuotas").serialize();  //obtiene los datos rerializados del fieldset
		$serial  = $serial.replace(/=|on/g, '');   //reemplaza los caracteres '=' y 'on' por espacio del conjunto serializado
		$serial  = ($serial.split("&"));          //elimina el caracter '&' y convierte la cadena en un array
		rsmPagos = $serial.join(', '); 
		
		//recogecheck(); 
		  
		if (elementcheck == 1) //si el elemento check esta activo
		{  
			$asaldo = ($asaldo + parseInt(label[9]));
			$('#totalp').val(format_num($asaldo));
			//alert( format_num($asaldo)+' , '+elementcheck+' , '+'checked');
		} 
		else  
		{
			$asaldo = ($asaldo - parseInt(label[9]));
			$('#totalp').val(format_num($asaldo));
			//alert( format_num($asaldo)+' , '+elementcheck+' , '+'no checked');
		}	


		if ($serial !='') //si la variable serial tiene datos
		{
			$("#concepto").html('SALDO #: '+rsmPagos+' DE '+$tiempoC+' CUOTAS');
		}
		else 
			$("#concepto").html(null);

	});


	//...............................................................................................
	//FUNCION QUE RECORRE LOS CHECK Y LOS ALMACENA EN UN ARRAY 

	ArrCxcdet1 = [];
	ArrCxcMenc = [];
 
	function recogecheck() 
	{	
		
		ArrCxcMenc   = []; //array que guarda los datos a salvar en cxcmovi1_Ingreso
		ArrCxcdet1   = []; //array que guarda los datos a salvar en cxcdetalle1
 		T_capitalC   = 0; 
 		T_interesC   = 0;
 		T_comisionC  = 0;
 		T_moraC      = 0;
		monto_cuota  = 0;

		arcliente  = $('#cliente').val();
		arcliente  = arcliente.split(","); //convertir el textarea cliente en array para manejarlo por partes

		arfecha    = $('#fecha').val();
		arfecha  = arfecha.split("-");//convertir la fecha en array para enviarla a sql

		nPrestamo  =$('#prestamo').val();
		movimiento ='INGRESO'; concepto = $.trim($('#concepto').val()); vendedor='011'; Tipocredito = 1; 
		descuen = 0, posteo = 1; nombre= $.trim(arcliente[1]); zona = $zona; 
		dire = $.trim(arcliente[2]); tele=''; ciudad=''; clasifica = '01'; Efectivo = quitcoma_num($('#totalp').val()); tarjeta = 0.00; 
		cheque = 0.00; descrip1='DESC.'; descrip2='DESC.'; conbal = 0; provincia = '01'; tasa1 = 2.30; tasa2 = 0.19; traspaso = 0.00; 
		tipoingreso=0; rene=0; turno='A'; cajero='cajera'; secuencia = 0;


		fecha = (arfecha[2]+arfecha[1]+arfecha[0]); tipomovi = '01'; tipomovi1 = 7; tipo = 0; 
		cliente = $.trim(arcliente[0]); descuen1 = 0; pendiente = 0; seguro = 0;  comprobante=''


 		for (var i = 0; i < $serial.length; i++) {

	 		lbchID = $("label[for='"+$serial[i]+"']");
			lbArr = lbchID.text();
			lbArr = lbArr.split("  ");	
			
			Num_cuota  = lbArr[1]; fecha_cuota = (lbArr[3].substring(6)+lbArr[3].substring(3,5)+lbArr[3].substring(0,2));
			monto_cuota = lbArr[5]; abono_cuota = lbArr[9]; mora_cuota = parseFloat(lbArr[7]); capital_cuota = parseFloat(lbArr[10]); 
			interes_cuota = parseFloat(lbArr[11]); comision_cuota = parseFloat(lbArr[12]);

	 		T_capitalC  = T_capitalC + capital_cuota; 
	 		T_interesC  = T_interesC + interes_cuota;
	 		T_comisionC = T_comisionC + comision_cuota;
	 		T_moraC     = T_moraC + mora_cuota;
			
			ArrCxcdet1[i] = [fecha, tipomovi, tipomovi1, tipo, cliente, Num_cuota, fecha_cuota, monto_cuota, 
								abono_cuota, descuen1, pendiente, mora_cuota, capital_cuota, interes_cuota, 
									comision_cuota, seguro, fecha_cuota];
 		}
		

			ArrCxcMenc = [fecha, tipomovi, tipo, cliente, nPrestamo, movimiento, concepto, Tipocredito, vendedor, fecha, 
							fecha, descuen, T_capitalC, posteo, nombre, zona, dire, tele, ciudad, clasifica, 
								Efectivo, tarjeta, cheque, descrip1, descrip2, conbal, provincia, tasa1, tasa2, monto_cuota, 
									T_capitalC, T_interesC, T_comisionC, traspaso, T_moraC, seguro, comprobante, tipoingreso, rene, turno, 
										cajero, secuencia];


		//alert(ArrCxcMenc[34]); return

	    try
	    {
	        $.mobile.loading('show',"b", "Cargando...");

			$.ajax({
				url: $SqlSrvCon,
                data: {fl:"salvarpago", var1:ArrCxcMenc, var2:ArrCxcdet1} ,
  			    dataType: 'JSON',
                type: "POST",
				async: true,
			    success: function (res) 
			    {  
			    	$.mobile.loading( "hide" );

			    	//alert(res[1]);return

					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						clearform();
						alert("RECIBO No. "+res[1]+" Aplicado\n Correctamente...");
					} 
					else if ( ($.trim(res[0][0]) == 1) || ($.trim(res[0][0]) == 2) || 
							  ($.trim(res[0][0]) == 3) || ($.trim(res[0][0]) == 4) ) //SI ES 1 ES UN ERROR
					{
 						//clearform();
						alert(res);
					}
				}
			});	

	    }
	    catch(ex)
	    {
	        alert("Error al cargar los datos ajax!!");
	    }	

	};


	//...............................................................................................			
	//FUNCION QUE LIMPIA EL FORMULARIO
	function clearform() 
	{	
		$("#ListaCuotas").html(null);
		$("#concepto").html(null);
		$('#printrecibo').css('visibility', 'hidden');
		$('#btnsalvaringreso').removeClass( "ui-state-disabled" );

		$("#frmingreso")[0].reset();
	}

	//...............................................................................................		
	//EVENTO QUE MUEVE LA PAGINA Y CARGA LOS DATOS EN EL FORM INGRESO
    $('#ListaDatos').on('click','li',function()
    {	
		TABLAPAGO(this.id); 
		$.mobile.changePage( "#ingresos", { transition: "slide", reverse: true});	
		  	
	    //alert(this.id); // id of clicked li by directly accessing DOMElement property
	    /*alert($(this).attr('id')); // jQuery's .attr() method, same but more verbose
	    alert($(this).html()); // gets innerHTML of clicked li
	    alert($(this).text()); // gets text contents of clicked li
	    */
	});
	
	//...............................................................................................			
	//EVENTO QUE CIEERA EL PANEL Y CARGA LOS DATOS EN EL FORM ESTADO DE CUENTAS
    $('#ListaCliente').on('click','li',function()
    {	
	   //$('#closepanel' ).click();
	   	//TABLAPAGO(this.id);
	});

	//...............................................................................................			
	//EVENTO QUE CIEERA EL PANEL Y CARGA LOS DATOS EN EL FORM INGRESO
    $('#ListaCliente1').on('click','li',function()
    {	
	   $('#closepanel1' ).click();
	   	TABLAPAGO(this.id);
	});	

	//...............................................................................................			
	//EVENTO QUE RECARGA LOS DATOS CON ENTER EN EL TEXT RECIBO
	$("#recibo").change(function()
	{	
		obj = this.value;

       	if (obj != '') 
       	{
	       	if (obj.length < 12) 
	       	{
	       		res= ceros(obj,12);
	       	}
	       	else
	       		res = obj;

	        clearform();
	        CONSULTAPAGO(res)
    	}
	});

	//...............................................................................................			
	//EVENTO QUE SALVA LOS DATOS EN EL FORM INGRESO
    $('#btnsalvaringreso').on('click',function()
    {	
		presta = $('#prestamo').val();
    	
    	if (presta != '') recogecheck();
	});
	

	//...............................................................................................			
	//EVENTO QUE LOS DATOS DEL FORM INGRESO CUANDO SE QUITA EL NO DE RECIVO
	$(document).on('click', '.ui-input-clear', function () 
	{	
	  var input = $(this).prev("input")[0].id;
	  if (input=='recibo') clearform();

	});

	//...............................................................................................			
	//EVENTO QUE CANCELA LOS DATOS EN EL FORM INGRESO
    $('#btncalcelingreso').on('click',function()
    {	
    	clearform();
	});



});


