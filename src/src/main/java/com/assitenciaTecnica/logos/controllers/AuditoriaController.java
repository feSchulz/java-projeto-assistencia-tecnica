package com.assitenciaTecnica.logos.controllers;

import com.assitenciaTecnica.logos.data.dto.AuditoriaDTO;
import com.assitenciaTecnica.logos.data.dto.PaginaDTO;
import com.assitenciaTecnica.logos.model.AuditoriaLog;
import com.assitenciaTecnica.logos.repositories.AuditoriaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Consulta do log de auditoria. Só o administrador acessa (ver SecurityFilterChain). */
@RestController
@RequestMapping("/api/auditoria/v1")
public class AuditoriaController {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    // ?page=0&size=20&q=login ou caminho&entidade=clientes
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PaginaDTO<AuditoriaDTO>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "") String entidade) {
        try {
            PageRequest pageable = PageRequest.of(
                    PaginaDTO.paginaSegura(page), PaginaDTO.tamanhoSeguro(size),
                    Sort.by(Sort.Direction.DESC, "dataHora").and(Sort.by(Sort.Direction.DESC, "id")));
            Page<AuditoriaLog> resultado = auditoriaRepository.buscar(
                    PaginaDTO.textoBusca(entidade), PaginaDTO.textoBusca(q), pageable);
            return ResponseEntity.ok(PaginaDTO.de(resultado,
                    resultado.getContent().stream().map(AuditoriaController::paraDto).toList()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Recursos que já aparecem no log (para o filtro da tela).
    @GetMapping(value = "/entidades", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> entidades() {
        try {
            return ResponseEntity.ok(auditoriaRepository.listarEntidades());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private static AuditoriaDTO paraDto(AuditoriaLog log) {
        AuditoriaDTO dto = new AuditoriaDTO();
        dto.setId(log.getId());
        dto.setDataHora(log.getDataHora());
        dto.setUsuarioLogin(log.getUsuarioLogin());
        dto.setAcao(log.getAcao());
        dto.setEntidade(log.getEntidade());
        dto.setRegistroId(log.getRegistroId());
        dto.setCaminho(log.getCaminho());
        dto.setMetodo(log.getMetodo());
        dto.setStatusHttp(log.getStatusHttp());
        return dto;
    }
}
