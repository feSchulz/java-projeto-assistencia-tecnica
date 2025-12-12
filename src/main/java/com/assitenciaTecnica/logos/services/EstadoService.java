package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.model.Estado;
import com.assitenciaTecnica.logos.repository.EstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadoService {

    @Autowired
    private EstadoRepository estadoRepository;

    public Estado salvar(Estado estado) {
        if (estadoRepository.existsByNome(estado.getNome())) {
            throw new RuntimeException("Estado já cadastrado!");
        }
        return estadoRepository.save(estado);
    }

    public Estado atualizar(Estado estado) {
        if (!estadoRepository.existsById(estado.getId())) {
            throw new RuntimeException("Estado não encontrado!");
        }
        return estadoRepository.save(estado);
    }

    public List<Estado> listarTodos() {
        return estadoRepository.findAll();
    }

    public Estado buscarPorId(Long id) {
        return estadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado não encontrado!"));
    }


    public List<Estado> buscarPorNome(String nome) {
        return estadoRepository.findByNomeContainingIgnoreCase(nome);
    }


    public void deletar(Long id) {
        if (!estadoRepository.existsById(id)) {
            throw new RuntimeException("Estado não encontrado!");
        }
        estadoRepository.deleteById(id);
    }
}