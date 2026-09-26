package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.ModeloDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ModeloControllerDocs {

    @Operation(summary = "Listar Modelos",
            description = "Retorna todos os modelos cadastrados (independente da marca). " +
                    "Para cadastrar um modelo novo, use o endpoint de Marca, que aceita a lista de modelos aninhada.",
            tags = {"Modelo"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ModeloDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<ModeloDTO>> getAllModelos();

    @Operation(summary = "Buscar Modelo por ID",
            description = "Retorna um modelo específico pelo ID",
            tags = {"Modelo"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = ModeloDTO.class))),
                    @ApiResponse(description = "Não encontrado", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<ModeloDTO> getModeloById(@PathVariable Long id);

    @Operation(summary = "Atualizar Modelo",
            description = "Atualiza o nome de um modelo existente, mantendo a marca já associada",
            tags = {"Modelo"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> updateModelo(@PathVariable Long id, @RequestBody ModeloDTO modeloDTO);

    @Operation(summary = "Excluir Modelo",
            description = "Remove um modelo existente pelo ID",
            tags = {"Modelo"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> deleteModelo(@PathVariable Long id);
}
