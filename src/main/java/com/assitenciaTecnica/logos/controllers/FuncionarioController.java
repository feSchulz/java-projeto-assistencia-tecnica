package com.assitenciaTecnica.logos.controllers;


import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.services.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionariorest")
public class FuncionarioController {

	@Autowired
	private FuncionarioService funcionarioService;

	// Inserir funcionário
	@PostMapping("/inserir")
	public ResponseEntity<String> inserir(@RequestBody FuncionarioDTO funcionarioDTO) {
		try {
			funcionarioService.salvar(funcionarioDTO);
			return ResponseEntity.ok("Funcionario cadastrado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar Funcionario");
		}
	}

	// Atualizar funcionário
	@PutMapping("/atualizar")
	public ResponseEntity<String> atualizar(@RequestBody FuncionarioDTO funcionarioDTO) {
		try {
			funcionarioService.atualizar(funcionarioDTO);
			return ResponseEntity.ok("Funcionario editado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao editar Funcionario");
		}
	}

	// Buscar funcionários por nome
	@GetMapping("/buscar/{nome}")
	public ResponseEntity<List<FuncionarioDTO>> buscarFuncionario(@PathVariable String nome) {
		try {
			List<FuncionarioDTO> funcionarios = funcionarioService.buscarPorNome(nome);
			return ResponseEntity.ok(funcionarios);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Deletar funcionário por ID
	@DeleteMapping("/deletar/{id}")
	public ResponseEntity<String> deletar(@PathVariable Long id) {
		try {
			funcionarioService.deletar(id);
			return ResponseEntity.ok("Funcionario deletado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao deletar Funcionario");
		}
	}

	// Buscar funcionário por ID
	@GetMapping("/buscarID/{id}")
	public ResponseEntity<FuncionarioDTO> buscarPorId(@PathVariable Long id) {
		try {
			FuncionarioDTO funcionario = funcionarioService.buscarPorId(id);
			return ResponseEntity.ok(funcionario);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}
}