package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void salvar(FuncionarioDTO dto) {
        Funcionario funcionario = ObjectMapper.parseObject(dto, Funcionario.class);
        funcionario.setSenha(passwordEncoder.encode(dto.getSenha()));
        funcionarioRepository.save(funcionario);
    }

    public void atualizar(FuncionarioDTO dto) {
        Funcionario existente = funcionarioRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado"));

        Funcionario atualizado = ObjectMapper.parseObject(dto, Funcionario.class);

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            // veio senha nova em texto puro -> gera hash novo
            atualizado.setSenha(passwordEncoder.encode(dto.getSenha()));
        } else {
            // nenhuma senha enviada -> mantém o hash já salvo, sem re-criptografar
            atualizado.setSenha(existente.getSenha());
        }

        funcionarioRepository.save(atualizado);
    }

    public List<FuncionarioDTO> buscarPorNome(String nome) {
        List<Funcionario> funcionarios = funcionarioRepository.findByUsuario_NomeIgnoreCase(nome);
        return ObjectMapper.parseListObjects(funcionarios, FuncionarioDTO.class);
    }

    public List<FuncionarioDTO> findAll() {
        List<Funcionario> funcionarios = funcionarioRepository.findAll();
        return ObjectMapper.parseListObjects(funcionarios, FuncionarioDTO.class);
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