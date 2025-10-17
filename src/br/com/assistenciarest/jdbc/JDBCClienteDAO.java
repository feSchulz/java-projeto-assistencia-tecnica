package br.com.assistenciarest.jdbc;

import java.sql.Connection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.mysql.jdbc.Statement;

import br.com.assistenciarest.objetos.Endereco;
import br.com.assistenciarest.objetos.Funcionario;
import br.com.assistenciarest.objetos.Cliente;;

public class JDBCClienteDAO {

private Connection conexao;
	
	public JDBCClienteDAO(Connection conexao) {
		this.conexao=conexao;		
	}

	public boolean addCliente(Cliente cliente) {
		
		String comando="INSERT INTO clientes (endereco_id,nome,telefone,cpf,email) VALUES(?,?,?,?,?)";	
		
		try {			
			
			PreparedStatement p;
			
				p = this.conexao.prepareStatement(comando);
				
				p.setInt(1,cliente.getEndereco().getIdEndereco());
				p.setString(2,cliente.getNome());
				p.setInt(3,cliente.getTelefone());
				
				p.setString(4,cliente.getCpf());
				p.setString(5,cliente.getEmail());
								
				p.execute();			
		
		}catch(SQLException e) {
			e.printStackTrace();			
			return false;
		}		
		
		return true;
		
	} // fim do método addCliente.

	public List<Cliente> buscar(String busca){

		List<Cliente> list = new ArrayList<Cliente>();		
		String comando = "Select * from clientes";				
		Cliente cliente = null;
		
		try {			
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()){
				
				cliente= new Cliente();
				
				cliente.setId(rs.getInt("id"));
				cliente.setNome(rs.getString("nome"));				
				cliente.setTelefone(rs.getInt("telefone"));
				cliente.setEmail(rs.getString("email"));
				cliente.setCpf(rs.getString("cpf"));							
				
				list.add(cliente);
		}			
		
	} catch (SQLException e) {
		e.printStackTrace();
		
	}		
		return list;
	}// fim do método buscar;
	
	public Cliente buscaId(String id){		
		
		List<Cliente> list = new ArrayList<Cliente>();
	
			String comando="select clientes.id as clienteId, clientes.endereco_id, clientes.nome,clientes.telefone,clientes.cpf,clientes.email,endereco.id,endereco.rua," + 
			"endereco.bairro,endereco.cep,endereco.numero, endereco.complemento,endereco.cidade_id from clientes inner join endereco on endereco.id=clientes.endereco_id where clientes.id="+id;
		
		
		Cliente cliente = null;
		Endereco endereco = null;
		
		try {
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			if(rs.next()){
				
				cliente= new Cliente();
				endereco = new Endereco();
				
				cliente.setId(rs.getInt("clienteId"));
				cliente.setNome(rs.getString("nome"));				
				cliente.setTelefone(rs.getInt("telefone"));
				
				cliente.setEmail(rs.getString("email"));
				cliente.setCpf(rs.getString("cpf"));
				cliente.getEndereco().setIdEndereco(rs.getInt("endereco_id"));
				
				endereco.setBairro(rs.getString("bairro"));
				endereco.setCep(rs.getString("cep"));
				endereco.setCidadeId(rs.getInt("cidade_id"));
				
				endereco.setComplemento(rs.getString("complemento"));
				endereco.setNumero(rs.getInt("numero"));
				endereco.setRua(rs.getString("rua"));
				
				cliente.setEndereco(endereco);
				
		}			
		
	} catch (SQLException e) {
		e.printStackTrace();
		
	}
	
	return cliente;
	
	}	// fim do método buscaId





}
