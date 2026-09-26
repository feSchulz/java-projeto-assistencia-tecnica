package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import com.assitenciaTecnica.logos.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {

    List<Equipamento> findByCliente_Id(Long clienteId);

}