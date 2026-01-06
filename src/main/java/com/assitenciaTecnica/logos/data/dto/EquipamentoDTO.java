package com.assitenciaTecnica.logos.data.dto;

import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.model.Modelo;


public class EquipamentoDTO {
	private Long id;
	private String equipamento;
	private Marca marca;
	private Modelo modelo;
	private Cliente cliente;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEquipamento() {
		return equipamento;
	}

	public void setEquipamento(String equipamento) {
		this.equipamento = equipamento;
	}

	public Modelo getModelo() {
		return modelo;
	}

	public void setModelo(Modelo modelo) {
		this.modelo = modelo;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Marca getMarca() {
		return marca;
	}

	public void setMarca(Marca marca) {
		this.marca = marca;
	}
}
