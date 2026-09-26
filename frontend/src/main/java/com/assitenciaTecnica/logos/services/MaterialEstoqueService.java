package com.assitenciaTecnica.logos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assitenciaTecnica.logos.data.dto.MaterialEstoqueDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.MaterialEstoque;
import com.assitenciaTecnica.logos.repositories.MaterialEstoqueRepository;

@Service
public class MaterialEstoqueService {

    @Autowired
    private MaterialEstoqueRepository materialEstoqueRepository;

    public void salvar(MaterialEstoqueDTO dto) {
        MaterialEstoque material = ObjectMapper.parseObject(dto, MaterialEstoque.class);
        materialEstoqueRepository.save(material);
    }

    public MaterialEstoqueDTO buscarPorId(Long id) {
        MaterialEstoque material = materialEstoqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));
        return ObjectMapper.parseObject(material, MaterialEstoqueDTO.class);
    }

    public void atualizar(MaterialEstoqueDTO dto) {
        MaterialEstoque material = ObjectMapper.parseObject(dto, MaterialEstoque.class);
        materialEstoqueRepository.save(material);
    }

    public void deletar(Long id) {
        MaterialEstoque material = materialEstoqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));
        materialEstoqueRepository.delete(material);
    }

    public List<MaterialEstoqueDTO> findAll() {
        List<MaterialEstoque> materiais = materialEstoqueRepository.findAll();
        return ObjectMapper.parseListObjects(materiais, MaterialEstoqueDTO.class);
    }

    public List<MaterialEstoqueDTO> buscarPorNome(String nome) {
        List<MaterialEstoque> materiais = materialEstoqueRepository.findByNomeContainingIgnoreCase(nome);
        return ObjectMapper.parseListObjects(materiais, MaterialEstoqueDTO.class);
    }
}
