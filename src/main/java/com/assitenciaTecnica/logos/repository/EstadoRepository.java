package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EstadoRepository extends JpaRepository<Estado, Long> {

   List<Estado> findByNomeContainingIgnoreCase(String nome);
    boolean existsByNome(String nome);
}