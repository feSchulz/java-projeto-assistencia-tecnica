package com.assitenciaTecnica.logos.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assitenciaTecnica.logos.data.dto.ClienteDTO;
import com.assitenciaTecnica.logos.services.ClienteService;

@RestController
@RequestMapping("/clienterest")
public class ClienteController {

	@Autowired
	private ClienteService clienteService;

	// Inserir cliente
	@PostMapping("/inserir")
	public ResponseEntity<String> inserir(@RequestBody ClienteDTO clienteDTO) {
		try {
			clienteService.salvar(clienteDTO);
			return ResponseEntity.ok("Cliente cadastrado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao cadastrar cliente");
		}
	}

	// Buscar clientes por nome/termo
	@GetMapping("/buscar/{busca}")
	public ResponseEntity<List<ClienteDTO>> buscar(@PathVariable String busca) {
		try {
			List<ClienteDTO> clientes = clienteService.buscar(busca);
			return ResponseEntity.ok(clientes);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar cliente por ID
	@GetMapping("/buscarID/{id}")
	public ResponseEntity<ClienteDTO> buscarPorId(@PathVariable Long id) {
		try {
			ClienteDTO cliente = clienteService.buscarPorId(id);
			return ResponseEntity.ok(cliente);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Atualizar cliente
	@PutMapping("/atualizar")
	public ResponseEntity<String> atualizar(@RequestBody ClienteDTO clienteDTO) {
		try {
			clienteService.atualizar(clienteDTO);
			return ResponseEntity.ok("Cliente editado com sucesso");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao editar cliente");
		}
	}
}