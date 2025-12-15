package com.assitenciaTecnica.logos.repository;


import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.model.Papel;

public interface PapelRepository extends JpaRepository<Papel, Long> {

    Papel findByCodigo(String codigo);

}