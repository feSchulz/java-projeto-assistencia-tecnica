package com.assitenciaTecnica.logos.repositories;

import java.util.GregorianCalendar;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.assitenciaTecnica.logos.model.OrdemServico;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico,Long> {

    List<OrdemServico> findByCliente_Id(Long clienteId);

    List<OrdemServico> findByStatus(Long status);

    List<OrdemServico> findByEquipamento_IdAndStatus(Long equipamentoId, Long status);

    boolean existsByCliente_Id(Long clienteId);

    boolean existsByEquipamento_Id(Long equipamentoId);

    boolean existsByFuncionarioResponsavel_Id(Long funcionarioId);

    // Lista paginada com filtro de status (status < 0 = todos) e busca por
    // número da OS, nome do cliente ou nome do equipamento (q = "" = sem busca).
    // Os parâmetros nunca são null de propósito (o SQL Server reclama de
    // parâmetros nulos sem tipo definido em "is null").
    // atrasadas = true mostra só as OS com prazo vencido que ainda não foram
    // concluídas (2) nem canceladas (3).
    @Query("select o from OrdemServico o where (:status < 0 or o.status = :status) "
            + "and (:q = '' or cast(o.id as string) like concat('%', :q, '%') "
            + "or lower(o.cliente.usuario.nome) like lower(concat('%', :q, '%')) "
            + "or lower(o.equipamento.equipamento) like lower(concat('%', :q, '%'))) "
            + "and (:atrasadas = false or (o.prazoConclusao < :agora and o.status not in (2, 3)))")
    Page<OrdemServico> buscar(@Param("status") long status, @Param("q") String q,
                              @Param("atrasadas") boolean atrasadas,
                              @Param("agora") GregorianCalendar agora, Pageable pageable);
}
