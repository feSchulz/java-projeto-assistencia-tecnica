package com.assitenciaTecnica.logos.controllers;

import com.assitenciaTecnica.logos.controllers.security.JwtService;
import com.assitenciaTecnica.logos.data.dto.PerfilDTO;
import com.assitenciaTecnica.logos.data.dto.LoginRequestDTO;
import com.assitenciaTecnica.logos.data.dto.LoginResponseDTO;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.services.AuthService;
import com.assitenciaTecnica.logos.services.FuncionarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
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

    @Autowired
    private FuncionarioService funcionarioService;

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

    // Dados do funcionário autenticado, para a tela "Meu perfil". O login vem
    // do token JWT já validado pelo JwtAuthenticationFilter, não do cliente.
    @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PerfilDTO> me() {
        try {
            String login = SecurityContextHolder.getContext().getAuthentication().getName();
            return ResponseEntity.ok(funcionarioService.buscarPerfil(login));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Atualiza dados pessoais/endereço (e, opcionalmente, a senha) do próprio
    // funcionário. Login e papel são sempre preservados.
    @PutMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateMe(@RequestBody PerfilDTO perfilDTO) {
        try {
            String login = SecurityContextHolder.getContext().getAuthentication().getName();
            funcionarioService.atualizarPerfil(login, perfilDTO);
            return ResponseEntity.ok("Perfil atualizado com sucesso");
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("CPF, telefone ou e-mail já cadastrado em outro usuário.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao atualizar perfil");
        }
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