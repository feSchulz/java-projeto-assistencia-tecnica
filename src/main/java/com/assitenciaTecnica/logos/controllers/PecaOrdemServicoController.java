package com.assitenciaTecnica.logos.controllers;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.PecaOrdemServicoControllerDocs;
import com.assitenciaTecnica.logos.data.dto.PecaOrdemServicoDTO;
import com.assitenciaTecnica.logos.model.MaterialEstoque;
import com.assitenciaTecnica.logos.model.OrdemServico;
import com.assitenciaTecnica.logos.repositories.MaterialEstoqueRepository;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;
import com.assitenciaTecnica.logos.services.PecaOrdemServicoService;

@RestController
@RequestMapping("/api/pecas-ordem-servico/v1")
@Tag(name = "PecaOrdemServico", description = "Endpoints para associar peças/materiais a uma Ordem de Serviço")
public class PecaOrdemServicoController implements PecaOrdemServicoControllerDocs {

    @Autowired
    private PecaOrdemServicoService pecaOrdemServicoService;
    @Autowired
    private OrdemServicoRepository ordemServicoRepository;
    @Autowired
    private MaterialEstoqueRepository materialEstoqueRepository;

    // Resolve ordemServico/material a partir do ID informado, buscando a entidade
    // completa já gerenciada antes do Dozer mapear o DTO -> PecaOrdemServico
    // (mesmo cuidado já aplicado em Cliente/Endereco/Cidade, Equipamento e MaterialEstoque).
    private void resolverRelacionamentos(PecaOrdemServicoDTO dto) {
        if (dto.getOrdemServico() != null && dto.getOrdemServico().getId() != null) {
            OrdemServico ordemServico = ordemServicoRepository.findById(dto.getOrdemServico().getId())
                    .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));
            dto.setOrdemServico(ordemServico);
        }
        if (dto.getMaterial() != null && dto.getMaterial().getId() != null) {
            MaterialEstoque material = materialEstoqueRepository.findById(dto.getMaterial().getId())
                    .orElseThrow(() -> new RuntimeException("Material não encontrado"));
            dto.setMaterial(material);
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> inserir(@RequestBody PecaOrdemServicoDTO dto) {
        try {
            resolverRelacionamentos(dto);
            pecaOrdemServicoService.salvar(dto);
            return ResponseEntity.ok("Peça associada à ordem de serviço com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao associar peça: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> atualizar(@PathVariable Long id, @RequestBody PecaOrdemServicoDTO dto) {
        try {
            dto.setId(id);
            resolverRelacionamentos(dto);
            pecaOrdemServicoService.atualizar(dto);
            return ResponseEntity.ok("Peça atualizada com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao atualizar peça: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Override
    public ResponseEntity<PecaOrdemServicoDTO> getById(@PathVariable Long id) {
        try {
            PecaOrdemServicoDTO peca = pecaOrdemServicoService.buscarPorId(id);
            return ResponseEntity.ok(peca);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<PecaOrdemServicoDTO>> getAll() {
        try {
            List<PecaOrdemServicoDTO> pecas = pecaOrdemServicoService.findAll();
            return ResponseEntity.ok(pecas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(value = "/ordem-servico/{ordemServicoId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<PecaOrdemServicoDTO>> getByOrdemServico(@PathVariable Long ordemServicoId) {
        try {
            List<PecaOrdemServicoDTO> pecas = pecaOrdemServicoService.buscarPorOrdemServico(ordemServicoId);
            return ResponseEntity.ok(pecas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        try {
            pecaOrdemServicoService.deletar(id);
            return ResponseEntity.ok("Peça removida da ordem de serviço e devolvida ao estoque.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao excluir peça: " + e.getMessage());
        }
    }
}
