package com.assitenciaTecnica.logos.repository;


import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.assitenciaTecnica.logos.model.Papel;

public interface PapelRepository extends JpaRepository<Papel, Long> {


    Optional<Papel> findByCodigo(String codigo);
    List<Papel> findByNomeContainingIgnoreCase(String nome);
    boolean existsByCodigo(String codigo);
    boolean existsByNome(String nome);
}