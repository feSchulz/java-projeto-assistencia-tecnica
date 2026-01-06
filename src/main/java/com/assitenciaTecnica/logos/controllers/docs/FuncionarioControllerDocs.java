package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface FuncionarioControllerDocs {

    @Operation(summary = "Cadastrar Funcionário",
            description = "Adiciona um novo funcionário passando JSON, XML ou YML",
            tags = {"Funcionario"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> createFuncionario(@RequestBody FuncionarioDTO funcionarioDTO);

    @Operation(summary = "Atualizar Funcionário",
            description = "Atualiza os dados de um funcionário existente",
            tags = {"Funcionario"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> updateFuncionario(@RequestBody FuncionarioDTO funcionarioDTO);

    @Operation(summary = "Buscar Funcionário por Nome",
            description = "Retorna funcionários filtrados pelo nome",
            tags = {"Funcionario"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = FuncionarioDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<FuncionarioDTO>> getFuncionariosByName(@PathVariable String nome);

    @Operation(summary = "Listar Funcionários",
            description = "Retorna todos os funcionários cadastrados",
            tags = {"Funcionario"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = FuncionarioDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<FuncionarioDTO>> getAllFuncionarios();


    @Operation(summary = "Buscar Funcionário por ID",
            description = "Retorna um funcionário específico pelo ID",
            tags = {"Funcionario"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = FuncionarioDTO.class))),
                    @ApiResponse(description = "Não encontrado", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<FuncionarioDTO> getFuncionarioById(@PathVariable Long id);
}