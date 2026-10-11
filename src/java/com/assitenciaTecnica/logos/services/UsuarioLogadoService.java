package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Quem está fazendo a requisição atual. O login vem do token JWT já validado
 * (ver JwtAuthenticationFilter); o nome é buscado no cadastro do funcionário.
 */
@Service
public class UsuarioLogadoService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public String login() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return auth.getName();
    }

    public String nome() {
        String login = login();
        if (login == null) return null;
        return funcionarioRepository.findByLogin(login)
                .map(f -> f.getUsuario() != null ? f.getUsuario().getNome() : null)
                .orElse(login);
    }
}
