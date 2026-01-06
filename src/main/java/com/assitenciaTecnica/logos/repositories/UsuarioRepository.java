package com.assitenciaTecnica.logos.repositories;

import com.assitenciaTecnica.logos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {


}