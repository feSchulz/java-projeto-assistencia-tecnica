package com.assitenciaTecnica.logos.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.OrdemServicoControllerDocs;
import com.assitenciaTecnica.logos.data.dto.OrdemServicoDTO;
import com.assitenciaTecnica.logos.services.OrdemServicoService;

@RestController
@RequestMapping("/api/ordens-servico/v1")
@Tag(name = "OrdemServico", description = "Endpoints para gerenciamento de Ordem de Serviço")
public class OrdemServicoController implements OrdemServicoControllerDocs {

    @Autowired
    private OrdemServicoService ordemServicoService;

    // Criar ordem de serviço
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> createOrdemServico(@RequestBody OrdemServicoDTO os) {
        try {
            ordemServicoService.salvar(os);
            return ResponseEntity.ok("Ordem de serviço cadastrada com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao criar ordem de serviço");
        }
    }

    // Atualizar ordem de serviço
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> updateOrdemServico(@PathVariable Long id,
                                                     @RequestBody OrdemServicoDTO os) {
        try {
            os.setId(id); // garante que o ID da rota seja usado
            ordemServicoService.atualizar(os);
            return ResponseEntity.ok("Ordem de serviço atualizada com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao atualizar ordem de serviço");
        }
    }

    // Buscar ordem de serviço por ID
    @GetMapping("/{id}")
    @Override
    public ResponseEntity<OrdemServicoDTO> getOrdemServicoById(@PathVariable Long id) {
        try {
            OrdemServicoDTO os = ordemServicoService.buscarPorId(id);
            return ResponseEntity.ok(os);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Listar todas as ordens de serviço
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<OrdemServicoDTO>> getAllOrdensServico() {
        try {
            List<OrdemServicoDTO> ordens = ordemServicoService.findAll();
            return ResponseEntity.ok(ordens);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}