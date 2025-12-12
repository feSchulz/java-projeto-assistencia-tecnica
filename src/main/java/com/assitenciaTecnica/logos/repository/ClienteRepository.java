package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByPessoaNomeContainingIgnoreCase(String nome);
}