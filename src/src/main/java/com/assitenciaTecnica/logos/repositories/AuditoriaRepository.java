package com.assitenciaTecnica.logos.repositories;

import com.assitenciaTecnica.logos.model.AuditoriaLog;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditoriaRepository extends JpaRepository<AuditoriaLog, Long> {

    // entidade = "" mostra todas; q procura no login do usuário e no caminho da requisição.
    @Query("select a from AuditoriaLog a where (:entidade = '' or a.entidade = :entidade) "
            + "and (:q = '' or lower(a.usuarioLogin) like lower(concat('%', :q, '%')) "
            + "or lower(a.caminho) like lower(concat('%', :q, '%')))")
    Page<AuditoriaLog> buscar(@Param("entidade") String entidade, @Param("q") String q, Pageable pageable);

    @Query("select distinct a.entidade from AuditoriaLog a order by a.entidade")
    List<String> listarEntidades();
}
