package br.com.assistenciarest.jdbcinterface;
import java.util.List;

import br.com.assistenciarest.objetos.Marca;

public interface MarcaDAO {

	public boolean inserirMarca(Marca equipamento);
	public List<Marca> buscarMarca(String nomeMarca);
	public List<Marca> buscarMarcaID (int id);
	public boolean atualizaMarca(Marca marca);
	public boolean deletarMarca(int id);
	
}
