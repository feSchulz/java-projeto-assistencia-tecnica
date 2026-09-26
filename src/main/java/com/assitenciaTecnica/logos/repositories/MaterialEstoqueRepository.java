package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.assitenciaTecnica.logos.model.MaterialEstoque;

public interface MaterialEstoqueRepository extends JpaRepository<MaterialEstoque, Long> {

    List<MaterialEstoque> findByNomeContainingIgnoreCase(String nome);

    Optional<MaterialEstoque> findByCodigo(String codigo);
}
