package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    List<Equipamento> findByModeloId(Long modeloId);
}