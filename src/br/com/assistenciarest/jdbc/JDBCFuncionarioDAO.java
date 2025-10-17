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


public class JDBCFuncionarioDAO {

	private Connection conexao;
	
	public JDBCFuncionarioDAO(Connection conexao) {
		this.conexao=conexao;		
	}
	
	public boolean addfuncionario(Funcionario func){
		
		String comando="INSERT INTO funcionario (endereco_id,nome,telefone,cpf,email,nivel_acesso,login,senha) VALUES(?,?,?,?,?,?,?,?)";	
		
		try {			
			
			PreparedStatement p;
			
				p = this.conexao.prepareStatement(comando);
				
				p.setInt(1,func.getEndereco().getIdEndereco());
				p.setString(2,func.getNome());
				p.setInt(3,func.getTelefone());
				
				p.setString(4,func.getCpf());
				p.setString(5,func.getEmail());
				p.setInt(6,func.getFuncao());
				
				p.setString(7,func.getLogin());
				p.setString(8,func.getSenha());
				
				p.execute();			
		
		}catch(SQLException e) {
			e.printStackTrace();			
			return false;
		}
		
		return true;
		
	}// fim do método addFuncionario
	
	public List<Funcionario> buscar(String nome){
		
		String comando="select id,nome,telefone,cpf,login from funcionario";
		
		if(!nome.equals("") && !nome.equals("null")) {
			comando+=" where nome like'%"+nome+"%'";		
		}
		 
		List<Funcionario>lista = new ArrayList<Funcionario>();		
		Funcionario funcionario = null;
		
		try {
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()){
				
				funcionario=new Funcionario();
				
				funcionario.setId(rs.getInt("id"));
				funcionario.setNome(rs.getString("nome"));				
				funcionario.setTelefone(rs.getInt("telefone"));
				
				funcionario.setCpf(rs.getString("cpf"));
				funcionario.setLogin(rs.getString("login"));
							
				lista.add(funcionario);
			}			
			
		} catch (SQLException e) {
			e.printStackTrace();
			
		}
		
		return lista;		
	}// fim do método buscar
	
	public boolean deletar (int idfunc) {		
		
			String comando="DELETE from funcionario where id="+idfunc;
			PreparedStatement p;
			
			try {
				
				p=this.conexao.prepareStatement(comando);
				p.execute(comando);		
				
			}catch (SQLException e) {
				e.printStackTrace();
				
				return false;				
			}
		
			return true;
	}// fim do método deletar

	public Funcionario buscarFuncionario(int idFuncionario){
		
	String comando="select funcionario.id as idFunc, funcionario.endereco_id, funcionario.nome,funcionario.login, funcionario.telefone, funcionario.cpf, funcionario.email, funcionario.nivel_acesso, "
					+ "endereco.cidade_id, endereco.rua, endereco.numero, endereco.bairro, endereco.cep, endereco.complemento from funcionario inner join endereco on "
					+ "funcionario.endereco_id=endereco.id where funcionario.id="+idFuncionario;
			
	Funcionario funcionario = null;
	Endereco endereco=null;
	
	try {
		
		java.sql.Statement stmt =conexao.createStatement();
		ResultSet rs = stmt.executeQuery(comando);	
		
		if(rs.next()){
			
			endereco= new Endereco();
			funcionario=new Funcionario();
			
			funcionario.setId(rs.getInt("idFunc"));			
			funcionario.setIdEndereco(rs.getInt("endereco_id"));
			funcionario.setNome(rs.getString("nome"));
			
			funcionario.setTelefone(rs.getInt("telefone"));
			funcionario.setCpf(rs.getString("cpf"));
			funcionario.setEmail(rs.getString("email"));
			
			funcionario.setLogin(rs.getString("login"));
			funcionario.setFuncao(rs.getInt("nivel_acesso"));			
			endereco.setCidadeId(rs.getInt("cidade_id"));
			
			endereco.setRua(rs.getString("rua"));
			endereco.setNumero(rs.getInt("numero"));
			endereco.setBairro(rs.getString("bairro"));	
			
			endereco.setCep(rs.getString("cep"));			
			endereco.setComplemento(rs.getString("complemento"));		
			funcionario.setEndereco(endereco);
		}			
		
	} catch (SQLException e) {
		e.printStackTrace();		
	}
	
	
	
	return funcionario;	
		
	}

	public boolean updateFuncionario(Funcionario funcionario) {
		
		
		String	comando="UPDATE funcionario set nome=?,  telefone=?,  cpf=?,  email=?, nivel_acesso=?,login=?";
		PreparedStatement p;   
				
	if(funcionario.getSenha()!=null || !funcionario.getSenha().equals("")) {
			
			comando+=",senha=? Where id="+funcionario.getId();
		}else {
			comando+="Where id="+funcionario.getId();
		}
		
		try {
			
			p=this.conexao.prepareStatement(comando);
			
			p.setString(1,funcionario.getNome());
			p.setInt(2,funcionario.getTelefone());
			p.setString(3,funcionario.getCpf());
			
			p.setString(4,funcionario.getEmail());
			p.setInt(5,funcionario.getFuncao());
			p.setString(6,funcionario.getLogin());
			
			if(funcionario.getSenha()!=null || !funcionario.getSenha().equals("")) {			
				
				p.setString(7,funcionario.getSenha());
			
			}
			
			p.execute();
			
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	
}
