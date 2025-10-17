logos.marca= new Object();

$(document).ready(function() {	
	
	logos.marca.validaMarca=function(){	
		
		var marca = document.getElementById("marca").value;
		
		if(marca===""||marca=="null"){
			alert("Digite o nome da marca");
			$("#marca").val("");
		
		}else{			
			
			var novamarca = new Object();			
			novamarca.marca = marca;			
			
			var cfg={					
					url:"../rest/marcarest/inserir",
					data:novamarca,
					success:function(retorno){ 
						
						$("#marca").val("");
						$("#modalinserir").modal("hide");										
						
						msgSucesso(retorno);
						
						var busca="";
						logos.marca.exibirMarca(undefined,busca);
						
					},
					error:function(err){
						msgErro(err);
					}
			};
			
			logos.ajax.Post(cfg);			
		};		
		
	};// fim do metodo logos.marca.validaMarca; ************************************************************************
	
	
	logos.marca.validaBusca=function(){
		
		var busca=document.getElementById("buscarmarca").value;
		$("#modalbusca").modal("hide");
		$("#buscarmarca").val("");		
		
		logos.marca.exibirMarca(undefined,busca);
		
	};// fim da função logos.marca.validaBusca; ************************************************************************
	
	logos.marca.exibirMarca=function(listadeMarca,busca){			
		
		var html="<table id='idtable' class='table table-sm table-bordered'><thead class='thead-dark'><tr><th scope='col'>Marca</th>"
				+"<th scope='col'>Ações</th></tr></thead><tbody>";		
		
		if(listadeMarca != undefined && listadeMarca.length>0){
			
			for(var i=0; i<listadeMarca.length; i++ ){								
				html+="<tr><td>"+listadeMarca[i].marca+"</td><td><a class='link' onclick='logos.marca.editarMarca("
								+listadeMarca[i].id+")'><i class='fas fa-pencil-alt'></i></a><a class='link' onclick='logos.marca.modalDell("
								+listadeMarca[i].id+")'><i class='fas fa-trash'></i></a></td></tr>";							
			};	
			
		}else{
			if(listadeMarca == undefined){
				
				if(busca == ""){
					busca = null;
				};
				
				var cfg={					
						url:"../rest/marcarest/buscar/"+busca,						
						success:function(lista){							
							logos.marca.exibirMarca(lista);
						},
						error:function(err){							
							msgErro(err);										
						}
				};
				
				logos.ajax.Get(cfg);
				
			}else{				
				html+="<tr><td colspan='2' style='font-weight:bold'>Nenhum Resultado encontrado</td></tr>";
			};			
		};
		
		html+="</tbody></table>";					
		$('#gridMarca').html(html);
		
		if(listadeMarca != undefined && listadeMarca.length>11){			
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
	}; // fim do método logos.marca.exibirMarca; ************************************************************************
	
	logos.marca.editarMarca=function(id){		
		
		if(id!=""||id!=null){ 
			
			var cfg={					
					url:"../rest/marcarest/buscarID/"+id,					
					success:function(listaDMarcas){
						
						$("#editarMarca").val(listaDMarcas[0].marca);
						$("#idMarca").val(listaDMarcas[0].id);
						$("#modaleditar").modal("show");
					},
					error:function(err){						
						msgErro(err);
					}
			};
			logos.ajax.Get(cfg);
		};
		
	}; // fim da funcao editar marca; ************************************************************************************
		
	logos.marca.modalDell=function(id){
		$("#Dellmarca").val(id);
		$("#modalDell").modal("show");		
		
	};//Fim da funcao modalDell; *******************************************************************************************
	
	
	logos.marca.deletarMarca=function(){
		var id=document.getElementById("Dellmarca").value;
		
			var cfg={
					url:"../rest/marcarest/deletar/"+id,					
					success:function(retorno){  
						
						$("#modalDell").modal("hide");						
						
						msgSucesso(retorno);
						
						var busca="";
						logos.marca.exibirMarca(undefined,busca);						
					},
					error:function(err){										
						msgErro(err);
					}
				};
			logos.ajax.Delete(cfg);
			
	};// fim da funcao deletarMarca; ************************************************************************************
		
	logos.marca.atualizaMarca=function(){
		
		var teste = document.getElementById("editarMarca").value;
		
		if(teste===""||teste==null){
			alert("Nome da marca invalida");			
		}else{
			var Marca = new Object();			
			Marca.marca = document.getElementById("editarMarca").value;
			
			Marca.id = document.getElementById("idMarca").value;		
			
			var cfg={
					url:"../rest/marcarest/atualiza",
					data:Marca,					
					success:function(retorno){		
						
						$("#modaleditar").modal("hide");
						
						msgSucesso(retorno);
						
						var busca="";
						logos.marca.exibirMarca(undefined,busca);
								
					},			
					error:function(err){					
						msgErro(err);											
					}
				};
		};
		
		logos.ajax.Put(cfg);
		
	}; // fim da função atualizaMarca; ************************************************************************************
	
	logos.marca.exibirMarca(undefined,"");
});

