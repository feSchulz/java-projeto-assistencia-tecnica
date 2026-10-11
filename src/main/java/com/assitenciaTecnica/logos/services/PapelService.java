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

    private PapelDTO toDto(Papel papel) {
        PapelDTO dto = new PapelDTO();
        dto.setId(papel.getId());
        dto.setCodigo(papel.getCodigo());
        dto.setNome(papel.getNome());
        return dto;
    }
}
