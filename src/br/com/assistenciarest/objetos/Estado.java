package br.com.assistenciarest.objetos;
import java.io.Serializable;

public class Estado {
	
	private static final long serialVersionUID = 1L;
	
	private String estado;
	private int id;
	
	public String getEstado() {
		return estado;
	}
	
	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}	
}
