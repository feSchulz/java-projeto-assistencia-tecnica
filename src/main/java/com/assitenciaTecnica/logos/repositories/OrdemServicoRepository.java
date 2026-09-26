package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.assitenciaTecnica.logos.model.OrdemServico;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico,Long> {

    List<OrdemServico> findByCliente_Id(Long clienteId);

    List<OrdemServico> findByStatus(Long status);
}
