
$(function() 
{
	//$SqlSrvCon = 'http://webserver1.no-ip.org/server/sqlsrv/sql.php';
	$SqlSrvCon = 'http://192.168.1.3/server/sqlsrv/sql.php';
	//$SqlSrvCon = 'http://localhost/server/sqlsrv/sql.php';
	//$SqlSrvCon = 'http://localhost/server/mysql/sql.php';
	//$SqlSrvCon = 'http://lyrstudios.com/apps/sql.php';

	//...............................................................................................		
	//VARIABLES GLOBALES
	var $serial  = '';  //guarda los datos serializados del fieldset
	var $asaldo  = 0;   //variable que controla el total a pagar
	var $tiempoC = 0;
	var ArrCheck = []; //array que guarda los datos de cada check pulsado
	var cAbonada = [];  //array que guarga los datos de la cuota abonada por si hay que retrocederla
	var $zona    = '';
	//var $zona    = '001';
	var $intentos = 0; //variable qeu controla los intentos de la tecla astras  para alir del sistema



	$("#log").on('click',function(){
       bluetoothSerial.list(function(devices) {
            devices.forEach(function(device) {
                var data = "something \r\n";
                alert(device.address);
                bluetoothSerial.connect(device.address, connectSuccess, connectFailure);
                bluetoothSerial.write(data, success, failure);
            })
        }, connectFailure);
	});


	document.addEventListener("backbutton", function(e)
	{
		ruta= $(location).attr('hash');
		if ($.trim(ruta) == '') 
        {
            e.preventDefault();  $intentos += 1;
		    if ($intentos==2) 
		    { 
				var r = confirm("Desea Salir de la Aplicación!"); if (r == true) { navigator.app.exitApp() } else { $intentos= 0; }
			}
		}
		else if ($.trim(ruta) == '#menu') 
 		{
			e.preventDefault();
		}
		else 
		{
		 	navigator.app.backHistory(); $intentos= 0;
		}
	}, false);	


	//...............................................................................................		
	//FUNCION QUE EXTRAE LA FACHA ACTUAL
	$("#etfechafin").val(factual());
	function factual()
	{
		
		var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1; //January is 0!

	    var yyyy = today.getFullYear();
	    if(dd<10){
	        dd='0'+dd
	    } 
	    if(mm<10){
	        mm='0'+mm
	    } 
	    var today = yyyy+'-'+mm+'-'+dd;
	    return today;
    } 

	//...............................................................................................		
	//FUNCION QUE RELLENA DE CEROS LOS CAMPOS
	function ceros(numero,ceros) 
	{	
		dif = ceros - numero.length; insertar=0; 

		for(m=1; m < dif; m++)
		{ 		  
		  insertar += '0';
		} 			
	  	return insertar += numero; 
	}

	//FUNCION QUE QUITA LA COMA A LOS TOTALES
	function quitcoma_num(valor)
	{	
	    var busca = ","; var reemplaza = ""; 
	    while (valor.toString().indexOf(busca) != -1)
	    	valor = valor.toString().replace(busca,reemplaza);
	  	return valor;
	}

	//...............................................................................................		
	//FUNCION QUE DA FORMATO A LOS TOTALES
    function format_num(valor){ var nuevo_numero = new oNumero(valor); return nuevo_numero.formato(2, true); }
    
    function oNumero(numero)
    {	
    	//Propiedades 
        this.valor = numero || 0
        this.dec = -1;
 
        //Métodos 
    	this.formato = numFormat; this.ponValor = ponValor;
 
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
            		if (dec <= 0) {
                  		cad = cad.replace(/\./,'');
               		}
            	}
        	}
        return cad;
      	}
    }//Fin del objeto oNumero:

	//...............................................................................................		
	//FUNCION QUE SALTA DENTRE LOS INPUT
	$('input, button, select, a').keyup(function(e) 
	{	
		if (e.keyCode == 13) 
		{ 
			val=0; obj= (this.id); tb= parseInt($(this).attr("tabindex"));
			if (obj=='usuario' && $(this).val()=='') val=1;
			if (obj=='password' && $(this).val()=='') val=1;
		  	if (val==0){ $('[tabindex='+(tb+1)+']').focus(); };
	  	}	
    });

	//...............................................................................................	
	//EVENTO QUE HACE LOGIN AL USUARIO		
	$('#loginbtn').on('click focus',function()
	{	
	    try
	    {
			var us= $.trim($("#usuario").val());
			var ps= $.trim($("#password").val());

			if (us==''){ $("#usuario").focus();
			} 
			else if(ps==''){ $("#password").focus();
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
							LbMenu = $.trim(res[1]); $zona  = $.trim(res[2]);

							$.mobile.changePage( "#menu", { transition: "slide", reverse: true});
							$("#labelusuario").html('<b>'+LbMenu+'</b>');
							//$('#menu').trigger("refresh");
						}
						else if(res[0]==0){ alert("Usuario o Password incorrectos"); $("#usuario").focus();					
						}
						else
							alert(res);
				    }
		    	});
		 	}
	    }
	    catch(ex){ alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }	
	})

	//...............................................................................................
	//EVENTO QUE BUSCA LOS CLIENTES PENDIENTES
	$('.btnCpendiente').on('click',function()
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
	                        lista += '<a href="#" >';
	                        lista += '<b class="btnoff">'+value[1]+'#</b>';
	                        lista += '<h2>'+value[2]+'<b class="btnoff">#</b>'+'</h2>';
	                        lista += '<p><b>'+value[5]+'<b class="btnoff">#</b>'+'</b></p>';
	                        lista += '<p>'+value[3]+'<b class="btnoff">#</b>'+'</p>';
	                        lista += '<b class="btnoff">'+value[4]+'</b>';
	                        lista += '<span class="ui-li-count ui-body-inherit">'+value[6]+'</span>';
	                        lista += '</a>';
	                        lista += '</li>';
		                }); 
		                $("#ListaDatos").html(lista);  $("#ListaDatos").listview().listview('refresh');
					}					
			    }
	    	});
	    }
	    catch(ex){ alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }
	});

	//...............................................................................................	
	//EVENTO QUE BUSCA LOS CLIENTES DEL PROMOTOR PARA INGRESOS Y ESTADO DE CUENTA
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
	        {
	        	nPanel='ListaCliente';
	        }

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
					//alert(res); return; 
					
					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						$("#"+nPanel).html(null); alert('No hay registros para esta consulta.');
					} 
					else if ($.trim(res[0][0]) == 1) //SI ES 1 ES UN ERROR
					{
 						$("#"+nPanel).html(null); alert(res);
					}
					else
					{
						var lista = " ";
						$("#"+nPanel).html(null); 
		                $.each( res, function( key, value ) 
		                {
	                        lista += '<li id="'+value[0]+'" name="'+value[0]+'">';                        
	                        lista += '<a href="#" >';
	                        lista += '<b class="btnoff">'+value[1]+'#</b>';
	                        lista += '<h2>'+value[2]+'<b class="btnoff">#</b>'+'</h2>';
	                        lista += '<p><b>'+value[5]+'<b class="btnoff">#</b>'+'</b></p>';
	                        lista += '<p>'+value[3]+'<b class="btnoff">#</b>'+'</p>';
	                        lista += '<b class="btnoff">'+value[4]+'</b>';
	                        lista += '</a>';
	                        lista += '</li>';
		                }); 

		                $("#"+nPanel).html(lista);  $("#"+nPanel).listview().listview('refresh');
					}					
			    }
	    	});
	    }
	    catch(ex){ alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }
	});

	//...............................................................................................			
	//EVENTO QUE CIEERA EL PANEL Y CARGA LOS DATOS EN EL FORM ESTADO DE CUENTAS
    $('#ListaCliente').on('click','li',function()
    {   
    	datos = ''; id= (this.id);
	    datos = $("#"+id).text();  datos = datos.split('#');
	    $('#closepanel').click();   	
        $('#etcliente').  val(datos[0]);
    	$('#etclientedesc').val(datos[1]+', '+datos[3]+', '+datos[4]);

	});
	
	//...............................................................................................			
	//EVENTO QUE VALIDA EL CAMBPO RPESTAMO
	$("#etprestamo").change(function() { etprest(this.value); });

	function etprest(val)
	{	
		if (val.length > 8) { alert('Número debe ser de 8 digitos'); $("#etprestamo").val(null);
		}
		else if ( parseInt(val) == 0 ) { $("#etprestamo").val(null);
		}
		else if ( parseInt(val) > 0 ) $("#etprestamo").val(ceros(val,8));
	}

	//...............................................................................................	
	//EVENTO QUE BUSCA EL ESTADO DE CUENTA DE UN CLIENTE
	$('#etproces').on('click',function()
	{	
	    try
	    {
			cliente= $("#etcliente").val();
	    	if (cliente=='') { alert('Busque el cliente primero.'); $("#bqdcl").click(); return};

	    	arrEtc = [];
	    	cliente= $('#etcliente').val(); prestamo= $('#etprestamo').val();
	    	fecha1= $('#etfechaini').val(); fecha1= fecha1.split('-'); fecha1= (fecha1[0]+fecha1[1]+fecha1[2]);
	    	fecha2= $('#etfechafin').val(); fecha2= fecha2.split('-'); fecha2= (fecha2[0]+fecha2[1]+fecha2[2]);
	    	
	    	arrEtc= [cliente,prestamo,fecha1,fecha2];
	        $.mobile.loading('show',"b", "Cargando...");
			$.ajax({
				url: $SqlSrvCon,
                data: {fl:"cargaestado", var1: arrEtc} ,
  			    dataType: 'JSON',
                type: "POST",
				async: true,
			    success: function (res) 
			    {  		
			    	$.mobile.loading( "hide" );
					//alert(res[0]); return;
					var lista= "";
					$("#tbetc").html(null);					
					var $B= 0; sD= 0; sC= 0; 
					for (var i = 0, len = res[0].length; i <= len; i++) 
					{ 
	                    var clas='class="coltrI"'; 
					  	if (i==0) 
					  	{
					  		$DB = 0;
					  		$CR = 0;  
					  		$DB = parseFloat(res[1][1]);
					  		$CR = parseFloat(res[1][2]);
							$B += ($DB - $CR) ; 
						   	sD += $B; 
		                    lista += '<tr>';  
		                    lista += '<th>'+res[1][0]+'</th>';
		                    lista += '<td><a data-rel="external">BALANCE</a></td>';
		                    lista += '<td></td>';
		                    lista += '<td><b class="bcheck">'+format_num($B)+'</b></td>';//debito
		                    lista += '<td><b class="bcheck">'+format_num(parseInt(0))+'</b></td>';//credito
		                    lista += '<td><b class="bcheck">'+format_num(parseFloat($B))+'</b></td>';                 
		                    lista += '</tr>';
					  	}
					  	else
					  	{
							ii=(i-1);
	                   		var cnttipo= res[0][ii][0];
	                    	if (cnttipo !=0 ) { clas='class="coltrP"'; }

							$CR = 0;  
						  	$DB = 0;
		                    lista += '<tr '+clas+'>';  
		                    lista += '<th>'+res[0][ii][1]+'</th>';
		                    lista += '<td><a data-rel="external">'+res[0][ii][2]+'</a></td>';
		                    lista += '<td>'+res[0][ii][3]+'</td>';

		                    if (cnttipo == 0) 
		                    {
							    $CR = parseFloat(res[0][ii][4]); sC += $CR;
			                    lista += '<td><b class="bcheck">'+format_num(parseInt(0))+'</b></td>';//debito
			                    lista += '<td><b class="bcheck">'+format_num($CR)+'</b></td>';//credito
			                }
			                else
			                {
			                    $DB = parseFloat(res[0][ii][4]); sD += $DB;
			                    lista += '<td><b class="bcheck">'+format_num($DB)+'</b></td>';//debito
			                    lista += '<td><b class="bcheck">'+format_num(parseInt(0))+'</b></td>';//credito
			                };  
				   			$B += ($DB - $CR) ; 	
		                    lista += '<td><b class="bcheck">'+format_num(parseFloat($B))+'</b></td>';                 
		                    lista += '</tr>';
						}
					}
					$("#tbetc").append(lista); $("#tbetc").trigger("create"); $("#ettable").table("refresh");
					$("#etdebito").val(format_num(sD));
					$("#etcredito").val(format_num(sC));
					$("#etbalancee").val(format_num($B));
					$("#etbalancep").val(format_num(res[0][0][5]));					
			    }
	    	});
	    }
	    catch(ex) { alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }
	});

	//...............................................................................................	
	//EVENTO QUE CANCELA EL FORM ESTADO DE CUENTA DE UN CLIENTE
	$('#etcancel').on('click',function(){
		$("#tbetc").empty(); $("#frmestadocuentas")[0].reset(); $("#etfechafin").val(factual());
	});

	//...............................................................................................			
	//EVENTO QUE CIEERA EL PANEL Y CARGA LOS DATOS EN EL FORM INGRESO
    $('#ListaCliente1').on('click','li',function() { $('#closepanel1' ).click(); TABLAPAGO(this.id); });	

	//...............................................................................................	
	//FUNCION QUE CARGA TABLA DEL CLIENTE PARA HACER PAGOS
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
 						clearform(); alert('No hay registros para esta consulta.');
					} 
					else if ($.trim(res[0][0]) == 1) //SI ES 1 ES UN ERROR
					{
 						clearform(); alert(res);
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

		                $('.abonos').css('display', 'block');

						//LLENA EL GRID CHECK CON LA CONSULTA
						//var fset      = '<fieldset data-role="controlgroup" data-type="vertical" id="ListaCuotas">';
						var	fset     = '<legend>CUOTAS DEL CIENTE:</legend>';
						//var fsetclose = '</fieldset>';	
						var lista     = "";
						for (var i = 0, ilen = res.length; i < ilen; i++) 
						{
	                        lista += '<input type="checkbox" name="'+$.trim(res[i][5])+'" id="'+$.trim(res[i][5])+'" >';                        
	                        lista += '<label for="'+$.trim(res[i][5])+'" >';
	                        lista += 'CUOTA :<b class="bcheck" ><b class="btnoff">#</b>'+$.trim(res[i][5])+'<b class="btnoff">#</b></b><br>';
	                        lista += 'FECHA :<b class="bcheck" ><b class="btnoff">#</b>'+$.trim(res[i][6])+'<b class="btnoff">#</b></b><br>';
	                        lista += 'MONTO :<b class="bcheck" ><b class="btnoff">#</b>'+format_num(res[i][7])+'<b class="btnoff">#</b></b><br>';	                    
	                        lista += 'BALANCE :<b class="bcheck" ><b class="btnoff">#</b>'+format_num(res[i][8])+'<b class="btnoff">#</b></b><br>';	                    
	                        
	                        if (parseFloat(res[i][9]) > 0) //si tieene mora cambia el color
	                        	{ 
			                        lista += 'MORA :<b class="bcheckb" > <b class="btnoff">#</b>'+format_num(res[i][9])+'<b class="btnoff">#</b> </b><br>';
			                        lista += 'ABONO :<b class="bcheck"      id="Ab'+$.trim(res[i][5])+'" ><b class="btnoff">#</b>'+format_num(0)+'<b class="btnoff">#</b> </b><br>';
			                        lista += 'PENDIENTE :<b class="bcheckb" id="Pe'+$.trim(res[i][5])+'" ><b class="btnoff">#</b>'
			                        	  +   format_num( parseFloat(res[i][8])+parseFloat(res[i][9]) )+'</b>';
	                        	} else
	                        	{
			                        lista += 'MORA :<b class="bcheck" >  '+format_num(res[i][9])+'  </b><br> ';
			                        lista += 'ABONO :<b class="bcheck"      id="Ab'+$.trim(res[i][5])+'" ><b class="btnoff">#</b>'+format_num(0)+'<b class="btnoff">#</b></b><br>';
			                        lista += 'PENDIENTE :<b class="bcheck"  id="Pe'+$.trim(res[i][5])+'" ><b class="btnoff">#</b>'
			                              +   format_num(res[i][8])+'</b>';
	                        	};
	                        //lista += '<b class="">  <br>'+Math.round(parseFloat(res[i][10])+'</b>' ;
	                        lista += '<b class="btnoff" id="Ca'+$.trim(res[i][5])+'"><b class="btnoff">#</b><br>'+parseFloat(res[i][10])+'</b>';
	                        lista += '<b class="btnoff" id="In'+$.trim(res[i][5])+'"><b class="btnoff">#</b><br>'+parseFloat(res[i][11])+'</b>';
	                        lista += '<b class="btnoff" id="Co'+$.trim(res[i][5])+'"><b class="btnoff">#</b><br>'+parseFloat(res[i][12])+'</b>';
	                        lista += '</label>';
						}
		                //$("#cuotasaldar").html(fset+lista+fsetclose);
		                $("#ListaCuotas").html(fset+lista); $("#ListaCuotas").trigger("create");
					}					
			    }
	    	});
	    }
	    catch(ex) { alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }
	};

	//...............................................................................................			
	//EVENTO QUE RECARGA LOS DATOS CON ENTER EN EL TEXT RECIBO
	$("#recibo").change(function()
	{	
		obj = this.value;
       	if (obj != '') 
       	{
	       	if (obj.length < 12){ res= ceros(obj,12);
	       	}
	       	else
	       		res = obj; clearform(); CONSULTAPAGO(res)
    	}	
    	else
	       clearform();
	});
	
	//...............................................................................................	
	//FUNCION QUE CARGA 
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
 						clearform(); alert('No ha realizado pagos con este Número.');
					} 
					else if (($.trim(res[0][0]) == 1) && $.trim(res[0][0]).length < 10 ) //SI ES 1 ES UN ERROR
					{
 						clearform(); alert(res);
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
	                       
	                        abono= parseFloat(res[i][12]); mora= parseFloat(res[i][11]); pendiete= parseFloat(res[i][13]);

	                        lista += '<input disabled="" type="checkbox" name="'+$.trim(res[i][8])+'" id="'+$.trim(res[i][8])+'" >';                        
	                        lista += '<label  for="'+$.trim(res[i][8])+'" >';
	                        lista += 'CUOTA :<b class="bcheck" ><b class="btnoff">#</b>'+$.trim(res[i][8])+'<b class="btnoff">#</b></b><br>';
	                        lista += 'FECHA :<b class="bcheck" ><b class="btnoff">#</b>'+$.trim(res[i][9])+'<b class="btnoff">#</b></b><br>';
	                        lista += 'MONTO :<b class="bcheck" ><b class="btnoff">#</b>'+format_num(res[i][10])+'<b class="btnoff">#</b></b><br>';	                    
	                        lista += 'BALANCE :<b class="bcheck" ><b class="btnoff">#</b>'+format_num((abono-mora)+pendiete)+'<b class="btnoff">#</b></b><br>';	                    
	                        
	                        if (mora > 0) //si tieene mora cambia el color
	                        	{ 
	                        		lista += 'MORA :<b class="bcheckb" ><b class="btnoff">#</b>'+format_num(mora)+'<b class="btnoff">#</b></b><br> ';
			                        lista += 'ABONO :<b class="bcheck"><b class="btnoff">#</b>'+format_num(abono)+'<b class="btnoff">#</b></b><br> ';
			                        lista += 'PENDIENTE :<b class="bcheckb" ><b class="btnoff">#</b>'+format_num(pendiete)+'</b><br> ';			                      
	                        	} 
	                        	else
	                        	{
	                        		lista += 'MORA :<b class="bcheck" ><b class="btnoff">#</b>'+format_num(mora)+'<b class="btnoff">#</b></b><br> ';
			                        lista += 'ABONO :<b class="bcheck"><b class="btnoff">#</b>'+format_num(abono)+'<b class="btnoff">#</b></b><br> ';
			                        lista += 'PENDIENTE :<b class="bcheck" ><b class="btnoff">#</b>'+format_num(pendiete)+'</b>';	
	                      	};
	                        //lista += '<b class="">  <br>'+Math.round(parseFloat(res[i][10])+'</b>' ;
	                        lista += '</label>';
						}
		                //$("#cuotasaldar").html(fset+lista+fsetclose);
		                $("#ListaCuotas").html(fset+lista);  $("#ListaCuotas").trigger("create");
					}					
			    }
	    	});
	    }
	    catch(ex){ alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }
	};

	//...............................................................................................
	//FUNCION QUE MANEJA LOS ESTADOS DE LOS CHECK EN EL FORM INGRESO
	$(document).on('change', 'input[type="checkbox"]', function() 
	{	
		idcheck = []; idcheck[0] = (this.id); //captura el id del check pulsado

		$serial  = '';
	    $serial  = $("#ListaCuotas").serialize();  //obtiene los datos rerializados del fieldset
		$serial  = $serial.replace(/=|on/g, '');   //reemplaza los caracteres '=' y 'on' por espacio del conjunto serializado
		$serial  = ($serial.split("&"));          //elimina el caracter '&' y convierte la cadena en un array
		
		recogecheck (idcheck);
	});

	//...............................................................................................		
	//EVENTO QUE MANEJA EL IMPUTO PARA ABONOS
	$('.abonos').on('click', function(e)
	{	
		onoff = $("#onoff_abono").val();
		if (onoff=='on'){ $('#cAbono').css('display', 'block'); $('#ListaCuotas').addClass( "ui-state-disabled" );
		} 
		else{ $('#cAbono').css('display', 'none'); $('#ListaCuotas').removeClass( "ui-state-disabled" ); 
			$('#cAbono').val(null); Limpiacheck(); qAbono();
		};
	});

	//...............................................................................................			
	//EVENTO QUE REALIZA UN ABONO AUTOMATICO A LAS CUOTAS POR UNA CANTIDAD ESTABLECIDA
	$("#cAbono").on('change',function()
	{	
		Limpiacheck(); 
		abono = parseFloat(this.value); abonoT=0;

		if (abono <= 0) { alert('Valor invalido...'); this.value=null; return};

		cAbonar= []; recCheck= []; mAbono= ''; lbArr= ''; tAdeudado= 0; 

		var arr = $('input[type=checkbox]:not(:checked)').map(function(){return this.id}).get();
 		
 		for (var i = 0; i < arr.length; i++) 
 		{
	 		lbArr = $("label[for='"+arr[i]+"']"); lbArr = lbArr.text(); lbArr = lbArr.split("#"); tAdeudado = (tAdeudado + parseFloat(lbArr[13]));
		};
		
		if (abono > tAdeudado){ alert('El valor introducido sobrepasa el total adeudado le sobran '+format_num(abono-tAdeudado)+'.'); return };

 		for (var i = 0; i < arr.length; i++) 
 		{
	 		lbArr = $("label[for='"+arr[i]+"']"); lbArr = lbArr.text(); lbArr = lbArr.split("#"); cuota = parseFloat(lbArr[13]);

			if (abono >= cuota)
			{ 
				abono = (abono - cuota); cAbonar[i] = arr[i]; 

				$( "#"+arr[i]).prop( "checked", true ).checkboxradio( "refresh" ); //activa check cuando cumpla con la condicion
				//alert('pague '+cuota+' a la cuota no '+arr[i]);
			}
			else if (abono < cuota)
			{
				//alert('abone '+abono+' a la cuota no '+arr[i]);
			    cntlbcheck   = $("label[for='"+arr[i]+"']"); //captura todo el label del obj check
			    
			    label= cntlbcheck.text();
				label= label.split("#"); //divide la cadena cd vez que encuentra 2 espacios en blanco y convierte la cadena en un array
				cAbonada= label;
			
				mora= parseFloat(label[9]);	interes= parseFloat(label[15]);	comision= parseFloat(label[16]); capital= parseFloat(label[14]);	
				abonoT= abono;

				if (abono <= mora) { tabono= abono; tmora= mora; mora= (tmora-tabono); tb= (abono-tmora); if(tb<0){ abono=0;} else{ abono=tb;}
				} 
				else if (abono > mora) 
				{
					abono= (abono-mora); mora=0;

					if (abono <= interes) 
					{						
						tabono= abono; tinteres= interes; interes= (tinteres-tabono); tb= (abono-tinteres); if(tb<0){ abono=0;} else{ abono=tb;}
					} 
					else if (abono > interes) 
					{
						abono= (abono-interes); interes=0;
						
						if (abono <= comision) 
						{						
							tabono= abono; tcomision= comision; comision= (tcomision-tabono); tb= (abono-tcomision); if(tb<0){ abono=0;} else{ abono=tb;}
						} 
						else if (abono > comision) 
						{
							abono= (abono-comision); comision=0;

							if (abono <= capital) 
							{						
								tabono= abono; tcapital= capital; capital= (tcapital-tabono); tb= (abono-tcapital); if(tb<0){ abono=0;} else{ abono=tb;}
							} 
						} 
					} 
				}				
				pend= (parseFloat(label[13])-abonoT);
				
				$("#Ab"+arr[i]).html('<b class="btnoff">#</b>'+format_num(parseFloat(abonoT))+'<b class="btnoff">#</b>');
				$("#Pe"+arr[i]).html('<b class="btnoff">#</b>'+format_num(parseFloat(pend))+'<b class="btnoff">#</b>');

				$("#Ca"+arr[i]).html('<br>'+parseFloat(capital).toFixed(2).toString()+'  ');
				$("#In"+arr[i]).html('<br>'+parseFloat(interes)+'<b class="btnoff">#</b>');
				$("#Co"+arr[i]).html('<br>'+parseFloat(comision)+'<b class="btnoff">#</b>');
				break;
			} 
		}

		$serial  = ''; $serial= $("#ListaCuotas").serialize(); $serial= $serial.replace(/=|on/g, ''); $serial= ($serial.split("&"));         
		recogecheck($serial);

		if (!($.isNumeric($asaldo))) $asaldo=0;
		$asaldo = ($asaldo + abonoT); $('#totalp').val(format_num($asaldo));
			
		if (abonoT > 0) $( "#"+cAbonada[1]).prop( "checked", true ).checkboxradio( "refresh" );
		
		lconcept= $("#concepto").html();
		if (lconcept == "")
		{ 
			$("#concepto").html('ABONO #: '+cAbonada[1]+' DE '+$tiempoC+' CUOTAS');
		}
		else 
			$("#concepto").html('ABONO #: '+cAbonada[1]+'\n'+lconcept);
		
		cAbonar= []; recCheck= []; mAbono= ''; lbArr= ''; tAdeudado= 0; 
	});


	//...............................................................................................
	//FUNCION QUE RECORRE LOS CHECK APLICA CAMBIOS DE SELECCION 
	function recogecheck (arr) 
	{	
		for (var i = 0; i < arr.length; i++) 
		{
			idcheck =  arr[i];	
		    cntlbcheck   = $("label[for='"+idcheck+"']"); //captura todo el label del obj check
			elementcheck = ($('#'+idcheck).is(':checked') ? 1 : 0); //captura si el check esta activo o no
		    
		    label= cntlbcheck.text();
			//label = label.split("  "); //divide la cadena cd vez que encuentra 2 espacios en blanco y convierte la cadena en un array
			label = label.split("#"); //divide la cadena cd vez que encuentra 2 espacios en blanco y convierte la cadena en un array

			if (elementcheck == 1) //si el elemento check esta activo
			{  
				$asaldo = ($asaldo + parseInt(label[13]));
				
				$('#totalp').val(format_num($asaldo));
				$("#Ab"+idcheck).html('<b class="btnoff">#</b>'+format_num(label[13])+'<b class="btnoff">#</b>');
				$("#Pe"+idcheck).html('<b class="btnoff">#</b>'+format_num(0)+'<b class="btnoff">#</b>');

				$("#Ca"+idcheck).html('<br>00'+label[14]+'<b class="btnoff">#</b>');
				$("#In"+idcheck).html('<br>00'+label[15]+'<b class="btnoff">#</b>');
				$("#Co"+idcheck).html('<br>00'+label[16]+'<b class="btnoff">#</b>');

			} 
			else  
			{
				$asaldo = ($asaldo - parseInt(label[11]));

				$('#totalp').val(format_num($asaldo));
				$("#Ab"+idcheck).html('<b class="btnoff">#</b>'+format_num(0)+'<b class="btnoff">#</b>');
				$("#Pe"+idcheck).html('<b class="btnoff">#</b>'+format_num(label[11])+'<b class="btnoff">#</b>');

				$("#Ca"+idcheck).html('<br>'+parseFloat(label[14])+'<b class="btnoff">#</b>');
				$("#In"+idcheck).html('<br>'+parseFloat(label[15])+'<b class="btnoff">#</b>');
				$("#Co"+idcheck).html('<br>'+parseFloat(label[16])+'<b class="btnoff">#</b>');

			}	
			//concepto= arr.join(', '); 
			if ($serial !='') //si la variable serial tiene datos
			{
				$("#concepto").html('SALDO #: '+$serial+' DE '+$tiempoC+' CUOTAS');
			}
			else 
				$("#concepto").html(null);

		};
	}

	//...............................................................................................			
	//FUNCION QUE LIMPIA LOS CHECK PARA REAGRUPARLOS
	function Limpiacheck() { $( "input[type='checkbox']" ).prop( "checked", false ).checkboxradio( "refresh" ); 
		 recogecheck($serial); $serial= ''; qAbono(); $("#concepto").html(null);
	}
	
	//...............................................................................................			
	//FUNCION QUE RESETEA EL CHEK QUE TENGA ABONO
	function qAbono() 
	{	
		if (cAbonada.length > 0) 
		{
			lcheck= $("label[for='"+cAbonada[1]+"']"); lcheck= lcheck.text(); lcheck = lcheck.split("#");
			
			if (!($.isNumeric($asaldo))) $asaldo=0;
			if ($asaldo > 0){ $asaldo= ($asaldo - parseFloat(lcheck[11])); $('#totalp').val(format_num($asaldo)); } 
			
			$("#Ab"+cAbonada[1]).html('<b class="btnoff">#</b>'+format_num(0)+'<b class="btnoff">#</b>');
			$("#Pe"+cAbonada[1]).html('<b class="btnoff">#</b>'+format_num(cAbonada[13])+'<b class="btnoff">#</b>');

			$("#Ca"+cAbonada[1]).html('<br>'+cAbonada[14]+'<b class="btnoff">#</b>');
			$("#In"+cAbonada[1]).html('<br>'+cAbonada[15]+'<b class="btnoff">#</b>');
			$("#Co"+cAbonada[1]).html('<br>'+cAbonada[16]+'<b class="btnoff">#</b>');

			cAbonada=[];
		};
	}

	//...............................................................................................			
	//EVENTO QUE SALVA LOS DATOS EN EL FORM INGRESO
    $('#btnsalvaringreso').on('click',function()
    {	
		presta = $('#prestamo').val();	if (presta != '') salvarIngreso();
	});

	//...............................................................................................
	//FUNCION QUE RECORRE LOS CHECK Y LOS ALMACENA EN UN ARRAY 
	ArrCxcdet1 = [];
	ArrCxcMenc = [];
	function salvarIngreso() 
	{	
		if (cAbonada != '' )
		{ 
			if ($serial != ''){ $serial.push(cAbonada[1]);
			}
			else
				$serial[0]=cAbonada[1];
		}

		ArrCxcMenc   = []; //array que guarda los datos a salvar en cxcmovi1_Ingreso
		ArrCxcdet1   = []; //array que guarda los datos a salvar en cxcdetalle1
 		T_capitalC   = 0; T_interesC= 0; T_comisionC= 0; T_moraC= 0; monto_cuota = 0;

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
		cliente = $.trim(arcliente[0]); descuen1 = 0; seguro = 0;  comprobante=''


 		for (var i = 0; i < $serial.length; i++) {

	 		lbchID = $("label[for='"+$serial[i]+"']");
			lbArr = lbchID.text();
			lbArr = lbArr.split("  ");	
			arfechacuota= lbArr[3]; arfechacuota  = arfechacuota.split("-");

			Cac= lbArr[14].substring(0,2); Inc= lbArr[15].substring(0,2); Coc= lbArr[16].substring(0,2);

			if (Cac=='00'){ Cac=0; }else{ Cac= lbArr[14]; } if (Inc=='00'){ Inc=0; }else{ Inc= lbArr[15]; }  
			if (Coc=='00'){ Coc=0; }else{ Coc= lbArr[16]; }  
		
			Num_cuota = lbArr[1]; fecha_cuota= (arfechacuota[2]+arfechacuota[1]+arfechacuota[0]); monto_cuota = lbArr[5];
			abono_cuota = lbArr[11]; mora_cuota = parseFloat(lbArr[9]); capital_cuota = parseFloat(Cac); 
			interes_cuota = parseFloat(Inc); comision_cuota = parseFloat(Coc); pendiente_cuota = parseFloat(lbArr[13]);

	 		T_capitalC  = T_capitalC + capital_cuota; 
	 		T_interesC  = T_interesC + interes_cuota;
	 		T_comisionC = T_comisionC + comision_cuota;
	 		T_moraC     = T_moraC + mora_cuota;
			
			//alert(lbArr)
			ArrCxcdet1[i] = [fecha, tipomovi, tipomovi1, tipo, cliente, Num_cuota, fecha_cuota, monto_cuota, 
								abono_cuota, descuen1, pendiente_cuota, mora_cuota, capital_cuota, interes_cuota, 
									comision_cuota, seguro, fecha_cuota];
 		}
		

			ArrCxcMenc = [fecha, tipomovi, tipo, cliente, nPrestamo, movimiento, concepto, Tipocredito, vendedor, fecha, 
							fecha, descuen, T_capitalC, posteo, nombre, zona, dire, tele, ciudad, clasifica, 
								Efectivo, tarjeta, cheque, descrip1, descrip2, conbal, provincia, tasa1, tasa2, monto_cuota, 
									T_capitalC, T_interesC, T_comisionC, traspaso, T_moraC, seguro, comprobante, tipoingreso, rene, turno, 
										cajero, secuencia];
		//alert(ArrCxcdet1); //return
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
			    	//alert(res);return
					if ($.trim(res[0][0]) == 0) //SI ES 0 NO TRAJO REGISTROS
					{
 						clearform(); alert("RECIBO No. "+res[1]+" Aplicado\n Correctamente...");
					} 
					else if ( ($.trim(res[0][0]) == 1) || ($.trim(res[0][0]) == 2) || 
							  ($.trim(res[0][0]) == 3) || ($.trim(res[0][0]) == 4) ) //SI ES 1 ES UN ERROR
					{
						alert(res);
					}
				}
			});	
	    }
	    catch(ex){ alert("Error al cargar los datos ajax!!"); $.mobile.loading( "hide" ); }	
	};

	//...............................................................................................			
	//FUNCION QUE LIMPIA EL FORMULARIO
	function clearform() 
	{	
		$("#ListaCuotas").html(null); $("#concepto").html(null);  $('#printrecibo').css('visibility', 'hidden');
		$('#btnsalvaringreso').removeClass( "ui-state-disabled" ); 	
		$("#frmingreso")[0].reset();$('.abonos').css('display', 'none');$('#cAbono').css('display', 'none');
	}

	//...............................................................................................		
	//EVENTO QUE MUEVE LA PAGINA Y CARGA LOS DATOS EN EL FORM INGRESO
    $('#ListaDatos').on('click','li',function()
    {	
		TABLAPAGO(this.id); $.mobile.changePage( "#ingresos", { transition: "slide", reverse: true});	
	});
	
	//...............................................................................................			
	//EVENTO QUE LOS DATOS DEL FORM INGRESO CUANDO SE QUITA EL NO DE RECIVO
	$(document).on('click', '.ui-input-clear', function () 
	{	
	  var input = $(this).prev("input")[0].id; if (input=='recibo') clearform();
	});

	//...............................................................................................			
	//EVENTO QUE CANCELA LOS DATOS EN EL FORM INGRESO
    $('#btncalcelingreso').on('click',function(){ clearform(); });

//alert('me actualice')
});