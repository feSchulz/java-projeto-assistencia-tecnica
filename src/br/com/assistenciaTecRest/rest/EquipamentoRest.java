package br.com.assistenciaTecRest.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;

import br.com.assistenciarest.bd.conexao.Conexao;
import br.com.assistenciarest.jdbc.JDBCEnderecoDAO;
import br.com.assistenciarest.jdbc.JDBCEquipamentoDAO;
import br.com.assistenciarest.jdbc.JDBCMarcaDAO;
import br.com.assistenciarest.objetos.Cidade;
import br.com.assistenciarest.objetos.Equipamento;
import br.com.assistenciarest.objetos.Estado;
import br.com.assistenciarest.objetos.Funcionario;
import br.com.assistenciarest.objetos.Marca;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

@Path("equipamentorest")
public class EquipamentoRest extends UtilRest {

	public EquipamentoRest() {};
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	
	public Response inserir (String modelo){
	
		try {
			
			Equipamento equipamento = new ObjectMapper().readValue(modelo,Equipamento.class);
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCEquipamentoDAO jdbcEquipamento = new JDBCEquipamentoDAO(conexao);
			boolean retorno = jdbcEquipamento.inserir(equipamento);
			conec.fecharConexao();
			
			if(retorno){			
				return this.buildResponse("Equipamento cadastrado com sucesso.");
			
			}else {				
				return this.buildErrorResponse("Erro ao Cadastrar.");
			}
			
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			
			return this.buildErrorResponse("500 Internal Server Error");
		}		
	} // fim do método inserir
	
	@POST
	@Path("/buscarModelo") 
	@Consumes("application/*")
	
	public Response buscarModeloId(String equip){		

		try {
			Equipamento equipamento = new ObjectMapper().readValue(equip,Equipamento.class);
			List<Equipamento>listEquipamento = new ArrayList<Equipamento>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();		
			
			JDBCEquipamentoDAO listequipamento = new JDBCEquipamentoDAO(conexao);				
			listEquipamento = listequipamento.buscaEquipamento(equipamento);			
			
			conec.fecharConexao();			
			return this.buildResponse(listEquipamento);
				
		}catch (Exception e){
			
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
		
		
	} //fim do método buscarModelo
	
	
	@GET
	@Path("/buscar/{Id}") 
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscaEditar(@PathParam("Id") String id){		
		
		try {
			
			List<Equipamento>listEquipamento = new ArrayList<Equipamento>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();		
			
			JDBCEquipamentoDAO listequipamento = new JDBCEquipamentoDAO(conexao);				
			listEquipamento = listequipamento.busca(id);			
			
			conec.fecharConexao();			
			return this.buildResponse(listEquipamento);
				
		}catch (Exception e){
			
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
	} // fim do método busca
	
	@PUT
	@Path("/atualizar")
	@Consumes("application/*")
	
	public Response atualizaModelo (String novo){		
		
		try {
		
			Equipamento equipamento = new ObjectMapper().readValue(novo,Equipamento.class);
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCEquipamentoDAO jdbcEquipamento = new JDBCEquipamentoDAO(conexao);
			boolean retorno = jdbcEquipamento.atualizar(equipamento);
			conec.fecharConexao();
			
			if(retorno){			
				return this.buildResponse("Modelo editado com sucesso.");
			
			}else {				
				return this.buildErrorResponse("Erro ao editar.");
			}			
			
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
	}// fim do método atualizar.
	
	@DELETE
	@Path("/deletar/{id}")
	@Consumes("application/*")
	
	public Response deletarModelo (@PathParam("id") int idmodelo){
	
		try {
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCEquipamentoDAO jdbcEquipamento = new JDBCEquipamentoDAO(conexao);
			boolean retorno = jdbcEquipamento.deletar(idmodelo);
			conec.fecharConexao();			
			
			if(retorno){			
				return this.buildResponse("Modelo Excluido com sucesso.");
			
			}else {				
				return this.buildErrorResponse("Erro ao excluir.");
			}			
			
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
		
	
	
	}	// fim do método deletar modelo
}
