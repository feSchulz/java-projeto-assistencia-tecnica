package br.com.assistenciarest.jdbc;

import br.com.assistenciarest.jdbcinterface.EquipamentoDAO;
import br.com.assistenciarest.objetos.Equipamento;
import br.com.assistenciarest.objetos.Marca;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.mysql.jdbc.Statement;

public class JDBCEquipamentoDAO implements EquipamentoDAO {
	
	private Connection conexao;
	
	public JDBCEquipamentoDAO (Connection conexao) {
		this.conexao=conexao;
	}
	
	public boolean inserir(Equipamento equipamento) {		
		
		String comando ="INSERT INTO modelos"+"(marca_id,tipo_equipamento,modelo) "+"VALUES (?,?,?)";
		PreparedStatement p;
		
		try{
			
			p=this.conexao.prepareStatement(comando);
			
			p.setInt(1,(equipamento.getMarca().getId()));
			p.setString(2,equipamento.getEquipamento());
			p.setString(3,equipamento.getModelo());
			
			p.execute();
			
		}catch (Exception e) {
			e.printStackTrace();
			
			return false;
		}
		return true;	
	}// fim do método 
	
	public List<Equipamento> buscaEquipamento(Equipamento equip){
		
		// Neste método é feita uma busca especifica porque eu tenho as duas informações 
		// marca e tipo de equipamento(notebook ou smartphone).
		
		String comando = "select marca.nome, modelos.id, modelos.marca_id, modelos.tipo_equipamento,"
				+ "modelos.modelo from marca inner join modelos on marca.id=modelos.marca_id "
				+ "where marca.id="+equip.getMarca().getId()+" and modelos.modelo like '"+equip.getModelo()+"%'";
				
		List<Equipamento> list = new ArrayList<Equipamento>();
		Equipamento equipam = null;
		Marca marca = null;
		
		try {
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()) {
				equipam = new Equipamento();
				marca = new Marca();
				
				equipam.setEquipamento(rs.getString("tipo_equipamento")); // tipo de equipamento 0 para notebook e 1 para Smartphone;
				equipam.setModelo(rs.getString("modelo"));                // nome do modelo;
				marca.setMarca(rs.getString("nome"));                     // nome da marca;
				equipam.setIdmodelo(rs.getInt("id"));				      // id do modelo;
				
				equipam.setMarca(marca);
				
				list.add(equipam);
			}
			
		}catch (SQLException e){
				e.printStackTrace();
		}	
		
		return list; 
	}// fim do método buscar
	
	public List<Equipamento> busca(String id) {
		
		String comando="";		
		
		if(id.equals("null")) {
			
			comando = "select marca.nome as marca, modelos.id, modelos.marca_id, modelos.tipo_equipamento,"
					   + "modelos.modelo from marca inner join modelos on marca.id=modelos.marca_id";
			
		}else {			
			comando = "select marca.nome as marca, modelos.id, modelos.marca_id, modelos.tipo_equipamento,"
					   + "modelos.modelo from marca inner join modelos on marca.id=modelos.marca_id where modelos.id="+id;
		};	
				
		List<Equipamento> list = new ArrayList<Equipamento>();
		Equipamento equipam = null;
		Marca marca = null;
		
		try {
			
			java.sql.Statement stmt =conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while(rs.next()) {
				equipam = new Equipamento();
				marca = new Marca();
				
				equipam.setEquipamento(rs.getString("tipo_equipamento")); // tipo de equipamento 0 para notebook e 1 para Smartphone;
				equipam.setModelo(rs.getString("modelo"));                // nome do modelo;
				marca.setMarca(rs.getString("marca"));					  // nome da marca;
				marca.setId(rs.getInt("marca_id"));   					  // id da marca;
				equipam.setIdmodelo(rs.getInt("id"));				      // id do modelo;
				
				equipam.setMarca(marca);
				
				list.add(equipam);
			}
			
		}catch (SQLException e){
				e.printStackTrace();
		}	
		
		return list; 
	}// fim do método buscar
	
	public boolean atualizar(Equipamento equip) {
	
		String	comando="UPDATE modelos set marca_id='"+equip.getMarca().getId()+"',tipo_equipamento='"+equip.getEquipamento()+"', modelo='"+equip.getModelo()+"' Where id="+equip.getIdmodelo();
		PreparedStatement p;
		
		try {			
			
			p=this.conexao.prepareStatement(comando);		
			p.execute();
			
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		
		return true;		
		
	} // fim do método atualizar
	
	
	public boolean deletar (int id) {
		
		String comando="DELETE from modelos where id="+id;
		PreparedStatement p;		
		
		try {			
			p=this.conexao.prepareStatement(comando);
			p.execute(comando);		
			
		} catch (SQLException e) {
			e.printStackTrace();
			
			return false;
			
		}
		return true;		
	}
}