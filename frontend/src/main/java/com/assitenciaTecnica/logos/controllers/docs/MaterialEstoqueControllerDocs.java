package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.MaterialEstoqueDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface MaterialEstoqueControllerDocs {

    @Operation(summary = "Cadastrar Material de Estoque",
            description = "Adiciona um novo material/peça ao estoque",
            tags = {"MaterialEstoque"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> inserir(@RequestBody MaterialEstoqueDTO dto);

    @Operation(summary = "Listar Materiais de Estoque",
            description = "Retorna todos os materiais cadastrados no estoque",
            tags = {"MaterialEstoque"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = MaterialEstoqueDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<MaterialEstoqueDTO>> getAllMateriais();

    @Operation(summary = "Buscar Materiais por Nome",
            description = "Retorna materiais filtrados pelo nome",
            tags = {"MaterialEstoque"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = MaterialEstoqueDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<MaterialEstoqueDTO>> getMateriaisByNome(@RequestParam String nome);

    @Operation(summary = "Buscar Material por ID",
            description = "Retorna um material específico pelo ID",
            tags = {"MaterialEstoque"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = MaterialEstoqueDTO.class))),
                    @ApiResponse(description = "Não encontrado", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<MaterialEstoqueDTO> getMaterialById(@PathVariable Long id);

    @Operation(summary = "Atualizar Material de Estoque",
            description = "Atualiza os dados de um material existente",
            tags = {"MaterialEstoque"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> atualizar(@RequestBody MaterialEstoqueDTO dto);

    @Operation(summary = "Excluir Material de Estoque",
            description = "Remove um material existente pelo ID",
            tags = {"MaterialEstoque"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> deletar(@PathVariable Long id);
}
