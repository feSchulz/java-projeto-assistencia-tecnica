package br.com.assistenciarest.objetos;
import java.io.Serializable;
public class Marca implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private String marca;
	private int id;
	
	
	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}	
}
