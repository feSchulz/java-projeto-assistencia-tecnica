package com.assitenciaTecnica.logos.controllers;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.PapelControllerDocs;
import com.assitenciaTecnica.logos.data.dto.PapelDTO;
import com.assitenciaTecnica.logos.services.PapelService;

@RestController
@RequestMapping("/api/papeis/v1")
@Tag(name = "Papel", description = "Endpoints para gerenciamento de Papéis/perfis de acesso")
public class PapelController implements PapelControllerDocs {

    @Autowired
    private PapelService papelService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<PapelDTO>> getAllPapeis() {
        try {
            List<PapelDTO> papeis = papelService.findAll();
            return ResponseEntity.ok(papeis);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<PapelDTO> getPapelById(@PathVariable Long id) {
        try {
            PapelDTO papel = papelService.buscarPorId(id);
            return ResponseEntity.ok(papel);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> createPapel(@RequestBody PapelDTO papelDTO) {
        try {
            papelService.salvar(papelDTO);
            return ResponseEntity.ok("Papel cadastrado com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao cadastrar o papel");
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> updatePapel(@PathVariable Long id, @RequestBody PapelDTO papelDTO) {
        try {
            papelDTO.setId(id);
            papelService.atualizar(papelDTO);
            return ResponseEntity.ok("Papel editado com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao atualizar o papel");
        }
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<String> deletePapel(@PathVariable Long id) {
        try {
            papelService.deletar(id);
            return ResponseEntity.ok("Papel excluído com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao excluir o papel");
        }
    }
}
