package com.assitenciaTecnica.logos.services;


import com.assitenciaTecnica.logos.data.dto.MarcaDTO;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcaService {

    @Autowired
    private MarcaRepository marcaRepository;

    public void salvar(MarcaDTO dto) {
        Marca marca = MarcaDTO.toEntity(dto);
        marcaRepository.save(marca);
    }

    public List<MarcaDTO> buscarPorNome(String nome) {
        return marcaRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(MarcaDTO::toDTO)
                .toList();
    }

    public MarcaDTO buscarPorId(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca não encontrada"));
        return MarcaDTO.toDTO(marca);
    }

    public void atualizar(MarcaDTO dto) {
        Marca marca = MarcaDTO.toEntity(dto);
        marcaRepository.save(marca);
    }

    public void deletar(Long id) {
        marcaRepository.deleteById(id);
    }
}