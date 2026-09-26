package com.assitenciaTecnica.logos.controllers;


import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.assitenciaTecnica.logos.controllers.docs.EquipamentoControllerDocs;
import com.assitenciaTecnica.logos.data.dto.EquipamentoDTO;
import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.model.Modelo;
import com.assitenciaTecnica.logos.repositories.ClienteRepository;
import com.assitenciaTecnica.logos.repositories.MarcaRepository;
import com.assitenciaTecnica.logos.repositories.ModeloRepository;
import com.assitenciaTecnica.logos.services.EquipamentoService;

@RestController
@RequestMapping("/api/equipamento/v1")
@Tag(name = "Equipamento", description = "Endpoints para gerenciamento de Equipamento")
public class EquipamentoController implements EquipamentoControllerDocs {

	@Autowired
	private EquipamentoService equipamentoService;
	@Autowired
	private MarcaRepository marcaRepository;
	@Autowired
	private ModeloRepository modeloRepository;
	@Autowired
	private ClienteRepository clienteRepository;

	// Resolve marca/modelo/cliente a partir do ID informado, buscando a entidade
	// completa já gerenciada antes do Dozer mapear o EquipamentoDTO -> Equipamento.
	// Evita o mesmo problema de mapeamento de objetos aninhados parciais (só com
	// ID) que já ocorreu com Cliente/Endereco/Cidade.
	private void resolverRelacionamentos(EquipamentoDTO dto) {
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
		if (dto.getCliente() != null && dto.getCliente().getId() != null) {
			Cliente cliente = clienteRepository.findById(dto.getCliente().getId())
					.orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
			dto.setCliente(cliente);
		}
	}

	@PostMapping("/inserir")
	@Override
	public ResponseEntity<String> inserir(@RequestBody EquipamentoDTO equipamentoDTO) {
		try {
			resolverRelacionamentos(equipamentoDTO);
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
			resolverRelacionamentos(equipamentoDTO);
			equipamentoService.atualizar(equipamentoDTO);
			return ResponseEntity.ok("Equipamento editado com sucesso.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Erro ao editar.");
		}
	}

	// Listar todos os equipamentos
	@GetMapping
	@Override
	public ResponseEntity<List<EquipamentoDTO>> getAllEquipamentos() {
		try {
			List<EquipamentoDTO> equipamentos = equipamentoService.findAll();
			return ResponseEntity.ok(equipamentos);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Listar equipamentos de um cliente específico
	@GetMapping("/cliente/{clienteId}")
	@Override
	public ResponseEntity<List<EquipamentoDTO>> getEquipamentosByCliente(@PathVariable Long clienteId) {
		try {
			List<EquipamentoDTO> equipamentos = equipamentoService.buscarPorCliente(clienteId);
			return ResponseEntity.ok(equipamentos);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Excluir equipamento
	@DeleteMapping("/{id}")
	@Override
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