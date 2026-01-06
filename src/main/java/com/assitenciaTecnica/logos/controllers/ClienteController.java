package com.assitenciaTecnica.logos.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.assitenciaTecnica.logos.controllers.docs.ClienteControllerDocs;
import com.assitenciaTecnica.logos.data.dto.ClienteDTO;
import com.assitenciaTecnica.logos.services.ClienteService;

@RestController
@RequestMapping("/api/clientes/v1")
@Tag(name = "Cliente", description = "Endpoints para gerenciamento de Clientes")
public class ClienteController implements ClienteControllerDocs {

    @Autowired
    private ClienteService clienteService;

    // Criar cliente
    @PostMapping(consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE,
            MediaType.APPLICATION_YAML_VALUE},
            produces = {
                    MediaType.APPLICATION_JSON_VALUE,
                    MediaType.APPLICATION_XML_VALUE,
                    MediaType.APPLICATION_YAML_VALUE})
    @Override
    public ResponseEntity<String> createCliente(@RequestBody ClienteDTO clienteDTO) {
        try {
            clienteService.salvar(clienteDTO);
            return ResponseEntity.ok("Cliente cadastrado com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao cadastrar cliente");
        }
    }

    // Listar todos os clientes
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public  ResponseEntity<List<ClienteDTO>> getAllClientes() {
        try {
            List<ClienteDTO> clientes = clienteService.findAll();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Buscar clientes por nome (query param)
    @GetMapping(params = "nome", produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<ClienteDTO>> getClientesByName(@RequestParam String nome) {
        try {
            List<ClienteDTO> clientes = clienteService.buscar(nome);
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Buscar cliente por ID
    @GetMapping("/{id}")
    @Override
    public ResponseEntity<ClienteDTO> getClienteById(@PathVariable Long id) {
        try {
            ClienteDTO cliente = clienteService.buscarPorId(id);
            return ResponseEntity.ok(cliente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Atualizar cliente
    @PutMapping( consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE,
            MediaType.APPLICATION_YAML_VALUE},
            produces = {
                    MediaType.APPLICATION_JSON_VALUE,
                    MediaType.APPLICATION_XML_VALUE,
                    MediaType.APPLICATION_YAML_VALUE})
    @Override
    public ResponseEntity<String> updateCliente( @RequestBody ClienteDTO clienteDTO) {
        try {
            clienteService.atualizar(clienteDTO);
            return ResponseEntity.ok("Cliente editado com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao editar cliente");
        }
    }
}