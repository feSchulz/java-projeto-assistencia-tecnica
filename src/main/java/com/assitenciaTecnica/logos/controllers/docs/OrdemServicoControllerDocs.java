package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.OrdemServicoDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface OrdemServicoControllerDocs {

    @Operation(summary = "Cadastrar Ordem de Serviço",
            description = "Cria uma nova ordem de serviço passando JSON",
            tags = {"OrdemServico"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Sucesso",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(responseCode = "400", description = "Erro de requisição", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content)
            })
    ResponseEntity<String> createOrdemServico(@RequestBody OrdemServicoDTO os);

    @Operation(summary = "Atualizar Ordem de Serviço",
            description = "Atualiza os dados de uma ordem de serviço existente",
            tags = {"OrdemServico"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Sucesso",
                            content = @Content(schema = @Schema(implementation = String.class))),
                    @ApiResponse(responseCode = "400", description = "Erro de requisição", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content)
            })
    ResponseEntity<String> updateOrdemServico(@PathVariable Long id, @RequestBody OrdemServicoDTO os);

    @Operation(summary = "Buscar Ordem de Serviço por ID",
            description = "Retorna uma ordem de serviço específica pelo ID",
            tags = {"OrdemServico"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Sucesso",
                            content = @Content(schema = @Schema(implementation = OrdemServicoDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Não encontrado", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content)
            })
    ResponseEntity<OrdemServicoDTO> getOrdemServicoById(@PathVariable Long id);

    @Operation(summary = "Listar Ordens de Serviço",
            description = "Retorna todas as ordens de serviço cadastradas",
            tags = {"OrdemServico"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Sucesso",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrdemServicoDTO.class)))),
                    @ApiResponse(responseCode = "204", description = "Nenhum conteúdo", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Erro interno", content = @Content)
            })
    ResponseEntity<List<OrdemServicoDTO>> getAllOrdensServico();
}