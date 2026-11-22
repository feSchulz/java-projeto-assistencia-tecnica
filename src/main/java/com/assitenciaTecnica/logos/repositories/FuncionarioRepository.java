package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.assitenciaTecnica.logos.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    List<Funcionario> findByUsuario_NomeIgnoreCase(String nome);
    Optional<Funcionario> findByLogin(String login);

    @Query("select f from Funcionario f where (f.ativo is null or f.ativo = true)")
    List<Funcionario> findAllAtivos();
}
