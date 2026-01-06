package com.assitenciaTecnica.logos.controllers;


import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.EquipamentoControllerDocs;
import com.assitenciaTecnica.logos.data.dto.EquipamentoDTO;
import com.assitenciaTecnica.logos.services.EquipamentoService;

@RestController
@RequestMapping("/api/equipamento/v1")
@Tag(name = "Equipamento", description = "Endpoints para gerenciamento de Equipamento")
public class EquipamentoController implements EquipamentoControllerDocs {

	@Autowired
	private EquipamentoService equipamentoService;



	@PostMapping("/inserir")
	@Override
	public ResponseEntity<String> inserir(@RequestBody EquipamentoDTO equipamentoDTO) {
		try {
			equipamentoService.salvar(equipamentoDTO);
			return ResponseEntity.ok("Equipamento cadastrado com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar.");
		}
	}


	@GetMapping("/buscar/{id}")
	@Override
	public ResponseEntity<EquipamentoDTO> buscarPorId(@PathVariable Long id) {
		try {
			EquipamentoDTO equipamento = equipamentoService.buscarPorId(id);
			return ResponseEntity.ok(equipamento);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	@PutMapping("/atualizar")
	@Override
	public ResponseEntity<String> atualizar(@RequestBody EquipamentoDTO equipamentoDTO) {
		try {
			equipamentoService.atualizar(equipamentoDTO);
			return ResponseEntity.ok("Equipamento editado com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao editar.");
		}
	}
}