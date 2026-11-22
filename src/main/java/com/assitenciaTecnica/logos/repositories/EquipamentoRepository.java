package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.assitenciaTecnica.logos.model.Equipamento;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {

    List<Equipamento> findByCliente_Id(Long clienteId);

    @Query("select e from Equipamento e where (e.ativo is null or e.ativo = true)")
    List<Equipamento> findAllAtivos();

    // Busca paginada por equipamento, marca, modelo ou nome do cliente.
    @Query("select e from Equipamento e where (e.ativo is null or e.ativo = true) "
            + "and (:q = '' or lower(e.equipamento) like lower(concat('%', :q, '%')) "
            + "or lower(e.marca.nome) like lower(concat('%', :q, '%')) "
            + "or lower(e.modelo.nome) like lower(concat('%', :q, '%')) "
            + "or lower(e.cliente.usuario.nome) like lower(concat('%', :q, '%')))")
    Page<Equipamento> buscar(@Param("q") String q, Pageable pageable);
}
