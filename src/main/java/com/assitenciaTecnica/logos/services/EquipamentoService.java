package com.assitenciaTecnica.logos.services;


import com.assitenciaTecnica.logos.data.dto.EquipamentoDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Equipamento;
import com.assitenciaTecnica.logos.repository.EquipamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipamentoService {

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    public void salvar(EquipamentoDTO dto) {
        Equipamento equipamento = ObjectMapper.parseObject(dto,Equipamento.class);
        equipamentoRepository.save(equipamento);
    }

    public List<EquipamentoDTO> buscarPorModelo(EquipamentoDTO dto) {

        List<Equipamento> equipamento = equipamentoRepository.findByModeloId(dto.getModelo().getId());
        List<EquipamentoDTO> equipamentoDTOS = ObjectMapper.parseListObjects(equipamento, EquipamentoDTO.class);
        return equipamentoDTOS;

    }

    public EquipamentoDTO buscarPorId(Long id) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
        return EquipamentoDTO.toDTO(equipamento);
    }

    public void atualizar(EquipamentoDTO dto) {
        Equipamento equipamento = EquipamentoDTO.toEntity(dto);
        equipamentoRepository.save(equipamento);
    }

    public void deletar(Long id) {
        equipamentoRepository.deleteById(id);
    }
}