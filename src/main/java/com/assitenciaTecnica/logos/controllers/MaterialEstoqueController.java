package com.assitenciaTecnica.logos.controllers;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.MaterialEstoqueControllerDocs;
import com.assitenciaTecnica.logos.data.dto.MaterialEstoqueDTO;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.model.Modelo;
import com.assitenciaTecnica.logos.repositories.MarcaRepository;
import com.assitenciaTecnica.logos.repositories.ModeloRepository;
import com.assitenciaTecnica.logos.services.MaterialEstoqueService;

@RestController
@RequestMapping("/api/materiais/v1")
@Tag(name = "MaterialEstoque", description = "Endpoints para gerenciamento de Materiais/Peças em estoque")
public class MaterialEstoqueController implements MaterialEstoqueControllerDocs {

    @Autowired
    private MaterialEstoqueService materialEstoqueService;
    @Autowired
    private MarcaRepository marcaRepository;
    @Autowired
    private ModeloRepository modeloRepository;

    // Resolve marca/modelo a partir do ID informado, buscando a entidade completa
    // já gerenciada antes do Dozer mapear o DTO -> MaterialEstoque (mesmo cuidado
    // já aplicado em Cliente/Endereco/Cidade e em Equipamento).
    private void resolverRelacionamentos(MaterialEstoqueDTO dto) {
        if (dto.getMarca() != null && dto.getMarca().getId() != null) {
            Marca marca = marcaRepository.findById(dto.getMarca().getId())
                    .orElseThrow(() -> new RuntimeException("Marca não encontrada"));
            dto.setMarca(marca);
        }
        if (dto.getModelo() != null && dto.getModelo().getId() != null) {
            Modelo modelo = modeloRepository.findById(dto.getModelo().getId())
                    .orElseThrow(() -> new RuntimeException("Modelo não encontrado"));
            dto.setModelo(modelo);
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> inserir(@RequestBody MaterialEstoqueDTO dto) {
        try {
            resolverRelacionamentos(dto);
            materialEstoqueService.salvar(dto);
            return ResponseEntity.ok("Material cadastrado com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao cadastrar material.");
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<MaterialEstoqueDTO>> getAllMateriais() {
        try {
            List<MaterialEstoqueDTO> materiais = materialEstoqueService.findAll();
            return ResponseEntity.ok(materiais);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(params = "nome", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<MaterialEstoqueDTO>> getMateriaisByNome(@RequestParam String nome) {
        try {
            List<MaterialEstoqueDTO> materiais = materialEstoqueService.buscarPorNome(nome);
            return ResponseEntity.ok(materiais);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    @Override
    public ResponseEntity<MaterialEstoqueDTO> getMaterialById(@PathVariable Long id) {
        try {
            MaterialEstoqueDTO material = materialEstoqueService.buscarPorId(id);
            return ResponseEntity.ok(material);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> atualizar(@RequestBody MaterialEstoqueDTO dto) {
        try {
            resolverRelacionamentos(dto);
            materialEstoqueService.atualizar(dto);
            return ResponseEntity.ok("Material editado com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao editar material.");
        }
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        try {
            materialEstoqueService.deletar(id);
            return ResponseEntity.ok("Material excluído com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao excluir material.");
        }
    }
}
