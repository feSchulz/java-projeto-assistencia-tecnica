package com.assitenciaTecnica.logos.data.dto;


import com.assitenciaTecnica.logos.model.Estado;

public class CidadeDTO {


	private Long id;

	private String cidade;


	private Estado estado;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public Estado getEstado() {
		return estado;
	}

	public void setEstado(Estado estado) {
		this.estado = estado;
	}
}