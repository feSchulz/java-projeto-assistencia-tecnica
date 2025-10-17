package br.com.assistenciaTecRest.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.core.Response;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;



import br.com.assistenciarest.bd.conexao.Conexao;
import br.com.assistenciarest.objetos.Marca;
import br.com.assistenciarest.jdbc.JDBCMarcaDAO;

@Path("marcarest") // Caminho URI da CLASSE Rest ultilizada.
public class MarcaRest extends UtilRest{

	public MarcaRest() {
		
	}
	
	@POST	
	@Path("/inserir")	
	@Consumes("application/*")
	
	public Response inserirMarca(String nomemarca){
		
		try {
			
			Marca marca = new ObjectMapper().readValue(nomemarca,Marca.class);			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCMarcaDAO jdbcmarca = new JDBCMarcaDAO(conexao);
			boolean retorno =jdbcmarca.inserirMarca(marca);
			conec.fecharConexao();
			
			if(retorno){			
				return this.buildResponse("Marca cadastrada com sucesso.");
			
			}else {				
				return this.buildErrorResponse("Erro ao Cadastrar a marca");
			}
			
		}catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("500 Internal Server Error");
				
		}
		
	}//Fim do m�todo addMarca;  **********************************	
	
	@GET
	@Path("/buscar/{busca}")	
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarMarca(@PathParam("busca") String nomeMarca) {  
		
		try {
			
			List<Marca>listmarcas = new ArrayList<Marca>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCMarcaDAO jdbcmarca = new JDBCMarcaDAO(conexao);
			listmarcas=jdbcmarca.buscarMarca(nomeMarca);
			
			conec.fecharConexao();
			
			return this.buildResponse(listmarcas);
				
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
		
	} //Fim do m�todo buscarMarca; **********************************
	
	@GET
	@Path("/buscarID/{id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarMarcaID(@PathParam("id")int id) {  
		
		try {
			
			List<Marca>listmarcas = new ArrayList<Marca>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCMarcaDAO jdbcmarca = new JDBCMarcaDAO(conexao);
			listmarcas=jdbcmarca.buscarMarcaID(id);
			
			conec.fecharConexao();
			
			return this.buildResponse(listmarcas);
				
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
		
	} //Fim do m�todo buscarMarca; **********************************

	@PUT
	@Path("/atualiza")
	@Consumes("application/*")
	
	public Response atualizamarca (String atlzMarca){
		
		try {
			Marca marca = new ObjectMapper().readValue(atlzMarca,Marca.class);			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCMarcaDAO jdbcmarca = new JDBCMarcaDAO(conexao);
			boolean retorno = jdbcmarca.atualizaMarca(marca);
			conec.fecharConexao();
			
			if(retorno) {			
				return this.buildResponse("Marca Editada com sucesso");
			}else {
				return this.buildErrorResponse("Erro ao atualizar a marca");
			}
			
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");
		}
		
	}// fim do m�todo atualizamarca; **********************************
	
	@DELETE
	@Path("/deletar/{id}")
	@Consumes("application/*")
	
	public Response deletarmarca(@PathParam("id")int idMarca) {
		try {	
		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		
		JDBCMarcaDAO jdbcmarca = new JDBCMarcaDAO(conexao);
		boolean retorno = jdbcmarca.deletarMarca(idMarca);
		conec.fecharConexao();
		
		if(retorno) {		
			return this.buildResponse("Marca deletada com sucesso");
		}else {
			return this.buildErrorResponse("Erro ao deletar a Marca");
		}
		
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");
		}
	} // fim do m�todo deletarMarca; **********************************		
}
	
	
	
	
	
	

