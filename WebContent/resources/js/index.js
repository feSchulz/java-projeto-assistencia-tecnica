
$(document).ready(function() {
	
	dashboard=function(){
		alert("implementar o codigo para abrir o dasch...");
	};
	
	
	msgSucesso=function(msg){
		var html="<div class='alert alert-success alert-dismissible'>"+msg+"</div>";							
		$('#alertMsg').html(html);							
		$( "#alertMsg" ).fadeIn( 300 ).delay( 1000 ).fadeOut( 300 );
	};
	
	msgErro=function(msg){
		var html="<div class='alert alert-danger alert-dismissible'>"+msg+"</div>";							
		$('#alertMsg').html(html);							
		$( "#alertMsg" ).fadeIn( 300 ).delay( 1000 ).fadeOut( 300 );	
	};
	
	CarregaPagina=function(caminho,nome){		
		
		var pagina ="logos/"+caminho+"/"+nome+"/"+nome+".html";
		
		$("#conteudo").html("");
		$("#conteudo").load(pagina); //ver a pagina pq nao troca de forma efetiva as mudacas no dinamico do html		
	};
	
});