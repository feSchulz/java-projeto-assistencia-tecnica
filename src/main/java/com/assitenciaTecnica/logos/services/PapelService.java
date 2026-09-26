package com.assitenciaTecnica.logos.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assitenciaTecnica.logos.data.dto.PapelDTO;
import com.assitenciaTecnica.logos.model.Papel;
import com.assitenciaTecnica.logos.repositories.PapelRepository;

@Service
public class PapelService {

    @Autowired
    private PapelRepository papelRepository;

    // Retorna só id/codigo/nome (sem a lista de funcionários) — o suficiente
    // para popular um <select> de papel no cadastro de Funcionário.
    public List<PapelDTO> findAll() {
        return papelRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PapelDTO buscarPorId(Long id) {
        Papel papel = papelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Papel não encontrado"));
        return toDto(papel);
    }

    public void salvar(PapelDTO dto) {
        Papel papel = new Papel();
        papel.setCodigo(dto.getCodigo());
        papel.setNome(dto.getNome());
        papelRepository.save(papel);
    }

    public void atualizar(PapelDTO dto) {
        Papel papel = papelRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Papel não encontrado"));
        papel.setCodigo(dto.getCodigo());
        papel.setNome(dto.getNome());
        papelRepository.save(papel);
    }

    public void deletar(Long id) {
        Papel papel = papelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Papel não encontrado"));
        papelRepository.delete(papel);
    }

    // Mapeamento manual (sem Dozer): PapelDTO não expõe mais a lista de
    // funcionários, então não há risco de serializar entidades completas
    // (incluindo hash de senha) nem de recursão Papel -> Funcionario -> Papel.
    private PapelDTO toDto(Papel papel) {
        PapelDTO dto = new PapelDTO();
        dto.setId(papel.getId());
        dto.setCodigo(papel.getCodigo());
        dto.setNome(papel.getNome());
        return dto;
    }
}
