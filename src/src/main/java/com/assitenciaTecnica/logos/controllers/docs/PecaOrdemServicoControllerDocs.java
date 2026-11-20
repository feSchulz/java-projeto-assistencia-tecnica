package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.PecaOrdemServicoDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface PecaOrdemServicoControllerDocs {

    @Operation(summary = "Associar Peça a uma Ordem de Serviço",
            description = "Registra o uso de uma peça/material em uma ordem de serviço e dá baixa no estoque",
            tags = {"PecaOrdemServico"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> inserir(@RequestBody PecaOrdemServicoDTO dto);

    @Operation(summary = "Atualizar Peça de Ordem de Serviço",
            description = "Atualiza os dados de uma peça já associada a uma ordem de serviço, ajustando o estoque",
            tags = {"PecaOrdemServico"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> atualizar(@PathVariable Long id, @RequestBody PecaOrdemServicoDTO dto);

    @Operation(summary = "Buscar Peça de Ordem de Serviço por ID",
            description = "Retorna uma peça específica pelo ID",
            tags = {"PecaOrdemServico"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = PecaOrdemServicoDTO.class))),
                    @ApiResponse(description = "Não encontrado", responseCode = "404", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<PecaOrdemServicoDTO> getById(@PathVariable Long id);

    @Operation(summary = "Listar Peças de Ordens de Serviço",
            description = "Retorna todas as peças associadas a ordens de serviço",
            tags = {"PecaOrdemServico"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = PecaOrdemServicoDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<PecaOrdemServicoDTO>> getAll();

    @Operation(summary = "Listar Peças de uma Ordem de Serviço",
            description = "Retorna todas as peças associadas a uma ordem de serviço específica",
            tags = {"PecaOrdemServico"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = PecaOrdemServicoDTO.class)))),
                    @ApiResponse(description = "Nenhum conteúdo", responseCode = "204", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<List<PecaOrdemServicoDTO>> getByOrdemServico(@PathVariable Long ordemServicoId);

    @Operation(summary = "Excluir Peça de Ordem de Serviço",
            description = "Remove a associação de uma peça a uma ordem de serviço e devolve a quantidade ao estoque",
            tags = {"PecaOrdemServico"},
            responses = {
                    @ApiResponse(description = "Sucesso", responseCode = "200",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(description = "Erro de requisição", responseCode = "400", content = @Content),
                    @ApiResponse(description = "Erro interno", responseCode = "500", content = @Content)
            }
    )
    ResponseEntity<String> deletar(@PathVariable Long id);
}
