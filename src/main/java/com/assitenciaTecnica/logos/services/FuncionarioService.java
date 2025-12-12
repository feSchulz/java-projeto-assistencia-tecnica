package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public void salvar(FuncionarioDTO dto) {
        Funcionario funcionario = FuncionarioDTO.toEntity(dto);
        funcionarioRepository.save(funcionario);
    }

    public void atualizar(FuncionarioDTO dto) {
        Funcionario funcionario = FuncionarioDTO.toEntity(dto);
        funcionarioRepository.save(funcionario);
    }

    public List<FuncionarioDTO> buscarPorNome(String nome) {
        return funcionarioRepository.findByUsuarioNomeContainingIgnoreCase(nome)
                .stream()
                .map(FuncionarioDTO::toDTO)
                .toList();
    }

    public void deletar(Long id) {
        funcionarioRepository.deleteById(id);
    }

    public FuncionarioDTO buscarPorId(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado"));
        return FuncionarioDTO.toDTO(funcionario);
    }
}