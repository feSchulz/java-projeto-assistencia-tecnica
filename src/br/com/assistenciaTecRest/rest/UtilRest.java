package br.com.assistenciaTecRest.rest;

import java.io.StringWriter;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import org.codehaus.jackson.map.ObjectMapper;

public class UtilRest {	
	
	/* Método responsável por enviar a resposta ao cliente das operações realizadas com sucesso, este método aguarda que seja repassado um
	 *conteúdo que será referenciado por um objeto chamado result.
	 */
	
	public Response buildResponse(Object result) {
	
	StringWriter fw = new StringWriter();
	
	try {	
	
		ObjectMapper mapper = new ObjectMapper();
		
		/*
		 * Criando um mapeamento de dados onde o objeto  fw é a chave do valor de um conteudo referenciado pelo objeto result.		
		 */
		
		mapper.writeValue(fw, result);
		
		/*
		 * Monta o objeto de resposta com status 200 (ok), junto 
		 * com o objeto result convertido para JSON pelo objeto fw para o 
		 * cliente no formato String.
		 */
		return Response.ok(fw.toString()).build();
	
	} catch (Exception ex) {
		
		return this.buildErrorResponse(ex.getMessage());
		}
	}
	
	public Response buildErrorResponse(String str) {	
		
		//Abaixo o objeto rb recebe o status do erro.(500)
		ResponseBuilder rb = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
		
		// Define a entidade (objeto), que nesse caso é uma mensagem que será retornado para o cliente.(str)
		rb = rb.entity(str);	
		
		// Define o tipo de retorno desta entidade(objeto), no caso é definido como texto simples.
		rb = rb.type("text/plain");	
		
		return rb.build();
	
	}
}
