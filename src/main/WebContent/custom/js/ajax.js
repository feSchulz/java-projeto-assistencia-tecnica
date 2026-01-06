

logos = new Object();


logos.ajax= new Object();

// Processa o pedido, solicitação HTTP Ajax a ser recebido pelo Rest.
 

function ajaxRequestDefault(){
	var def={
			url:null,
			dataType:'json',
			contentType:"application/json;charset=UTF-8",
			type:'POST',
			success:function(){},
			error:function(err){
				alert("error = "+err.responseText);
			}
	};
	return def;
}; 

function verifyObjectData(cfg){
	if(cfg.data){
		if(isObject(cfg.data)) {
			cfg.data = JSON.stringify(cfg.data);
		}
	};
	return cfg;
};


function isObject(cfg){
	return $.isArray(cfg)|$.isPlainObject(cfg)|$.isFunction(cfg);
}; 

	logos.ajax.Post = function(cfg){
		
		var def= new ajaxRequestDefault();	
		cfg = verifyObjectData(cfg);
		var confg = $.extend(def,cfg);	
		$.ajax(confg);
	
	
	}; // fim da funcao logos.ajax.post.
	
	logos.ajax.Get = function(cfg){
		
		var def = new ajaxRequestDefault();
		cfg.type="GET";
		cfg=verifyObjectData(cfg);
		var confg = $.extend(def,cfg);
	
		$.ajax(confg);
	
	}; // fim da funcao logos.ajax.get.
	
	
	
	logos.ajax.Put = function(cfg){
		
		var def = new ajaxRequestDefault();
		cfg.type="PUT";
		cfg=verifyObjectData(cfg);
		var confg = $.extend(def,cfg);
	
		$.ajax(confg);
		
		
	};// fim do método logos.ajax.atualizar;
	
	logos.ajax.Delete = function(cfg){
		
		var def = new ajaxRequestDefault();
		cfg.type="DELETE";
		cfg=verifyObjectData(cfg);
		var confg = $.extend(def,cfg);
		
		$.ajax(confg);
};