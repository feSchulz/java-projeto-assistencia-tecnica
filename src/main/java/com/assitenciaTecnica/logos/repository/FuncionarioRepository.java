package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Optional<Funcionario> findByLogin(String login);

    List<Funcionario> findByUsuarioNomeContainingIgnoreCase(String nome);

    boolean existsByLogin(String login);

    boolean existsByUsuarioCpf(String cpf);

    boolean existsByUsuarioEmail(String email);
}