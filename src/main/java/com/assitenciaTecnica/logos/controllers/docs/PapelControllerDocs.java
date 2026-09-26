package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.PapelDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface PapelControllerDocs {

    @Operation(summary = "Listar Papéis",
            description = "Retorna todos os papéis/perfis de acesso cadastrados (ex.: ADM, TÉCNICO)",
            tags = {"Papel"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = PapelDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<PapelDTO>> getAllPapeis();

    @Operation(summary = "Buscar Papel por ID",
            description = "Retorna um papel/perfil de acesso específico",
            tags = {"Papel"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = PapelDTO.class))),
                    @ApiResponse(description = "Não encontrado", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<PapelDTO> getPapelById(@PathVariable Long id);

    @Operation(summary = "Cadastrar Papel",
            description = "Cadastra um novo papel/perfil de acesso",
            tags = {"Papel"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200", content = @Content),
                    @ApiResponse(description = "Erro de validação", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> createPapel(@RequestBody PapelDTO papelDTO);

    @Operation(summary = "Atualizar Papel",
            description = "Atualiza um papel/perfil de acesso já cadastrado",
            tags = {"Papel"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200", content = @Content),
                    @ApiResponse(description = "Erro de validação", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> updatePapel(@PathVariable Long id, @RequestBody PapelDTO papelDTO);

    @Operation(summary = "Excluir Papel",
            description = "Exclui um papel/perfil de acesso cadastrado",
            tags = {"Papel"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200", content = @Content),
                    @ApiResponse(description = "Erro de validação", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> deletePapel(@PathVariable Long id);
}
