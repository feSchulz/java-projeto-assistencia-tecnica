package com.assitenciaTecnica.logos.controllers.docs;

import com.assitenciaTecnica.logos.data.dto.PapelDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

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
}
