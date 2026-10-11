package com.assitenciaTecnica.logos.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import com.assitenciaTecnica.logos.model.Papel;

public interface PapelRepository extends JpaRepository<Papel, Long> {

    Papel findByCodigo(String codigo);

}