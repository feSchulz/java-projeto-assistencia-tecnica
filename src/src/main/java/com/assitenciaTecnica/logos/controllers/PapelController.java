package com.assitenciaTecnica.logos.controllers;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assitenciaTecnica.logos.controllers.docs.PapelControllerDocs;
import com.assitenciaTecnica.logos.data.dto.PapelDTO;
import com.assitenciaTecnica.logos.services.PapelService;

@RestController
@RequestMapping("/api/papeis/v1")
@Tag(name = "Papel", description = "Endpoints para consulta de Papéis/perfis de acesso")
public class PapelController implements PapelControllerDocs {

    @Autowired
    private PapelService papelService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Override
    public ResponseEntity<List<PapelDTO>> getAllPapeis() {
        try {
            List<PapelDTO> papeis = papelService.findAll();
            return ResponseEntity.ok(papeis);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
