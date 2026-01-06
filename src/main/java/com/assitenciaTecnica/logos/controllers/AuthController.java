package com.assitenciaTecnica.logos.controllers;

import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.data.dto.LoginRequestDTO;
import com.assitenciaTecnica.logos.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/v1")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<FuncionarioDTO> login(@RequestBody LoginRequestDTO request) {
        FuncionarioDTO funcionario = authService.autenticar(request.getLogin(), request.getSenha());

        if (funcionario != null) {
            return ResponseEntity.ok( funcionario );
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }
}
