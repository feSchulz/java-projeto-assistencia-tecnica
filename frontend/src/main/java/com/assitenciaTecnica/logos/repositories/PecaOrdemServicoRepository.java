package com.assitenciaTecnica.logos.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.assitenciaTecnica.logos.model.PecaOrdemServico;

public interface PecaOrdemServicoRepository extends JpaRepository<PecaOrdemServico, Long> {

    List<PecaOrdemServico> findByOrdemServico_Id(Long ordemServicoId);
}
