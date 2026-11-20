package com.assitenciaTecnica.logos.data.dto;

import java.util.List;
import com.assitenciaTecnica.logos.model.Cidade;


public class EstadoDTO {

	private Long id;
	private String nome;
	private List<Cidade> cidades;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public List<Cidade> getCidades() {
		return cidades;
	}

	public void setCidades(List<Cidade> cidades) {
		this.cidades = cidades;
	}
}
