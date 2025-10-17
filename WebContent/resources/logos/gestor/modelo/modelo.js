
logos.equipamento= new Object();

$(document).ready(function() {
	
	logos.equipamento.modalInserir = function(){
		
		logos.equipamento.BuscarMarcas();
		$('.inserirEqpt').show();   // Mostrar o botão de salvar.
		$('.buscar').hide();        // Esconder o botão de buscar.
		$("#equipamento").show();   // Mostrar o select de equipamentos.
		$('.atualizar').hide(); 	// esconder o botão de atualizar
		$("#h5modaltitle").text("Inserir Equipamento");			
		$("#modalinserir").modal("show");
		
	}; // fim da função modalInserir	
	
	logos.equipamento.BuscarMarcas=function(equipamento){	
		
		var busca = null;		
		var cfg={				
				url:"../rest/marcarest/buscar/"+busca,				
				success:function(listMarca){														
					
					var html="<option value='marca'>Marca</option>";
					
					if(listMarca != undefined && listMarca.length > 0 ){						
						
						for(var i=0; i<listMarca.length; i++){
							
							html += "<option value='"+ listMarca[i].id +"'>"+ listMarca[i].marca+"</option>";
						};
					};
					
					$("#marca").html(html);
					
				if(equipamento != undefined){
				
					$("#marca").val(equipamento[0].marca.id);
					$("#equipamento").val(equipamento[0].equipamento)
				
				}else{
					
					$("#marca").val("marca");	
					$("#equipamento").val("equipamento");
				};
				
				},
				error:function(err){
					msgErro(err);
				}
		};
		
		logos.ajax.Get(cfg);	
		
	};
	//******************* fim da função BuscarMarcas ****************
	
	logos.equipamento.Validar = function(){
	
		var msg="";
		var marca = new Object();
		var equipamento = new Object();
		
		marca.id = $("#marca").val();
		equipamento.equipamento = $("#equipamento").val();
		equipamento.modelo = $("#modelo").val();	
		
		if(marca.id == "marca"){
			msg="Selecione uma Marca.\n";
		};
		
		if(equipamento.equipamento == "equipamento"){
			msg +="Selecione um Equipamento.\n";
		};
		
		if(equipamento.modelo == "" || equipamento.modelo == "null"){
			msg +="Digite um modelo de equipamento.\n";
		};		
		
		if(msg ==""){
			equipamento.marca=marca;
			logos.equipamento.inserir(equipamento);
		}else{
			msgErro(msg);
		};		
	};
	
	//******************* fim da função validar ****************
	
	logos.equipamento.inserir = function(equipamento){
			
		var cfg={
			url:"../rest/equipamentorest/inserir/",
			data:equipamento,			
				success:function(msg){				 
					msgSucesso(msg);
					
					logos.equipamento.exibir(undefined);
				},
				error:function(err){
					
					msgErro(err);							
				}				
		};
		
		logos.ajax.Post(cfg);
			
	};
	// **************** fim da função inserir ****************	
	
	logos.equipamento.preModalBusca = function(buscar){
		
		$('.inserirEqpt').hide();  // Esconder o botão de salvar.
		$('#equipamento').hide();  // Esconde o select de equipamentos.
		$('.buscar').show();       // Mostrar o botão de buscar.
		$('.atualizar').hide(); 	// esconder o botão de atualizar
				
		$("#h5modaltitle").text("Buscar Equipamento");
		logos.equipamento.BuscarMarcas();
		$("#modalinserir").modal("show");		
	};	
	
	//******************* fim da função pre-Buscar *****************
	
	logos.equipamento.validaBuscar=function(){
	
		var msg="";		
		var marca = new Object();
		var equipamento = new Object();
		
		marca.id = $("#marca").val();		
		equipamento.modelo = $("#modelo").val();	
		
		if(marca.id != "marca" && equipamento.modelo =="" || equipamento.modelo == "null" ){
			msg="Digite um modelo.\n";
		};		
		
		if(marca.id == "marca" && equipamento.modelo != "" || equipamento.modelo == "null"){
			msg +="Digite uma marca.\n";
		};
		
		if(msg == ""){	
			
			equipamento.marca=marca;
			logos.equipamento.Buscar(equipamento);	
			
		}else{
			$("#modalinserir").modal("hide");
			msgErro(msg);
		};		
	};
	
	//******************* fim da função validaBusca  *******************
	
	logos.equipamento.Buscar=function(equipamento){
		
		if(equipamento.marca.id == "marca" && equipamento.modelo == "" || equipamento.modelo == "null"){
				
			logos.equipamento.exibir(undefined); // faz uma busca geral
			
		}else{		
			
			var cfg={
					url:"../rest/equipamentorest/buscarModelo/",
					data:equipamento,
						success:function(lista){												
							logos.equipamento.exibir(lista);
							$("#modalinserir").modal("hide");
						},
						error:function(err){					
							msgErro(err.text);							
						}				
				};
				
				logos.ajax.Post(cfg);
			};
	};	
	
	//******************* fim da função Busca  *******************
	
	logos.equipamento.exibir=function(listaEquipamento){
		
		var html="<table class='table table-sm table-bordered'><thead class='thead-dark'><tr><th scope='col'>Marca</th>"
			+"<th scope='col'>Modelo</th> <th scope='col'>Equipamento</th><th scope='col'>Ações</th></tr></thead><tbody>";	
		
		if(listaEquipamento != undefined && listaEquipamento.length>0){
				var equipamento="";
				
					for(var i=0;i<listaEquipamento.length;i++){
						
					   if(listaEquipamento[i].equipamento==0){
					    	equipamento="Notebook";
					    }else{
					    	equipamento="Smartphone";
					    };	
					  
					    
					    html+="<tr><td>"+listaEquipamento[i].marca.marca+"</td><td>"+equipamento+"</td><td>"+listaEquipamento[i].modelo+"</td><td>"					
							+"<a class='link' onclick='logos.equipamento.editar("+listaEquipamento[i].idmodelo+")'><i class='fas fa-pencil-alt'></i></a>"
							+"<a class='link' onclick='logos.equipamento.preExcluir("+listaEquipamento[i].idmodelo+")'><i class='fas fa-trash'></i></a></td></tr>";															
					};	
					
		}else if(listaEquipamento == undefined){	
				var Id=null;				
				var cfg ={						
						url:"../rest/equipamentorest/buscar/"+Id,						
						success:function(lista){
							
							logos.equipamento.exibir(lista);	
							$("#modalinserir").modal("hide");
						},
						error:function(err){							
							msgErro(err.text);							
						}
				};
			
				logos.ajax.Get(cfg);
		 
			}else{				
				html+="<tr><td colspan='5' style='font-weight:bold'>Nenhum Resultado encontrado</td></tr>";
			};	
			
			html+="</tbody></table>";			
			$('#gridEquipamento').html(html);
			
			if(listaEquipamento != undefined && listaEquipamento.length>5){			
				$('.table tbody').paginathing({
				    perPage:5, 
				    limitPagination:2,			  
				    containerClass:'panel-footer',
				    insertAfter:'.table',
				    prevText:'&laquo;',			   
				    nextText:'&raquo;',			    
				    firstText:'Primeiro',			    
				    lastText:'Último',
				});		
		};			
	};
	
	//******************* fim da função exibir ****************
	
	logos.equipamento.editar=function(Id){	
				
		var cfg={
				url:"../rest/equipamentorest/buscar/"+Id,
				success:function(equipamento){
					
									
					$('.inserirEqpt').hide();   // Esconder o botão de salvar.
					$('#equipamento').show();   // Esconde o select de equipamentos.
					$('.buscar').hide();       	// Mostrar o botão de buscar.					
					$('.atualizar').show(); 	// esconder o botão de atualizar
					$('.inserirEqpt').hide();	// Esconder o botão de salvar de inserir.
					$("#h5modaltitle").text("Editar Equipamento");					
										
					logos.equipamento.BuscarMarcas(equipamento);
					
					$("#idmodelo").val(equipamento[0].idmodelo);
					$("#modelo").val(equipamento[0].modelo);				
									
					
					$("#modalinserir").modal("show");	
						
					},
					error:function(err){					
						msgErro(err.text);							
					}				
			};
			
			logos.ajax.Get(cfg);	
	};
	
	//******************* fim da função editar *****************
	
	logos.equipamento.atualizar=function(){
		
		var msg="";
		var marca = new Object();
		var equipamento = new Object();
		
		marca.id = $("#marca").val();
		equipamento.equipamento = $("#equipamento").val();
		equipamento.modelo = $("#modelo").val();
		equipamento.idmodelo = $("#idmodelo").val();		
	
		if(marca.id == "marca"){
			msg="Selecione uma Marca.\n";
		};
		
		if(equipamento.equipamento == "equipamento"){
			msg +="Selecione um Equipamento.\n";
		};
		
		if(equipamento.modelo == "" || equipamento.modelo == "null"){
			msg +="Digite um modelo de equipamento.\n";
		};		
		
		if(msg ==""){
			equipamento.marca=marca;
			
			var cfg={
					url:"../rest/equipamentorest/atualizar/",
					data:equipamento,
						success:function(msg){												
							msgSucesso(msg);							
							logos.equipamento.exibir(undefined);
						},
						error:function(err){					
							msgErro(err.text);							
						}				
				};
				
				logos.ajax.Put(cfg);
			
			
		}else{
			msgErro(msg);
		};		
	};
	
	
	//******************* fim da função atualizar ***************
	
	logos.equipamento.preExcluir= function(id){
		
		$("#idmodelo").val(id);
		$("#modalDell").modal("show");		
		
	};
	
	//******************* fim da função preExcluir *****************
		
	logos.equipamento.excluir=function(){
		
		var id = $("#idmodelo").val();
		
		var cfg={
				url:"../rest/equipamentorest/deletar/"+id,			
					success:function(msg){
						$("#modalDell").modal("hide");	
						msgSucesso(msg);							
						logos.equipamento.exibir(undefined);
					},
					error:function(err){
						$("#modalDell").modal("hide");
						msgErro(err.text);							
					}				
			};
			
		logos.ajax.Delete(cfg);		
	};
	
	//******************* fim da função excluir  *******************
	
	
	logos.equipamento.exibir(undefined);
	//# sourceURL=modelo.js	
});