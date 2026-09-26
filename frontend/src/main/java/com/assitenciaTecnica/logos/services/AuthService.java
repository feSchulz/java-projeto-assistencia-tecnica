package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Funcionario autenticar(String login, String senha) {
        Funcionario fc = funcionarioRepository.findByLogin(login).orElse(null);

        if (fc == null || !passwordEncoder.matches(senha, fc.getSenha())) {
            return null;
        }

        return fc;
    }
}