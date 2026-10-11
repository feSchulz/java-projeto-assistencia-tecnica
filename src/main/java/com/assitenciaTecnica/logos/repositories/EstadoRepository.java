package com.assitenciaTecnica.logos.repositories;

import com.assitenciaTecnica.logos.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoRepository extends JpaRepository<Estado, Long> {

    // Cidade não tem referência de volta para Estado (só Estado -> cidades),
    // então o estado de uma cidade é achado por aqui.
    Optional<Estado> findByCidades_Id(Long cidadeId);

}