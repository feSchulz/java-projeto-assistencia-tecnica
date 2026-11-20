package com.assitenciaTecnica.logos.repositories;

import com.assitenciaTecnica.logos.model.HistoricoStatusOS;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatusOS, Long> {

    List<HistoricoStatusOS> findByOrdemServicoIdOrderByDataHoraDescIdDesc(Long ordemServicoId);

    void deleteByOrdemServicoId(Long ordemServicoId);
}
