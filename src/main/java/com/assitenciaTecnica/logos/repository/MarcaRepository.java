package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarcaRepository extends JpaRepository<Marca, Long> {

    List<Marca> findByNome(String nome);

}