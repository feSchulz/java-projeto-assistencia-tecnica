package com.assitenciaTecnica.logos.data.dto;

import java.util.List;
import com.assitenciaTecnica.logos.model.Cidade;


public class EstadoDTO {

	private Long id;
	private String estado;
	private List<Cidade> cidades;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public List<Cidade> getCidades() {
		return cidades;
	}

	public void setCidades(List<Cidade> cidades) {
		this.cidades = cidades;
	}
}
