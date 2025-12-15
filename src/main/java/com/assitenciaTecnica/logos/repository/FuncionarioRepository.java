package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    List<Funcionario> findByUsuario_NomeIgnoreCase(String nome);

}