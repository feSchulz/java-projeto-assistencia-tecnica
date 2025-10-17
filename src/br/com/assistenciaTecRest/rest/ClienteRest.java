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
import br.com.assistenciarest.objetos.Funcionario;
import br.com.assistenciarest.objetos.Cliente;
import br.com.assistenciarest.objetos.Endereco;
import br.com.assistenciarest.jdbc.JDBCEnderecoDAO;
import br.com.assistenciarest.jdbc.JDBCFuncionarioDAO;
import br.com.assistenciarest.jdbc.JDBCClienteDAO;

@Path("clienterest")

public class ClienteRest extends UtilRest {

	public ClienteRest(){} 

	@POST
	@Path("/inserir")
	@Consumes("application/*")
	
	public Response inserir(String addcliente){
		
		boolean retorno = false;
		
		try {
						
			Cliente cliente = new ObjectMapper().readValue(addcliente,Cliente.class);	
				
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
			cliente.setEndereco( jdbc.addendereco(cliente.getEndereco()));			
				
			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
			retorno = jdbcCliente.addCliente (cliente);				
			conec.fecharConexao();
			
			if(retorno){
				
				return this.buildResponse("Cliente Cadastrado com sucesso");				
			
			}else {
				
				return this.buildErrorResponse("Erro ao cadastrar Cliente");			
			}
			
		} catch (Exception e){
			e.printStackTrace();
			
			return this.buildErrorResponse("Erro");
		}
	
	}// fim do método inserir
	
	@GET
	@Path("/buscar/{busca}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
		public Response busca (@PathParam("busca") String busca) {
			try {
			
			List<Cliente>list = new ArrayList<Cliente>();
	
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
			list = jdbcCliente.buscar(busca);
	
			conec.fecharConexao();
			return this.buildResponse(list);
	
	
		}catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("500 Internal Server Error");		
		}	
		
	} // fim do método busca
		
	@GET
	@Path("/buscarID/{Id}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscaId (@PathParam("Id") String buscaId) {
		try {
		
		Cliente cliente = new Cliente();

		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
		cliente = jdbcCliente.buscaId(buscaId);

		conec.fecharConexao();
		return this.buildResponse(cliente);

	}catch (Exception e) {
		e.printStackTrace();
		
		return this.buildErrorResponse("500 Internal Server Error");		
	}

}// fim do método buscaId
	
	@PUT 
	@Path("/atualizar")
	@Consumes("application/*")
	
	public Response atualiza(String clienteUpdate){ 
		
			try {
			
				Cliente cliente = new ObjectMapper().readValue(clienteUpdate,Cliente.class);	
				
				Conexao conec = new Conexao();
				Connection conexao = conec.abrirConexao();
				
				JDBCEnderecoDAO jdbc = new JDBCEnderecoDAO(conexao);
				boolean retorno = jdbc.updateEndereco(cliente.getEndereco());			
					
				if(retorno){
					
					JDBCClienteDAO jdbcFunc = new JDBCClienteDAO(conexao);
					retorno = jdbcFunc.updateCliente(cliente); // atualizar o cliente e os seus dados adjacentes no front
				}
				
				conec.fecharConexao();
				
				if(retorno) {
					return this.buildResponse("Cliente Editado com sucesso");
					
				}else {
					return this.buildErrorResponse("Erro ao Editar Cliente");
					
				}
				
		}catch (Exception e) {
			
			e.printStackTrace();
			return this.buildErrorResponse("500 Internal Server Error");
			
		}
	}// fim do método atualizar;
	
	
	
	
}
	
