package com.assitenciaTecnica.logos.controllers;

import com.assitenciaTecnica.logos.controllers.security.JwtService;
import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.data.dto.LoginRequestDTO;
import com.assitenciaTecnica.logos.data.dto.LoginResponseDTO;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/v1")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        Funcionario funcionario = authService.autenticar(request.getLogin(), request.getPassword());

        if (funcionario == null) {
            return ResponseEntity.status(401).build();
        }

        String token = jwtService.gerarToken(funcionario);

        LoginResponseDTO response = new LoginResponseDTO(
                "Login realizado com sucesso",
                funcionario.getPapel().getCodigo(),
                funcionario.getUsuario().getId()
        );
        response.setToken(token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok().build();
    }
}