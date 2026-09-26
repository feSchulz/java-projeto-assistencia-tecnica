package com.assitenciaTecnica.logos.controllers;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.ModeloControllerDocs;
import com.assitenciaTecnica.logos.data.dto.ModeloDTO;
import com.assitenciaTecnica.logos.services.ModeloService;

@RestController
@RequestMapping("/api/modelos/v1")
@Tag(name = "Modelo", description = "Endpoints para gerenciamento de Modelos")
public class ModeloController implements ModeloControllerDocs {

    @Autowired
    private ModeloService modeloService;

    // Listar todos os modelos
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<ModeloDTO>> getAllModelos() {
        try {
            List<ModeloDTO> modelos = modeloService.findAll();
            return ResponseEntity.ok(modelos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Buscar modelo por ID
    @GetMapping("/{id}")
    @Override
    public ResponseEntity<ModeloDTO> getModeloById(@PathVariable Long id) {
        try {
            ModeloDTO modelo = modeloService.buscarPorId(id);
            return ResponseEntity.ok(modelo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Atualizar modelo (apenas o nome; a marca associada não muda por aqui)
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<String> updateModelo(@PathVariable Long id, @RequestBody ModeloDTO modeloDTO) {
        try {
            modeloDTO.setId(id);
            modeloService.atualizar(modeloDTO);
            return ResponseEntity.ok("Modelo editado com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao editar modelo");
        }
    }

    // Excluir modelo
    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<String> deleteModelo(@PathVariable Long id) {
        try {
            modeloService.deletar(id);
            return ResponseEntity.ok("Modelo excluído com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao excluir modelo");
        }
    }
}
