package com.assitenciaTecnica.logos.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.assitenciaTecnica.logos.data.dto.CidadeDTO;
import com.assitenciaTecnica.logos.data.dto.EstadoDTO;
import com.assitenciaTecnica.logos.services.EnderecoService;

@RestController
@RequestMapping("/enderecorest")
public class EnderecoController {

	@Autowired
	private EnderecoService enderecoService;

	// Buscar estados por nome/termo
	@GetMapping("/buscarEstado/{estado}")
	public ResponseEntity<List<EstadoDTO>> buscarEstados(@PathVariable String estado) {
		try {
			List<EstadoDTO> listaEstados = enderecoService.buscarEstados(estado);
			return ResponseEntity.ok(listaEstados);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar cidades por ID do estado
	@GetMapping("/buscarCidade/{idEstado}")
	public ResponseEntity<List<CidadeDTO>> buscarCidades(@PathVariable Long idEstado) {
		try {
			List<CidadeDTO> listaCidades = enderecoService.buscarCidades(idEstado);
			return ResponseEntity.ok(listaCidades);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar estado pelo ID da cidade
	@GetMapping("/buscarEstadoID/{idCidade}")
	public ResponseEntity<EstadoDTO> buscarEstadoPorCidade(@PathVariable Long idCidade) {
		try {
			EstadoDTO estado = enderecoService.buscarEstadoPorCidade(idCidade);
			return ResponseEntity.ok(estado);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}
}