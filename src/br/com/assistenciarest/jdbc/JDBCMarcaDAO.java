package br.com.assistenciarest.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.mysql.jdbc.Statement;

import br.com.assistenciarest.objetos.Marca;
import br.com.assistenciarest.jdbcinterface.MarcaDAO;

public class JDBCMarcaDAO implements MarcaDAO{
	private Connection conexao;
	
	public JDBCMarcaDAO(Connection conexao) {
		this.conexao=conexao;
	}
	
	public boolean inserirMarca(Marca marca) {
		
		String comando="INSERT INTO marca"+"(nome) "+"VALUES (?)";
		PreparedStatement p;
		
		try{
			p=this.conexao.prepareStatement(comando);
			p.setString(1,marca.getMarca());
			p.execute();
			
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}//fim do matodo inserirMarca;  **************************************
	
	public List<Marca> buscarMarca (String nomeMarca){
		
		String comando="SELECT * FROM marca";			 
		
		 if(!nomeMarca.equals("") && !nomeMarca.equals("null")) {
			comando+=" where nome like'%"+nomeMarca+"%'";		
		}
		 
		List<Marca>listmarcas = new ArrayList<Marca>();		
		Marca marca = null;
		
		try {			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()) {
				marca = new Marca();
				marca.setMarca(rs.getString("nome"));
				marca.setId(rs.getInt("id"));
				
				listmarcas.add(marca);
			}
			
		}catch (SQLException e){
				e.printStackTrace();
		}
		return listmarcas;
			
	}//fim do método buscarMarca; **************************************
	
public List<Marca> buscarMarcaID (int id){
		
		List<Marca>listmarcas = new ArrayList<Marca>();		
		String comando="SELECT * FROM marca where id= "+id;		 
		
		Marca marca = null;	
		
		try {
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			if(rs.next()) {
				
				marca = new Marca();
				
				marca.setMarca(rs.getString("nome"));
				marca.setId(rs.getInt("id"));
				
				listmarcas.add(marca);
			}
			
		}catch (SQLException e){
				e.printStackTrace();
		}
		
		return listmarcas;
			
}// fim do método buscarMarcaID; ************************************** 
		
	public boolean atualizaMarca(Marca marca){
		
		String	comando="UPDATE marca set nome='"+marca.getMarca()+"'Where id="+marca.getId();
		PreparedStatement p;
		
		try {			
			
			p=this.conexao.prepareStatement(comando);		
			p.execute();
			
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		
		return true;		
	}//fim do método atualizaMarca; **************************************
	
	public boolean deletarMarca(int id){
		
		String comando="DELETE from marca where id="+id;
		PreparedStatement p;		
		
		try {			
			p=this.conexao.prepareStatement(comando);
			p.execute(comando);		
			
		} catch (SQLException e) {
			e.printStackTrace();
			
			return false;
			
		}
		return true;
		
	}//fim do método deletarMarca; **************************************
	
}// fim da classe JDBCMarcaDAO