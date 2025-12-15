package com.assitenciaTecnica.logos.repository;

import com.assitenciaTecnica.logos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {


}