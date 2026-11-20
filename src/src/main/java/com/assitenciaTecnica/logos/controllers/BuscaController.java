package com.assitenciaTecnica.logos.controllers;

import com.assitenciaTecnica.logos.data.dto.BuscaResultadoDTO;
import com.assitenciaTecnica.logos.services.BuscaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/busca/v1")
public class BuscaController {

    @Autowired
    private BuscaService buscaService;

    // Busca global: GET /api/busca/v1?q=texto (mínimo 2 caracteres)
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BuscaResultadoDTO> buscar(@RequestParam(defaultValue = "") String q) {
        try {
            return ResponseEntity.ok(buscaService.buscar(q));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
