package br.com.assistenciaTecRest.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.core.Response;

import br.com.assistenciarest.bd.conexao.Conexao;
import br.com.assistenciarest.jdbc.JDBCEnderecoDAO;
import br.com.assistenciarest.objetos.Cidade;
import br.com.assistenciarest.objetos.Estado;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;


@Path("enderecorest")
public class EnderecoRest  extends UtilRest {

	public EnderecoRest(){};
	
	@GET
	@Path("/buscarEstado/{estados}")	
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarEstados(@PathParam("estados") String buscaEstado){  
		
	try {
		List<Estado>listaEstados = new ArrayList<Estado>();
		
		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
		listaEstados=jdbc.buscarEstado(buscaEstado);
		conec.fecharConexao();
		
		return this.buildResponse(listaEstados);
		
		
	} catch (Exception e) {
		e.printStackTrace();
		return this.buildErrorResponse("500 Internal Server Error");
	}	
	
	} // fim do método buscarEstados 
	
	@GET
	@Path("/buscarCidade/{idEstado}")	
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarCidade(@PathParam("idEstado") int idestado){  
	
		try {
			
			List<Cidade>listaCidades = new ArrayList<Cidade>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
			listaCidades=jdbc.buscarCidade(idestado);
			conec.fecharConexao();
			
			return this.buildResponse(listaCidades);
		
	
		} catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");			
		}
		
	}// fim do método buscarCiade
	
	@GET
	@Path("/buscarEstadoID/{idCidade}")	// nesta busca, se usa o id da cidade para realizar a pesquisa na tabela cidade.
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarEstadoiD(@PathParam("idCidade") int idCidade){  
			Estado estados = new Estado();
	
			try {			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
			estados=jdbc.buscarEstadoID(idCidade);
			
			conec.fecharConexao();
			return this.buildResponse(estados);
		
	
		} catch (Exception e) {
			e.printStackTrace();
		return this.buildErrorResponse("500 Internal Server Error");			
		}
		
	}// fim do método buscarCiade
}
