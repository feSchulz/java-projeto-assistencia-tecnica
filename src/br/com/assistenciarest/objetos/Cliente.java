package br.com.assistenciarest.objetos;
import java.io.Serializable;

public class Cliente {

	private static final long serialVersionUID = 1L;
	
	private String nome;
	private int telefone;
	private String cpf;
	private String email;
	private Endereco endereco;
	
	private int id;	

	public String getNome() {
		return nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public int getTelefone() {
		return telefone;
	}
	
	public void setTelefone(int telefone) {
		this.telefone = telefone;
	}
	
	public String getCpf() {
		return cpf;
	}
	
	public void setCpf(String cpf) {
		this.cpf = cpf;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public Endereco getEndereco() {
		return endereco;
	}
	
	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	
	
	
}
