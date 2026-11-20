package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.assitenciaTecnica.logos.model.MaterialEstoque;

public interface MaterialEstoqueRepository extends JpaRepository<MaterialEstoque, Long> {

    List<MaterialEstoque> findByNomeContainingIgnoreCase(String nome);

    Optional<MaterialEstoque> findByCodigo(String codigo);

    @Query("select m from MaterialEstoque m where (m.ativo is null or m.ativo = true)")
    List<MaterialEstoque> findAllAtivos();

    // Busca paginada por nome ou código; abaixoMinimo = true mostra só os materiais
    // com estoque igual ou abaixo do mínimo cadastrado.
    @Query("select m from MaterialEstoque m where (m.ativo is null or m.ativo = true) "
            + "and (:q = '' or lower(m.nome) like lower(concat('%', :q, '%')) "
            + "or lower(m.codigo) like lower(concat('%', :q, '%'))) "
            + "and (:abaixoMinimo = false or (m.estoqueMinimo is not null "
            + "and m.quantidadeEstoque <= m.estoqueMinimo))")
    Page<MaterialEstoque> buscar(@Param("q") String q,
                                 @Param("abaixoMinimo") boolean abaixoMinimo,
                                 Pageable pageable);
}
