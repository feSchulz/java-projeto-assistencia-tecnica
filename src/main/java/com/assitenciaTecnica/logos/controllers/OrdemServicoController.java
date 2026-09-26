package com.assitenciaTecnica.logos.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.OrdemServicoControllerDocs;
import com.assitenciaTecnica.logos.data.dto.OrdemServicoDTO;
import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.model.Equipamento;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.repositories.ClienteRepository;
import com.assitenciaTecnica.logos.repositories.EquipamentoRepository;
import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import com.assitenciaTecnica.logos.services.OrdemServicoService;

@RestController
@RequestMapping("/api/ordens-servico/v1")
@Tag(name = "OrdemServico", description = "Endpoints para gerenciamento de Ordem de Serviço")
public class OrdemServicoController implements OrdemServicoControllerDocs {

    @Autowired
    private OrdemServicoService ordemServicoService;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private EquipamentoRepository equipamentoRepository;
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    // Resolve cliente/equipamento/funcionário a partir do ID informado, buscando
    // a entidade completa já gerenciada antes do Dozer mapear o DTO -> OrdemServico
    // (mesmo cuidado já aplicado em Cliente/Endereco/Cidade e em Equipamento).
    private void resolverRelacionamentos(OrdemServicoDTO dto) {
        if (dto.getCliente() != null && dto.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            dto.setCliente(cliente);
        }
        if (dto.getEquipamento() != null && dto.getEquipamento().getId() != null) {
            Equipamento equipamento = equipamentoRepository.findById(dto.getEquipamento().getId())
                    .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
            dto.setEquipamento(equipamento);
        }
        if (dto.getFuncionarioResponsavel() != null && dto.getFuncionarioResponsavel().getId() != null) {
            Funcionario funcionario = funcionarioRepository.findById(dto.getFuncionarioResponsavel().getId())
                    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
            dto.setFuncionarioResponsavel(funcionario);
        }
    }

    // Criar ordem de serviço
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> createOrdemServico(@RequestBody OrdemServicoDTO os) {
        try {
            resolverRelacionamentos(os);
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
            resolverRelacionamentos(os);
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

    // Buscar ordens de serviço por cliente
    @GetMapping(value = "/cliente/{clienteId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<OrdemServicoDTO>> getOrdensServicoByCliente(@PathVariable Long clienteId) {
        try {
            List<OrdemServicoDTO> ordens = ordemServicoService.buscarPorCliente(clienteId);
            return ResponseEntity.ok(ordens);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Buscar ordens de serviço por status
    @GetMapping(value = "/status/{status}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<OrdemServicoDTO>> getOrdensServicoByStatus(@PathVariable Long status) {
        try {
            List<OrdemServicoDTO> ordens = ordemServicoService.buscarPorStatus(status);
            return ResponseEntity.ok(ordens);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Excluir ordem de serviço
    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<String> deleteOrdemServico(@PathVariable Long id) {
        try {
            ordemServicoService.deletar(id);
            return ResponseEntity.ok("Ordem de serviço excluída com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao excluir ordem de serviço");
        }
    }
}