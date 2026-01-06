package com.assitenciaTecnica.logos.services;


import com.assitenciaTecnica.logos.data.dto.MarcaDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.repositories.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcaService {

    @Autowired
    private MarcaRepository marcaRepository;

    public void salvar(MarcaDTO dto) {
        Marca marca = ObjectMapper.parseObject(dto, Marca.class);
        marcaRepository.save(marca);
    }

    public List<MarcaDTO> buscarPorNome(String nome) {
        List<Marca> marcas =  marcaRepository.findByNome(nome);
        return  ObjectMapper.parseListObjects(marcas, MarcaDTO.class);
    }

    public MarcaDTO buscarPorId(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca não encontrada"));

        return ObjectMapper.parseObject(marca, MarcaDTO.class);
    }

    public void atualizar(MarcaDTO dto) {
        Marca marca = ObjectMapper.parseObject(dto, Marca.class);
        marcaRepository.save(marca);
    }

    public void deletar(Long id) {
        marcaRepository.deleteById(id);
    }

    public List<MarcaDTO> buscarTodos() {
        List<Marca> marcas =  marcaRepository.findAll();
        return  ObjectMapper.parseListObjects(marcas, MarcaDTO.class);
    }
}