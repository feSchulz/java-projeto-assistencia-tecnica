package com.assitenciaTecnica.logos.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.assitenciaTecnica.logos.data.dto.MarcaDTO;
import com.assitenciaTecnica.logos.services.MarcaService;

@RestController
@RequestMapping("/marcarest")
public class MarcaController {

	@Autowired
	private MarcaService marcaService;

	// Inserir marca
	@PostMapping("/inserir")
	public ResponseEntity<String> inserirMarca(@RequestBody MarcaDTO marcaDTO) {
		try {
			marcaService.salvar(marcaDTO);
			return ResponseEntity.ok("Marca cadastrada com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar a marca");
		}
	}

	// Buscar marcas por nome
	@GetMapping("/buscar/{nome}")
	public ResponseEntity<List<MarcaDTO>> buscarMarca(@PathVariable String nome) {
		try {
			List<MarcaDTO> marcas = marcaService.buscarPorNome(nome);
			return ResponseEntity.ok(marcas);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar marca por ID
	@GetMapping("/buscarID/{id}")
	public ResponseEntity<MarcaDTO> buscarMarcaPorId(@PathVariable Long id) {
		try {
			MarcaDTO marca = marcaService.buscarPorId(id);
			return ResponseEntity.ok(marca);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Atualizar marca
	@PutMapping("/atualiza")
	public ResponseEntity<String> atualizarMarca(@RequestBody MarcaDTO marcaDTO) {
		try {
			marcaService.atualizar(marcaDTO);
			return ResponseEntity.ok("Marca editada com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao atualizar a marca");
		}
	}

	// Deletar marca
	@DeleteMapping("/deletar/{id}")
	public ResponseEntity<String> deletarMarca(@PathVariable Long id) {
		try {
			marcaService.deletar(id);
			return ResponseEntity.ok("Marca deletada com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao deletar a marca");
		}
	}
}