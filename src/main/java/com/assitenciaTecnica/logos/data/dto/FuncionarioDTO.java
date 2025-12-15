package com.assitenciaTecnica.logos.data.dto;

import com.assitenciaTecnica.logos.model.Endereco;
import com.assitenciaTecnica.logos.model.Papel;
import com.assitenciaTecnica.logos.model.Usuario;


public class FuncionarioDTO {

	private Long id;
	private String login;
	private String senha;
	private Usuario usuario;



	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}


}



