$(document).ready(function(){
	
	acessar=function(){
		var msg="";
		
		var nome = document.getElementById("usuario").value;		
		var senha = document.getElementById("senha").value;		
		
		
		if(nome=="") {
	        msg="Insira um nome de Usuário valido.\n";	       
		};
		
		if(nome.length<3||nome.length>25){
			msg+="Mínimo 3 e o máximo 25 caracteres para o Usuário.\n";
		};
		
		if(senha==""){
			msg+="Insira uma senha valida.\n";			
		};
		
		if(senha.length<6||senha.length>50){
			msg+="Mínimo 6 e o máximo 50 caracteres para a Senha.\n";
		};
		
		if(msg==""){			
			window.location.replace("resources/index.html");
			
		}else{			
			alert(msg);
			return false;
		};		
	}; // fim da funcao acessar
	
	
	recuperar=function(){
		
		alert("Escrever o codigo");
	}// fim da funcão recuperar
});