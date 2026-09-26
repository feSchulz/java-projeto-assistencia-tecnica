package com.assitenciaTecnica.logos.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import com.assitenciaTecnica.logos.controllers.docs.FuncionarioControllerDocs;
import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.model.Papel;
import com.assitenciaTecnica.logos.repositories.PapelRepository;
import com.assitenciaTecnica.logos.services.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios/v1")
@Tag(name = "Funcionario", description = "Endpoints para gerenciamento dos Funcionarios")
public class FuncionarioController implements FuncionarioControllerDocs {

	@Autowired
	private FuncionarioService funcionarioService;
	@Autowired
	private PapelRepository papelRepository;

	// Resolve o papel a partir do ID informado, buscando a entidade completa já
	// gerenciada antes do Dozer mapear o DTO -> Funcionario (mesmo cuidado já
	// aplicado em Cliente/Endereco/Cidade, Equipamento, OrdemServico e MaterialEstoque).
	private void resolverRelacionamentos(FuncionarioDTO dto) {
		if (dto.getPapel() != null && dto.getPapel().getId() != null) {
			Papel papel = papelRepository.findById(dto.getPapel().getId())
					.orElseThrow(() -> new RuntimeException("Papel não encontrado"));
			dto.setPapel(papel);
		}
	}

	// Criar funcionário
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<String> createFuncionario(@RequestBody FuncionarioDTO funcionarioDTO) {
		try {
			resolverRelacionamentos(funcionarioDTO);
			funcionarioService.salvar(funcionarioDTO);
			return ResponseEntity.ok("Funcionário cadastrado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar funcionário");
		}
	}

	// Atualizar funcionário
	@PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<String> updateFuncionario(@PathVariable Long id, @RequestBody FuncionarioDTO funcionarioDTO) {
		try {
			funcionarioDTO.setId(id); // garante que o ID da rota seja usado
			resolverRelacionamentos(funcionarioDTO);
			funcionarioService.atualizar(funcionarioDTO);
			return ResponseEntity.ok("Funcionário editado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao editar funcionário");
		}
	}

	// Buscar funcionários por nome (query param)
	@GetMapping(params = "nome", produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<List<FuncionarioDTO>> getFuncionariosByName(@RequestParam String nome) {
		try {
			List<FuncionarioDTO> funcionarios = funcionarioService.buscarPorNome(nome);
			return ResponseEntity.ok(funcionarios);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Listar todos os funcionários
	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@Override
	public ResponseEntity<List<FuncionarioDTO>> getAllFuncionarios() {
		try {
			List<FuncionarioDTO> funcionarios = funcionarioService.findAll();
			return ResponseEntity.ok(funcionarios);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar funcionário por ID
	@GetMapping("/{id}")
	@Override
	public ResponseEntity<FuncionarioDTO> getFuncionarioById(@PathVariable Long id) {
		try {
			FuncionarioDTO funcionario = funcionarioService.buscarPorId(id);
			return ResponseEntity.ok(funcionario);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Excluir funcionário
	@DeleteMapping("/{id}")
	@Override
	public ResponseEntity<String> deleteFuncionario(@PathVariable Long id) {
		try {
			funcionarioService.deletar(id);
			return ResponseEntity.ok("Funcionário excluído com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao excluir funcionário");
		}
	}

}