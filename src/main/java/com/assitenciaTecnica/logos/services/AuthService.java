package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.controllers.security.Securitypassword;
import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private Securitypassword scpassw;

    public FuncionarioDTO autenticar(String login, String senha) {
        Funcionario fc = funcionarioRepository.findByLoginAndSenha(login,scpassw.passwordEncoder().encode(senha) )
                .orElse(null);
        FuncionarioDTO fcDTO = null;
        if (fc != null) {
            fcDTO = ObjectMapper.parseObject(fc, FuncionarioDTO.class);
        }
        return fcDTO;
    }
}