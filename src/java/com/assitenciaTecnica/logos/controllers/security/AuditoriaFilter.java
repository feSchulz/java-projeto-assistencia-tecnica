package com.assitenciaTecnica.logos.controllers.security;

import com.assitenciaTecnica.logos.model.AuditoriaLog;
import com.assitenciaTecnica.logos.repositories.AuditoriaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Log de auditoria: depois de cada requisição de escrita (POST, PUT, PATCH, DELETE) em
 * /api/**, grava quem fez, o que (criar/editar/excluir), em qual recurso e registro, e o
 * status HTTP da resposta. Não guarda o corpo da requisição (evita gravar senhas).
 *
 * Como este filtro é um @Component comum, ele roda depois do Spring Security, então o
 * usuário autenticado (login do token) já está disponível. Uma falha ao gravar o log
 * nunca atrapalha a requisição.
 */
@Component
public class AuditoriaFilter extends OncePerRequestFilter {

    private static final Set<String> METODOS_DE_ESCRITA = Set.of("POST", "PUT", "PATCH", "DELETE");

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaFilter(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } finally {
            registrar(request, response);
        }
    }

    private void registrar(HttpServletRequest request, HttpServletResponse response) {
        try {
            String metodo = request.getMethod();
            String caminho = request.getRequestURI();

            if (!METODOS_DE_ESCRITA.contains(metodo) || caminho == null || !caminho.startsWith("/api/")) {
                return;
            }
            // login/logout não são alterações de dados; a própria consulta do log não se registra.
            if (caminho.startsWith("/api/auth/v1/login") || caminho.startsWith("/api/auth/v1/logout")
                    || caminho.startsWith("/api/auditoria/")) {
                return;
            }

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
                return;
            }

            String[] partes = caminho.split("/"); // ["", "api", "<recurso>", "v1", "<id>", ...]
            if (partes.length < 3) return;

            AuditoriaLog log = new AuditoriaLog();
            log.setDataHora(LocalDateTime.now());
            log.setUsuarioLogin(auth.getName());
            log.setMetodo(metodo);
            log.setCaminho(caminho.length() > 300 ? caminho.substring(0, 300) : caminho);
            log.setEntidade(partes[2]);
            log.setStatusHttp(response.getStatus());
            log.setAcao(switch (metodo) {
                case "POST" -> "CRIAR";
                case "DELETE" -> "EXCLUIR";
                default -> "EDITAR";
            });

            for (int i = 4; i < partes.length; i++) {
                if (partes[i].matches("\\d{1,18}")) {
                    log.setRegistroId(Long.parseLong(partes[i]));
                    break;
                }
            }

            auditoriaRepository.save(log);
        } catch (Exception e) {
            logger.warn("Não foi possível gravar o log de auditoria: " + e.getMessage());
        }
    }
}
