package com.assitenciaTecnica.logos.controllers;


import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.assitenciaTecnica.logos.controllers.docs.EnderecoControllerDocs;
import com.assitenciaTecnica.logos.data.dto.CidadeDTO;
import com.assitenciaTecnica.logos.data.dto.EstadoDTO;
import com.assitenciaTecnica.logos.services.EnderecoService;

@RestController
@RequestMapping("/api/endereco/v1")
@Tag(name = "Endereco", description = "Endpoints para gerenciamento de Endereços")
public class EnderecoController implements EnderecoControllerDocs {

	@Autowired
	private EnderecoService enderecoService;


	@GetMapping("/estado")
	@Override
	public ResponseEntity<List<EstadoDTO>> buscarEstados() {
		try {
			List<EstadoDTO> listaEstados = enderecoService.buscarEstados();
			return ResponseEntity.ok(listaEstados);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	// Buscar cidades por ID do estado
	@GetMapping("/cidade/{idEstado}")
	@Override
	public ResponseEntity<List<CidadeDTO>> buscarCidades(@PathVariable Long idEstado) {
		try {
			List<CidadeDTO> listaCidades = enderecoService.buscarCidades(idEstado);
			return ResponseEntity.ok(listaCidades);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}
}