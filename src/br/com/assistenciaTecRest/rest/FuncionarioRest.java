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
import br.com.assistenciarest.objetos.Cidade;
import br.com.assistenciarest.objetos.Estado;
import br.com.assistenciarest.objetos.Marca;
import br.com.assistenciarest.objetos.Funcionario;
import br.com.assistenciarest.jdbc.JDBCEnderecoDAO;
import br.com.assistenciarest.jdbc.JDBCFuncionarioDAO;

@Path("funcionariorest")

public class FuncionarioRest extends UtilRest{

	public FuncionarioRest(){} 
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	
	public Response inserir(String addfuncionario){
		
		boolean retorno=false;
		
		try {
			
			Funcionario funcionario = new ObjectMapper().readValue(addfuncionario,Funcionario.class);	
				
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
			funcionario.setEndereco(jdbc.addendereco(funcionario.getEndereco()));  			
				
			JDBCFuncionarioDAO jdbcFunc = new JDBCFuncionarioDAO(conexao);
			retorno = jdbcFunc.addfuncionario(funcionario);
				
			conec.fecharConexao();
			if(retorno){
				
				return this.buildResponse("Funcionario Cadastrado com sucesso");
				
			}else {
				
				return this.buildErrorResponse("Erro ao cadastrar Funcionario");
			
			}
			
		} catch (Exception e){
			e.printStackTrace();
			
			return this.buildErrorResponse("Erro");
		}
	
	}// fim do método inserir
	
	@PUT 
	@Path("/atualizar")
	@Consumes("application/*")
	
	public Response atualiza(String funcionario){ 
		
			try {
			
				Funcionario func = new ObjectMapper().readValue(funcionario,Funcionario.class);	
				
				Conexao conec = new Conexao();
				Connection conexao = conec.abrirConexao();
				
				JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
				boolean retorno = jdbc.updateEndereco(func.getEndereco());			
					
				if(retorno){
					
					JDBCFuncionarioDAO jdbcFunc = new JDBCFuncionarioDAO(conexao);
					retorno = jdbcFunc.updateFuncionario(func);
				}
				
				conec.fecharConexao();
				
				if(retorno) {
					return this.buildResponse("Funcionario Editado com sucesso");
					
				}else {
					return this.buildErrorResponse("Erro ao Editar Funcionario");
					
				}
				
		}catch (Exception e) {
			
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");
			
		}
	}// fim do método atualizar;

	@GET
	@Path("/buscar/{busca}")	
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarFuncionario(@PathParam("busca")String nomeFunc) {  

		try {
			
			List<Funcionario>list = new ArrayList<Funcionario>();

			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCFuncionarioDAO jdbcFunc = new JDBCFuncionarioDAO(conexao);
			list = jdbcFunc.buscar(nomeFunc);

			conec.fecharConexao();
			return this.buildResponse(list);


		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");		
		}
	} // fim do método buscarFuncionario

	
	@DELETE
	@Path("/deletar/{id}")
	@Consumes("application/*")
	
	public Response deletar(@PathParam("id")int idfunc) {
		
		try {	
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCEnderecoDAO jdbcendereco = new JDBCEnderecoDAO(conexao);
			
			String idEndereco = jdbcendereco.buscarIdEndereco(idfunc);
			JDBCFuncionarioDAO jdbcFunc = new JDBCFuncionarioDAO(conexao);
			boolean retorno=jdbcFunc.deletar(idfunc);
			
			if(retorno) {							
				retorno = jdbcendereco.deletar(idEndereco);	
			}
			
			conec.fecharConexao();
			
			if(retorno) {
				return this.buildResponse("Funcionario deletado com Sucesso");
			}else {
				return this.buildErrorResponse("Erro ao deletar Funcionario");
			}
	
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}		
	}// fim da funcao deletar
	
	@GET
	@Path("/buscarID/{busca}")
	@Consumes("application/*")
	public Response buscarID (@PathParam("busca")int idfunc){
				
		Funcionario funcionario = null;
				
	try {
		
		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		
		JDBCFuncionarioDAO jdbcFunc = new JDBCFuncionarioDAO(conexao);		
		funcionario=jdbcFunc.buscarFuncionario(idfunc);		
		
		conec.fecharConexao();

	}catch (Exception e) {
		e.printStackTrace();
		
		return this.buildErrorResponse("500 Internal Server Error");		
	}
	
	return this.buildResponse(funcionario);
	
	}// fim do método buscaID
}
