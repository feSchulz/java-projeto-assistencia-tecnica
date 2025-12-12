package com.assitenciaTecnica.logos.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.assitenciaTecnica.logos.data.dto.EquipamentoDTO;
import com.assitenciaTecnica.logos.services.EquipamentoService;

@RestController
@RequestMapping("/equipamentorest")
public class EquipamentoController {

	@Autowired
	private EquipamentoService equipamentoService;

	// Inserir equipamento
	@PostMapping("/inserir")
	public ResponseEntity<String> inserir(@RequestBody EquipamentoDTO equipamentoDTO) {
		try {
			equipamentoService.salvar(equipamentoDTO);
			return ResponseEntity.ok("Equipamento cadastrado com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar.");
		}
	}

	// Buscar equipamentos por modelo
	@PostMapping("/buscarModelo")
	public ResponseEntity<List<EquipamentoDTO>> buscarPorModelo(@RequestBody EquipamentoDTO equipamentoDTO) {
		try {
			List<EquipamentoDTO> lista = equipamentoService.buscarPorModelo(equipamentoDTO);
			return ResponseEntity.ok(lista);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar equipamento por ID
	@GetMapping("/buscar/{id}")
	public ResponseEntity<EquipamentoDTO> buscarPorId(@PathVariable Long id) {
		try {
			EquipamentoDTO equipamento = equipamentoService.buscarPorId(id);
			return ResponseEntity.ok(equipamento);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Atualizar equipamento
	@PutMapping("/atualizar")
	public ResponseEntity<String> atualizar(@RequestBody EquipamentoDTO equipamentoDTO) {
		try {
			equipamentoService.atualizar(equipamentoDTO);
			return ResponseEntity.ok("Equipamento editado com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao editar.");
		}
	}

	// Deletar equipamento
	@DeleteMapping("/deletar/{id}")
	public ResponseEntity<String> deletar(@PathVariable Long id) {
		try {
			equipamentoService.deletar(id);
			return ResponseEntity.ok("Equipamento excluído com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao excluir.");
		}
	}
}