package com.assitenciaTecnica.logos.data.dto;

import java.util.List;
import com.assitenciaTecnica.logos.model.Modelo;


public class MarcaDTO {

	private Long id;
	private String nome;
	private List<Modelo> modelos;
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
	public List<Modelo> getModelos() {
		return modelos;
	}
	public void setModelos(List<Modelo> modelos) {
		this.modelos = modelos;
	}
}

