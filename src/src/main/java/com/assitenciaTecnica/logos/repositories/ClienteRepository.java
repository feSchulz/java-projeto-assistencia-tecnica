package com.assitenciaTecnica.logos.repositories;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.assitenciaTecnica.logos.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByUsuario_NomeIgnoreCase(String nome);

    // Só clientes ativos (ativo null = cadastros antigos, também ativos).
    @Query("select c from Cliente c where (c.ativo is null or c.ativo = true)")
    List<Cliente> findAllAtivos();

    // Busca paginada por nome, e-mail, CPF ou telefone (digitos = só números do texto buscado).
    @Query("select c from Cliente c where (c.ativo is null or c.ativo = true) "
            + "and (:q = '' or lower(c.usuario.nome) like lower(concat('%', :q, '%')) "
            + "or lower(c.usuario.email) like lower(concat('%', :q, '%')) "
            + "or (:digitos <> '' and (c.usuario.cpf like concat('%', :digitos, '%') "
            + "or c.usuario.telefone like concat('%', :digitos, '%'))))")
    Page<Cliente> buscar(@Param("q") String q, @Param("digitos") String digitos, Pageable pageable);
}
