package br.com.assistenciarest.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.mysql.jdbc.Statement;

import br.com.assistenciarest.jdbcinterface.EnderecoDAO;
import br.com.assistenciarest.objetos.Estado;
import br.com.assistenciarest.objetos.Funcionario;

import br.com.assistenciarest.objetos.Cidade;
import br.com.assistenciarest.objetos.Cliente;
import br.com.assistenciarest.objetos.Endereco;

public class JDBCEnderecoDAO  implements EnderecoDAO {
	private Connection conexao;
	
	public JDBCEnderecoDAO (Connection conexao) {
		this.conexao=conexao;
	}
	
	public List<Estado> buscarEstado(String estado){
		
		List<Estado>listaEstado=new ArrayList<Estado>();
		String comando="SELECT * FROM estado";
		Estado endereco=null;
		
		try {	
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()) {
				endereco = new Estado();
				endereco.setEstado((rs.getString("nome")));
				endereco.setId(rs.getInt("id"));
				
				listaEstado.add(endereco);
			};			
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return listaEstado;	
		
	} // fim do método buscarEstado;
	
	public List<Cidade> buscarCidade(int estado){
	
		List<Cidade>listaCidade=new ArrayList<Cidade>();
		
		String comando="SELECT id,nome FROM cidade where id_estado="+estado;
		Cidade cidade=null;
		
		try {	
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()) {
				cidade = new Cidade();
				cidade.setCidade((rs.getString("nome")));
				cidade.setId(rs.getInt("id"));
				
				listaCidade.add(cidade);
			};			
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return listaCidade;		
		
}// fim do método buscarCidade;
	
	public Estado buscarEstadoID(int idCidade){
		Estado estado = new Estado();		
		String comando="SELECT id_estado FROM cidade where id=" + idCidade;
				
		try {
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()){				
				estado.setId(rs.getInt("id_estado"));			
			}	
			
		} catch (SQLException e) {
			e.printStackTrace();
		}		
		
		return estado;		
	}	
	
	public Endereco addendereco (Endereco endereco) {
		
		String comando="INSERT INTO endereco (cidade_id,rua,numero,bairro,cep,complemento) VALUES(?,?,?,?,?,?)";
		boolean teste = true;
		
		PreparedStatement p;
		
		try {								
				p = this.conexao.prepareStatement(comando);
				
				p.setInt(1,endereco.getCidadeId());
				p.setString(2,endereco.getRua());
				p.setInt(3,endereco.getNumero());
				
				p.setString(4,endereco.getBairro());
				p.setString(5,endereco.getCep());
				p.setString(6,endereco.getComplemento());
				
				p.execute();				
				
			}catch(SQLException e) {
				e.printStackTrace();
				teste=false;		
			}
		
			if(teste) {
				
				comando="SELECT id FROM endereco where id=last_insert_id()";
				
				try {
					
				java.sql.Statement stmt =conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);
				
				if(rs.next()) {	
					
					endereco.setIdEndereco(rs.getInt("id"));
				};				
				
				} catch (SQLException e) {
					e.printStackTrace();					
				}				
			}
			
	return 	endereco;	
	
}// fim do método addendereco


	public boolean deletar(String idendereco) {		
		
		if(idendereco!=null) {
		
			PreparedStatement p;		
			String comando="DELETE from endereco where id="+idendereco;			
			
			try {			
				p=this.conexao.prepareStatement(comando);
				p.execute(comando);		
				
			} catch (SQLException e) {
				e.printStackTrace();
				return false;		
			}
			
			return true;
		
		}else{			
			return false;
		}
	}
		
	 // fim do método deletar	

	public String buscarIdEndereco (int id){ // pegar o id do endereco na tabela funcionario
			
			String comando="select endereco_id from funcionario where id="+id;		
			String idEndereco="";
			
			try {
				java.sql.Statement stmt =conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);
							
				if(rs.next()) {		
					idEndereco=(rs.getString("endereco_id"));		
				}
				
			}catch (SQLException e) {
				e.printStackTrace();
			}
			
			if(idEndereco.equals("")) {
				idEndereco=null;
			}
			
			return idEndereco;
	}	

	public boolean updateEndereco(Endereco endereco) {
		
		
		int idCidade=endereco.getCidadeId();
		String rua=endereco.getRua();
		int numero=endereco.getNumero();
		String bairro = endereco.getBairro();
		String cep=endereco.getCep();
		String complemento= endereco.getComplemento();
		int id = endereco.getIdEndereco();
		
		String	comando="UPDATE endereco set cidade_id="+idCidade+", rua='"+rua+"', numero="+numero+", bairro='"+bairro+"', cep= '"+cep+"', complemento='"+complemento+"' Where id = "+id;
		PreparedStatement p; 	
		
		try {			
			p=this.conexao.prepareStatement(comando);
			p.execute();
		
		} catch (SQLException e) {
			e.printStackTrace();
		
			return false;		
		}		
		
		return true;
	}// fim do método updateEndereco	
	
	
	

}
