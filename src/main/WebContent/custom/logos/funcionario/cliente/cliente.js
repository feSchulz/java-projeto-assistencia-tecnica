logos.cliente = new Object();

$(document).ready(function(){
	
	logos.cliente.estado=function(id){				
		var estados = null;		
		
		var cfg={
				
				url:"../rest/enderecorest/buscarEstado/"+estados,				
				success:function(listaEstados){					
					var html="<option value ='Estado'>Estados</option>";
					
					if(listaEstados!= undefined && listaEstados.length>0){
											
						for(var i=0; i<listaEstados.length; i++){						
							html+="<option value='"+listaEstados[i].id+"'>"+listaEstados[i].estado+"</option>";						
						};					
					};
					
					if(isObject(id)){
						
						$('#idEstado').html(html);						
						$('#idEstado').val(id.idestado);						
						logos.cliente.buscarCidade(id);
						
					}else{
						
						$('#inserirCliente').find('input,select').prop('disabled', false);
						$(".atualizar").hide();
						$(".inserir").show();
						
						$('#idEstado').html(html);					  
						$("#inserirCliente").modal("show");
					
					}					
				},
				error:function(err){					
					msgErro(err);			
				}
	};	
		 
		logos.ajax.Get(cfg);	
		
	}// fim da função estados.
	
logos.cliente.buscarCidade = function(idEstado){
	
		if(isObject(idEstado)){			
			var id=idEstado.idestado;	
			
		}else{ 
			var id=idEstado;
		};
			
		var html="<option value='cidade'>Cidade</option>";
	
			var cfg={					
					 url:"../rest/enderecorest/buscarCidade/"+id,				
					 success:function(listaCidade){
						 
						 if(listaCidade!= undefined && listaCidade.length>0){								
								
							 for(var i=0; i<listaCidade.length; i++){
								
									html+="<option value='"+listaCidade[i].id+"'>"+listaCidade[i].cidade+"</option>";						
								};
								
								if(isObject(idEstado)){
									
									$('#idCidade').html(html);
									$('#idCidade').val(idEstado.idcidade); 
									
								}else{									
									$('#idCidade').html(html);
								};							
						 }; 
					 },
					error:function(err){					
						msgErro(err);							
					}					
			};
			
			logos.ajax.Get(cfg);		

};	// fim da função mostrarCidade 

logos.cliente.validaForm =function(){
	
	var msg="";
	var cliente = new Object();	
	var endereco = new Object();
	
	cliente.nome= $("#nome").val();
	cliente.telefone = $("#tell").val();
	endereco.complemento = $("#complemento").val();	
	
	cliente.cpf=$("#cpf").val();
	endereco.rua=$("#rua").val();
	
	endereco.bairro=$("#bairro").val();
	endereco.cidadeId = $("#idCidade").val();
	cliente.email = $("#email").val();
	
	endereco.numero = $("#numero").val();
	endereco.cep=$("#cep").val();
	
	// validando as informações
	
	if(cliente.nome == "" || cliente.nome == "null"){
		msg+="Digite um nome.\n";
	};	
	
	if (!cliente.nome.length>3){
		msg+="Número minimo de caracteres para um nome é 3.\n";
	};		
	
	if(cliente.cpf =="" || cliente.cpf == null){
		msg+="Digite um CPF.\n";		
	};
	
	if(!cliente.cpf.length==11){
		msg+="O CPF deve conter 11 digitos.\n";
	
	}else{	
		cliente.cpf=cliente.cpf.replace(/\D/g, '');
	};
			
	if(cliente.email.indexOf("@") == -1||cliente.email.indexOf(".") == -1 || cliente.email == ""){
		msg+="Insira um e-mail valido.\n";			
	};
	
	if(!cliente.telefone.length==11 || !cliente.telefone.length==10 ){
		
		msg+="Insira um telefone valido.\n";
		
	}else{
		
		cliente.telefone=cliente.telefone.replace(/\D/g, '');
	};		
	
	if(endereco.rua=="" || endereco.rua == "null"){
		msg+="Digite uma rua.\n";
	};	
	
	if (!endereco.rua.length>3){
		msg+="Número minimo de caracteres para uma rua é 3.\n";
	};
	
	if(endereco.numero == "" || endereco.numero == "null"){
		msg+="Digite um número.\n";
	};		

	if(endereco.bairro == "" || endereco.bairro == "null"){
		msg+="Digite um bairro.\n";
	};	
	
	if (!endereco.bairro.length>3){
		msg+="Número minimo de caracteres para um bairro é 3.\n";
	};	
	
	if(endereco.cidadeId == ""||endereco.cidadeId == "cidade"){
		msg+="Escolha uma cidade.\n";
	};
	
	if(!endereco.cep.length==8){
		msg+="O CEP deve conter 08 digitos.\n";
	}else{
		endereco.cep=endereco.cep.replace(/\D/g, '');
	};		
	
	if(msg === "" ){
		
		cliente.endereco=endereco;	
		
		var cfg={
				 url:"../rest/clienterest/inserir",
				 data:cliente, 
				 success:function(msg){
					 msgSucesso(msg);
					 $("#inserirCliente").modal("hide");
					 
					 var busca="";
					 logos.cliente.exibir(undefined,busca);
					 
				 },
				 error:function(err){					
						msgErro(err);							
				}				
		};
		
		logos.ajax.Post(cfg);
					
	}else{
		msgErro(msg)
	};
	
	
} // fim da função validaForm

logos.cliente.exibir=function(listacliente,busca){
		
		var html="<table id='idtableEdit' class='tableFunci table table-lg table-bordered'><thead class='thead-dark'><tr><th scope='col'>Nome</th>"
			+"<th scope='col'>Telefone</th><th scope='col'>E-mail</th><th scope='col'>Ações</th></tr></thead><tbody>";		
	
		if(listacliente != undefined && listacliente.length>0){			
			
			for(var i=0; i<listacliente.length; i++ ){	
				
				html+="<tr><td>"+listacliente[i].nome+"</td><td>"+listacliente[i].telefone+"</td><td>"
								+listacliente[i].email+"</td><td><a class='link' onclick='logos.cliente.editar("
								+listacliente[i].id+")'><i class='fas fa-pencil-alt'></i></a><a class='link' onclick='logos.cliente.visualizar("
								+listacliente[i].id+")'><i id='imgVisualiza' class='far fa-eye'></i></a><a class='link' onclick='logos.cliente.abrirOS("
								+listacliente[i].id+")'><i class='fas fa-sticky-note'></i></a><a class='link' onclick='logos.cliente.modalDel("
								+listacliente[i].id+")'><i class='fas fa-trash'></i></a></td></tr>";	
			};	// falta o favicons do criar modal
			
		}else{		
		
			if(listacliente == undefined){	
			
				if(busca==""){
					busca = null;
				};
			
				var cfg ={
						
						url:"../rest/clienterest/buscar/"+busca,						
						success:function(lista){
							

							logos.cliente.exibir(lista);	
						},
						error:function(err){							
							msgErro(err);							
						}
				};
			
				logos.ajax.Get(cfg);
		 
			}else{				
				html+="<tr><td colspan='5' style='font-weight:bold'>Nenhum Resultado encontrado</td></tr>";
			};			
		};
		
		html+="</tbody></table>";					
		$('#gridCliente').html(html);
		
		if(listacliente != undefined && listacliente.length>11){			
			
			$('.table tbody').paginathing({
			    perPage:11, 
			    limitPagination:2,			  
			    containerClass:'panel-footer',
			    insertAfter:'.table',
			    prevText:'&laquo;',			   
			    nextText:'&raquo;',			    
			    firstText:'Primeiro',			    
			    lastText:'Último',
			});
		};
	
} // fim da função 

logos.cliente.editar= function(Id){
	
	$('#inserirCliente').find('input,select').prop('disabled', false);
	
		var cfg ={			
		url:"../rest/clienterest/buscarID/"+Id,						
		success:function(cliente){
			
			var idcidade = cliente.endereco.cidadeId;			
			logos.cliente.editSelect(idcidade);
			
			$("#nome").val(cliente.nome);
			$("#tell").val(cliente.telefone);
			$("#complemento").val(cliente.endereco.complemento);	
			$("#idEndereco").val(cliente.idEndereco);
			$("#cpf").val(cliente.cpf);
			$("#rua").val(cliente.endereco.rua);			
			$("#bairro").val(cliente.endereco.bairro);			
		
			$("#email").val(cliente.email);			
		    $("#numero").val(cliente.endereco.numero);
			$("#cep").val(cliente.endereco.cep);
			
			$("#inserirCliente").modal("show");
			
			},
			error:function(err){							
				msgErro(err);							
			}
	};

	logos.ajax.Get(cfg);
	
}	// fim da função busca...

logos.cliente.editSelect=function(idCidade){
	
	$(".atualizar").show();
	$(".inserir").hide();
	
	var cfg ={			
			url:"../rest/enderecorest/buscarEstadoID/"+idCidade,				
			 success:function(idestado){	 
				
				 var estado=new Object();
				 
					 estado.idcidade=idCidade;
					 estado.idestado=idestado.id;				
					 
				 logos.cliente.estado(estado);						
			
				},
				error:function(err){							
					msgErro(err);							
				}
		};
	
	logos.ajax.Get(cfg);
	
}// fim da função editSelect

logos.cliente.visualizar=function(id){
		
	logos.cliente.editar(id);
	$('#inserirCliente').find('input,select').prop('disabled', true);	
};// fim da função visualizar


logos.cliente.validaUpdate=function(id){
	
	var msg="";
	var cliente = new Object();	
	var endereco = new Object();
	cliente
	cliente.nome= $("#nome").val();
	cliente.telefone = $("#tell").val();
	endereco.complemento = $("#complemento").val();	
	cliente.idEndereco=$("#idEndereco").val();
	cliente.cpf=$("#cpf").val();
	endereco.rua=$("#rua").val();
	
	endereco.bairro=$("#bairro").val();
	endereco.cidadeId = $("#idCidade").val();
	cliente.email = $("#email").val();
	
	endereco.numero = $("#numero").val();
	endereco.cep=$("#cep").val();
	
	// validando as informações
	
	if(cliente.nome == "" || cliente.nome == "null"){
		msg+="Digite um nome.\n";
	};	
	
	if (!cliente.nome.length>3){
		msg+="Número minimo de caracteres para um nome é 3.\n";
	};		
	
	if(cliente.cpf =="" || cliente.cpf == null){
		msg+="Digite um CPF.\n";		
	};
	
	if(!cliente.cpf.length==11){
		msg+="O CPF deve conter 11 digitos.\n";
	
	}else{	
		cliente.cpf=cliente.cpf.replace(/\D/g, '');
	};
			
	if(cliente.email.indexOf("@") == -1||cliente.email.indexOf(".") == -1 || cliente.email == ""){
		msg+="Insira um e-mail valido.\n";			
	};
	
	if(!cliente.telefone.length==11 || !cliente.telefone.length==10 ){
		
		msg+="Insira um telefone valido.\n";
		
	}else{
		
		cliente.telefone=cliente.telefone.replace(/\D/g, '');
	};		
	
	if(endereco.rua=="" || endereco.rua == "null"){
		msg+="Digite uma rua.\n";
	};	
	
	if (!endereco.rua.length>3){
		msg+="Número minimo de caracteres para uma rua é 3.\n";
	};
	
	if(endereco.numero == "" || endereco.numero == "null"){
		msg+="Digite um número.\n";
	};		

	if(endereco.bairro == "" || endereco.bairro == "null"){
		msg+="Digite um bairro.\n";
	};	
	
	if (!endereco.bairro.length>3){
		msg+="Número minimo de caracteres para um bairro é 3.\n";
	};	
	
	if(endereco.cidadeId == ""||endereco.cidadeId == "cidade"){
		msg+="Escolha uma cidade.\n";
	};
	
	if(!endereco.cep.length==8){
		msg+="O CEP deve conter 08 digitos.\n";
	}else{
		endereco.cep=endereco.cep.replace(/\D/g, '');
	};		
	
	if(msg === "" ){
		
		cliente.endereco=endereco;
		
		var cfg={
				 url:"../rest/clienterest/atualizar",
				 data:cliente, 
				 success:function(msg){
					 msgSucesso(msg);
					 $("#inserirCliente").modal("hide");
					 
					 var busca="";
					 logos.cliente.exibir(undefined,busca);
					 
				 },
				 error:function(err){					
						msgErro(err);							
				}				
		};
		
		logos.ajax.Put(cfg);
					
	}else{
		msgErro(msg)
	};	
}

var busca="";
logos.cliente.exibir(undefined,busca);

});
