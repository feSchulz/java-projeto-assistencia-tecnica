logos.funcionario= new Object();

	$('#cpf').mask('000.000.000-00', {reverse: true});
	$('#cep').mask('00000-000');
	$('#tell').mask('0000-0000');

$(document).ready(function() {
	  	
	logos.funcionario.validaForm=function(){		
		
		var msg="";	
		
		var funcionario=new Object();
		var endereco=new Object();
		
		funcionario.nome = $("#nome").val();
		funcionario.cpf = $("#cpf").val();
		funcionario.login= $("#loginFunc").val();
		funcionario.senha= $("#senhaFunc").val(); 
		funcionario.email = $("#email").val();
		funcionario.telefone = $("#tell").val();
		funcionario.funcao= $("#idfuncao").val();
		
		endereco.rua = $("#rua").val();
		endereco.numero = $("#numero").val();
		endereco.bairro = $("#bairro").val();
		endereco.cidadeId = $("#idCidade").val();		
		endereco.complemento = $("#complemento").val();
		endereco.cep = $("#cep").val();
			
		if(funcionario.nome=="" || funcionario.nome==null){
			msg+="Digite um nome.\n";
		};	
		
		if (!funcionario.nome.length>3){
			msg+="Número minimo de caracteres para um nome é 3.\n";
		};		
		
		if(funcionario.cpf =="" || funcionario.cpf == null){
			msg+="Digite um CPF.\n";		
		};
		
		if(!funcionario.cpf.length==11){
			msg+="O CPF deve conter 11 digitos.\n";
		
		}else{	
			funcionario.cpf=funcionario.cpf.replace(/\D/g, '');
		};
		
		if(funcionario.login==""||funcionario.login==null) {
	        msg="Insira um nome de Usuário valido.\n";	       
		};
		
		if(funcionario.login.length<5 || funcionario.login.length>20){
			msg+="Mínimo 5 e o máximo 20 caracteres para o Usuário.\n";
		};
		
		if(funcionario.senha=="" || funcionario.senha===null){
			msg+="Insira uma senha valida.\n";			
		};
		
		if(funcionario.senha.length<6||funcionario.senha.length>50){
			msg+="Mínimo 6 e o máximo 50 caracteres para a Senha.\n";
		};
				
		if(funcionario.email.indexOf("@") == -1||funcionario.email.indexOf(".") == -1 || funcionario.email == ""){
			msg+="Insira um e-mail valido.\n";			
		};
		
		if(!funcionario.telefone.length==11 || !funcionario.telefone.length==10 ){
			msg+="Insira um telefone valido.\n";
		}else{
			funcionario.telefone=funcionario.telefone.replace(/\D/g, '');
		};		
		
		if(endereco.rua=="" || endereco.rua==null){
			msg+="Digite uma rua.\n";
		};	
		
		if (!endereco.rua.length>3){
			msg+="Número minimo de caracteres para uma rua é 3.\n";
		};
		
		if(endereco.numero =="" || endereco.numero == null){
			msg+="Digite um número.\n";
		};		

		if(endereco.bairro=="" || endereco.bairro==null){
			msg+="Digite um bairro.\n";
		};	
		
		if (!endereco.bairro.length>3){
			msg+="Número minimo de caracteres para um bairro é 3.\n";
		};	
		
		if(endereco.cidadeId==""||endereco.cidadeId==null||endereco.cidadeId=="cidade"){
			msg+="Escolha uma cidade.\n";
		};
		
		if(!endereco.cep.length==8){
			msg+="O CEP deve conter 08 digitos.\n";
		}else{
			endereco.cep=endereco.cep.replace(/\D/g, '');
		};		
		
		if(msg===""){
			
			funcionario.endereco=endereco;			
			
			var cfg={
					 url:"../rest/funcionariorest/inserir",
					 data:funcionario, 
					 success:function(msg){
						 msgSucesso(msg);
						 $("#inserirFuncionario").modal("hide");
						
						 var busca="";
						 logos.funcionario.exibirFuncionario(undefined,busca);
						 
					 },
					 error:function(err){					
							msgErro(err);							
					}				
			};
			
			logos.ajax.Post(cfg);
						
		}else{
			alert(msg);
		};	
		
	};// Fim da funcao validaForm ************************************************************************************
	
	logos.funcionario.estado=function(id){
				
		var estados=null;		
		
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
						
						$('#editIdEstado').html(html);
						$('#editIdEstado').val(id.idestado);						
						logos.funcionario.buscarCidade(id);
						
					}else{
							
						$('#idEstado').html(html);					  
						$("#inserirFuncionario").modal("show");
					
					}					
				},
				error:function(err){					
					msgErro(err);			
				}
	};	
		 
		logos.ajax.Get(cfg);	
		
	};// Fim do método logos.busca.estado ************************************************************************************
	
	logos.funcionario.buscarCidade = function(idEstado){ 		
		
		if(isObject(idEstado)){	
			
			var id=idEstado.idestado;	
			
		}else{			
			var id=idEstado;
		}
			
			var html="";
			
			var cfg={					
					 url:"../rest/enderecorest/buscarCidade/"+id,				
					 success:function(listaCidade){
						 
						 if(listaCidade!= undefined && listaCidade.length>0){								
								
							 for(var i=0; i<listaCidade.length; i++){
								
									html+="<option value='"+listaCidade[i].id+"'>"+listaCidade[i].cidade+"</option>";						
								};
								
								if(isObject(idEstado)){
									
									$('#editIdCidade').html(html);
									$('#editIdCidade').val(idEstado.idcidade); 
									
								}else{									
									$('.selectCidade').html(html);
								};							
						 }; 
					 },
					error:function(err){					
						msgErro(err);							
					}					
			};
			
			logos.ajax.Get(cfg);			
			
		
	};// fim do método mostrarCidade ************************************************************************************
	
	
	logos.funcionario.exibirFuncionario=function(listadeFunc,busca){ 
		
		var html="<table id='idtableEdit' class='tableFunci table table-lg table-bordered'><thead class='thead-dark'><tr><th scope='col'>Nome</th>"
			+"<th scope='col'>Telefone</th><th scope='col'>CPF</th><th scope='col'>Login</th><th scope='col'>Ações</th></tr></thead><tbody>";		
	
		if(listadeFunc != undefined && listadeFunc.length>0){			
			
			for(var i=0; i<listadeFunc.length; i++ ){								
				html+="<tr><td>"+listadeFunc[i].nome+"</td><td>"+listadeFunc[i].telefone+"</td><td>"
								+listadeFunc[i].cpf+"<td>"+listadeFunc[i].login+"</td>"+"</td><td><a class='link' onclick='logos.funcionario.editar("
								+listadeFunc[i].id+")'><i class='fas fa-pencil-alt'></i></a><a class='link' onclick='logos.funcionario.visualizar("
								+listadeFunc[i].id+")'><i id='imgVisualiza' class='far fa-eye'></i></a><a class='link' onclick='logos.funcionario.modalDel("
								+listadeFunc[i].id+")'><i class='fas fa-trash'></i></a></td></tr>";	
			};	
			
		}else{		
		
			if(listadeFunc == undefined){	
			
				if(busca==""){
					busca = null;
				};
			
				var cfg ={
						
						url:"../rest/funcionariorest/buscar/"+busca,						
						success:function(lista){
							
							logos.funcionario.exibirFuncionario(lista);	
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
		$('#gridFuncionario').html(html);
		
		if(listadeFunc != undefined && listadeFunc.length>11){			
			
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
	}; // logos.funcionario.exibirFuncionario ************************************************************************************
	 
	logos.funcionario.editar=function(id){ 
			
			$('#modalEditar1').find('input, button, select').prop('disabled', false);
			
			$('#editSalvarFunc').show();			
			$('#editSenhaFunc').show();
			$('#labelSenha').show();			
			$('#labelUsuario').show();
			$('#editLoginFunc').show();			
			
			$("#editCancelar").text("Cancelar");
			$("#h5modaltitle").text("Editar Funcionário");
			
		if(id!=""||id!=null){ 
					
					var cfg={					
							url:"../rest/funcionariorest/buscarID/"+id,					
							success:function(funcionario){
								
								$("#editNome").val(funcionario.nome);
								$("#editTell").val(funcionario.telefone);
								
								$('#editTell').mask('0000-0000');
								$("#editComplemento").val(funcionario.endereco.complemento);						
								
								$("#editCpf").val(funcionario.cpf);
								$('#editCpf').mask('000.000.000-00', {reverse: true});
								
								$("#editId").val(funcionario.id);
								$("#editidEndereco").val(funcionario.idEndereco);
								$("#editRua").val(funcionario.endereco.rua);	
								$("#editBairro").val(funcionario.endereco.bairro);
								
								$("#editEmail").val(funcionario.email);
								$("#editNumero").val(funcionario.endereco.numero);
								
								$("#editCep").val(funcionario.endereco.cep);
								$('#editCep').mask('00000-000');
								
								$("#editIdfuncao").val(funcionario.funcao);
								$('#editLoginFunc').val(funcionario.login)	
								logos.funcionario.editSelect(funcionario.endereco.cidadeId);
								
								$("#editFuncionario").modal("show");
								
							},
							error:function(err){						
								msgErro(err);
							}
					};
					logos.ajax.Get(cfg);
		};	
		
	}// fim da função logos.funcionario.editar *******************************************************************************************
	
	logos.funcionario.editSelect=function(idCidade){
				   
		var cfg={
				 url:"../rest/enderecorest/buscarEstadoID/"+idCidade,				
				 success:function(idestado){ 
					 
					 var estado=new Object();
					 
						 estado.idcidade=idCidade;
						 estado.idestado=idestado.id;
					 
					 logos.funcionario.estado(estado);
				
				 },				
					 error:function(err){						
							msgErro(err);
						}
				};				
			logos.ajax.Get(cfg);
		
	}// Fim do método editSelect	
	
	
	logos.funcionario.modalDel=function(id){
		
		$("#Delfunc").val(id);
		$("#modalDel").modal("show");		
		
	};//Fim da funcao modalDell; *******************************************************************************************
	
	logos.funcionario.deletar=function(){
	
		var id = $("#Delfunc").val();
			
				var cfg={
						url:"../rest/funcionariorest/deletar/"+id,					
						success:function(retorno){  
							
							$("#modalDel").modal("hide");					
							msgSucesso(retorno);
							
							var busca="";						
							logos.funcionario.exibirFuncionario(undefined,busca);
						},
						error:function(err){										
							msgErro(err);
						}
					};
				
				logos.ajax.Delete(cfg);				
		
	}// fim da função logos.funcionario.deletar ************************************************************************************
	
	logos.funcionario.validaBusca=function(){
		
		var busca=$("#buscarFunc").val();
		$("#buscarFuncionario").modal("hide");
		$("#buscarFunc").val("");		
		
		logos.funcionario.exibirFuncionario(undefined,busca);
		
	}// fim da funcao busca ************************************************************************************
	
	logos.funcionario.validaEdit=function(){
		
		var msg="";		
		var funcionario=new Object();
		var endereco=new Object();
		
		funcionario.nome = $("#editNome").val();
		funcionario.cpf = $("#editCpf").val();
		funcionario.id=$("#editId").val();
		
		funcionario.login= $("#editLoginFunc").val();		
		funcionario.senha= $("#editSenhaFunc").val(); 	
		funcionario.idEndereco=$("#editidEndereco").val();
		
		funcionario.email = $("#editEmail").val();
		funcionario.telefone = $("#editTell").val();
		funcionario.funcao= $("#editIdfuncao").val();
		
		endereco.rua = $("#editRua").val();
		endereco.numero = $("#editNumero").val();
		endereco.bairro = $("#editBairro").val();
		
		endereco.cidadeId = $("#editIdCidade").val();		
		endereco.complemento = $("#editComplemento").val();
		endereco.cep = $("#editCep").val();		
		
		if(funcionario.nome=="" || funcionario.nome==null){
			msg+="Digite um nome.\n";
		};	
		
		if (!funcionario.nome.length>3){
			msg+="Número minimo de caracteres para um nome é 3.\n";
		};		
		
		if(funcionario.cpf =="" || funcionario.cpf == null){
			msg+="Digite um CPF.\n";
		};
		
		if(!funcionario.cpf.length==11){			
			msg+="O CPF deve conter 11 digitos.\n";		
		}else{			
			funcionario.cpf=funcionario.cpf.replace(/\D/g, '');	
		};
		
		if(funcionario.login==""||funcionario.login==null) {
	        msg="Insira um nome de Usuário valido.\n";	       
		};
		
		if(funcionario.login.length<5 || funcionario.login.length>20){
			msg+="Mínimo 5 e o máximo 20 caracteres para o Usuário.\n";
		};
		
		if(funcionario.senha=="" || funcionario.senha===null || funcionario.senha == undefined){	
			
			
		}else if(funcionario.senha.length<6||funcionario.senha.length>50){
			msg+="Mínimo 6 e o máximo 50 caracteres para a Senha.\n";
		};			
		
		
				
		if(funcionario.email.indexOf("@") == -1||funcionario.email.indexOf(".") == -1 || funcionario.email == ""){
			msg+="Insira um e-mail valido.\n";			
		};
		
		if(!funcionario.telefone.length==11 || !funcionario.telefone.length==10 ){
			msg+="Insira um telefone valido.\n";
		}else{
			funcionario.telefone=funcionario.telefone.replace(/\D/g, '');
		};		
		
		if(endereco.rua=="" || endereco.rua==null){
			msg+="Digite uma rua.\n";
		};	
		
		if (!endereco.rua.length>3){
			msg+="Número minimo de caracteres para uma rua é 3.\n";
		};
		
		if(endereco.numero =="" || endereco.numero == null){
			msg+="Digite um número.\n";
		};		

		if(endereco.bairro=="" || endereco.bairro==null){
			msg+="Digite um bairro.\n";
		};	
		
		if (!endereco.bairro.length>3){
			msg+="Número minimo de caracteres para um bairro é 3.\n";
		};	
		
		if(endereco.cidadeId==""||endereco.cidadeId==null){
			msg+="Escolha uma cidade.\n";
		};
		
		if(!endereco.cep.length==8){
			msg+="O CEP deve conter 08 digitos.\n";
		}else{
			endereco.cep=endereco.cep.replace(/\D/g, '');
		};		
		
		if(msg===""){
			
			funcionario.endereco=endereco;			
			
			var cfg={
					 url:"../rest/funcionariorest/atualizar",
					 data:funcionario, 
					 success:function(msg){
						 msgSucesso(msg);					
						 
						 var busca="";
						 logos.funcionario.exibirFuncionario(undefined,busca);
						 
						 $("#editFuncionario").modal("hide");
					 },
					 error:function(err){					
							msgErro(err);							
					}				
			};
		
			logos.ajax.Put(cfg);
						
		}else{
			alert(msg);
		};
		
	}// fim da funcao
	
		logos.funcionario.visualizar=function(id){			
			
			logos.funcionario.editar(id);
			
			$('#editSalvarFunc').hide();
			
			$('#editSenhaFunc').hide();
			$('#labelSenha').hide();			
			$('#labelUsuario').hide();
			$('#editLoginFunc').hide();
			
			$("#editCancelar").text("Voltar");
			$("#h5modaltitle").text("Visualizar Funcionario");
			$('#modalEditar1').find('input, button,select').prop('disabled', true);
						
		}
	
	 var busca="";
	 logos.funcionario.exibirFuncionario(undefined,busca);
		 
	 //# sourceURL=funcionario.js	
});
