package com.assitenciaTecnica.logos.data.dto;

import java.util.List;
import com.assitenciaTecnica.logos.model.Equipamento;
import com.assitenciaTecnica.logos.model.Usuario;


public class ClienteDTO {
	private Long id;
	private Usuario pessoa;


	private List<Equipamento> equipamentos;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getPessoa() {
		return pessoa;
	}

	public void setPessoa(Usuario pessoa) {
		this.pessoa = pessoa;
	}

	public List<Equipamento> getEquipamentos() {
		return equipamentos;
	}

	public void setEquipamentos(List<Equipamento> equipamentos) {
		this.equipamentos = equipamentos;
	}
}
