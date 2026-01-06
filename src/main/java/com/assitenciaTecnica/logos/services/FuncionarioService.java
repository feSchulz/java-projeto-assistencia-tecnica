package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.controllers.security.Securitypassword;
import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private Securitypassword sc;
    public void salvar(FuncionarioDTO dto) {
        Funcionario funcionario = ObjectMapper.parseObject(dto, Funcionario.class);
        String senha = funcionario.getSenha();
        senha = sc.passwordEncoder().encode(senha);
        funcionario.setSenha(senha);
        funcionarioRepository.save(funcionario);
    }

    public void atualizar(FuncionarioDTO dto) {
        Funcionario funcionario = ObjectMapper.parseObject(dto, Funcionario.class);
        String senha = funcionario.getSenha();
        senha = sc.passwordEncoder().encode(senha);
        funcionario.setSenha(senha);
        funcionarioRepository.save(funcionario);
    }

    public List<FuncionarioDTO> buscarPorNome(String nome) {
        List<Funcionario> funcionarios = funcionarioRepository.findByUsuario_NomeIgnoreCase(nome);
        List<FuncionarioDTO> funcionariosDTO = ObjectMapper.parseListObjects(funcionarios, FuncionarioDTO.class);
        return funcionariosDTO;
    }

    public List<FuncionarioDTO> findAll() {
        List<Funcionario> funcionarios = funcionarioRepository.findAll();
        List<FuncionarioDTO> funcionariosDTO = ObjectMapper.parseListObjects(funcionarios, FuncionarioDTO.class);
        return funcionariosDTO;
    }

    public void deletar(Long id) {
        funcionarioRepository.deleteById(id);
    }

    public FuncionarioDTO buscarPorId(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado"));
        return ObjectMapper.parseObject(funcionario, FuncionarioDTO.class);
    }
}