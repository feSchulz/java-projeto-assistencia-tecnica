package com.assitenciaTecnica.logos.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.assitenciaTecnica.logos.controllers.docs.MarcaControllerDocs;
import com.assitenciaTecnica.logos.data.dto.MarcaDTO;
import com.assitenciaTecnica.logos.services.MarcaService;

@RestController
@RequestMapping("/api/marcas/v1")
@Tag(name = "Marca", description = "Endpoints para gerenciamento de Marcas")
public class MarcaController implements MarcaControllerDocs {

	@Autowired
	private MarcaService marcaService;

	// Criar marca
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<String> createMarca(@RequestBody MarcaDTO marcaDTO) {
		try {
			marcaService.salvar(marcaDTO);
			return ResponseEntity.ok("Marca cadastrada com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar a marca");
		}
	}

	// Listar todas as marcas
	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<List<MarcaDTO>> getAllMarcas() {
		try {
			List<MarcaDTO> marcas = marcaService.buscarTodos();
			return ResponseEntity.ok(marcas);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar marcas por nome (query param)
	@GetMapping(params = "nome", produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<List<MarcaDTO>> getMarcasByName(@RequestParam String nome) {
		try {
			List<MarcaDTO> marcas = marcaService.buscarPorNome(nome);
			return ResponseEntity.ok(marcas);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar marca por ID
	@GetMapping("/{id}")
	@Override
	public ResponseEntity<MarcaDTO> getMarcaById(@PathVariable Long id) {
		try {
			MarcaDTO marca = marcaService.buscarPorId(id);
			return ResponseEntity.ok(marca);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Atualizar marca
	@PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<String> updateMarca( @RequestBody MarcaDTO marcaDTO) {
		try {

			marcaService.atualizar(marcaDTO);
			return ResponseEntity.ok("Marca editada com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao atualizar a marca");
		}
	}
}