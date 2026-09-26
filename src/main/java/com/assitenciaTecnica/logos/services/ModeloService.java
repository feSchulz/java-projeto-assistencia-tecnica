package com.assitenciaTecnica.logos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assitenciaTecnica.logos.data.dto.ModeloDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Modelo;
import com.assitenciaTecnica.logos.repositories.ModeloRepository;

@Service
public class ModeloService {

    @Autowired
    private ModeloRepository modeloRepository;

    public List<ModeloDTO> findAll() {
        List<Modelo> modelos = modeloRepository.findAll();
        return ObjectMapper.parseListObjects(modelos, ModeloDTO.class);
    }

    public ModeloDTO buscarPorId(Long id) {
        Modelo modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado"));
        return ObjectMapper.parseObject(modelo, ModeloDTO.class);
    }

    public void atualizar(ModeloDTO dto) {
        Modelo modelo = modeloRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado"));
        modelo.setNome(dto.getNome());
        modeloRepository.save(modelo);
    }

    public void deletar(Long id) {
        modeloRepository.deleteById(id);
    }
}
