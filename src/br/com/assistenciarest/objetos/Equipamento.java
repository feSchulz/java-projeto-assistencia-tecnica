package br.com.assistenciarest.objetos;

import java.io.Serializable;

public class Equipamento implements Serializable{
	
	private static final long serialVersionUID = 1L;
		
	private String equipamento;	
	private String modelo;
	private int Idmodelo;
	private Marca marca;
	
	
	public String getEquipamento() {
		return equipamento;
	}
	
	public void setEquipamento(String equipamento) {
		this.equipamento = equipamento;
	}
	
	public String getModelo() {
		return modelo;
	}
	
	public void setModelo(String modelo) {
		this.modelo = modelo;
	}

	public Marca getMarca() {
		return marca;
	}

	public void setMarca(Marca marca) {
		this.marca = marca;
	}

	public int getIdmodelo() {
		return Idmodelo;
	}

	public void setIdmodelo(int idmodelo) {
		Idmodelo = idmodelo;
	}	
}
