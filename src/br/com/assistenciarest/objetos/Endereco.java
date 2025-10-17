package br.com.assistenciarest.objetos;
import java.io.Serializable;

public class Endereco {
	
	private static final long serialVersionUID = 1L;
	
	private String rua;
	private int numero;
	private String bairro;
	private int cidadeId;
	private String complemento;
	private String cep;
	private int idEndereco;
	
	
	public String getRua() {
		return rua;
	}
	
	public void setRua(String rua){		
		this.rua = rua;
	}
	
	public int getNumero() {
		return numero;
	}
	
	public void setNumero(int numero) {
		this.numero = numero;
	}
	
	public String getBairro() {
		return bairro;
	}
	
	public void setBairro(String bairro) {
		this.bairro = bairro;
	}
	
	public int getCidadeId() {
		return cidadeId;
	}

	public void setCidadeId(int cidadeId) {
		this.cidadeId = cidadeId;
	}

	public String getComplemento() {
		return complemento;
	}
	
	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}
	
	public String getCep() {
		return cep;
	}
	
	public void setCep(String cep) {
		this.cep = cep;
	}

	public int getIdEndereco() {
		return idEndereco;
	}

	public void setIdEndereco(int idEndereco) {
		this.idEndereco = idEndereco;
	}
	
	
	
	
	
	
}
