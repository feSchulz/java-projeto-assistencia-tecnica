package com.assitenciaTecnica.logos.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.assitenciaTecnica.logos.data.dto.EquipamentoDTO;
import com.assitenciaTecnica.logos.data.dto.PaginaDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Equipamento;
import com.assitenciaTecnica.logos.repositories.EquipamentoRepository;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;

@Service
public class EquipamentoService {

    @Autowired
    private EquipamentoRepository equipamentoRepository;
    @Autowired
    private OrdemServicoRepository ordemServicoRepository;

    public void salvar(EquipamentoDTO dto) {
        Equipamento equipamento = ObjectMapper.parseObject(dto,Equipamento.class);
        equipamentoRepository.save(equipamento);
    }

    public EquipamentoDTO buscarPorId(Long id) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
        return ObjectMapper.parseObject(equipamento, EquipamentoDTO.class);
    }

    public void atualizar(EquipamentoDTO dto) {
        Equipamento equipamento = ObjectMapper.parseObject(dto, Equipamento.class);
        equipamentoRepository.save(equipamento);
    }

    /**
     * Exclusão lógica: equipamento com ordens de serviço é só inativado; sem nenhuma OS é
     * apagado de verdade.
     *
     * @return true se foi inativado, false se foi apagado
     */
    @Transactional
    public boolean deletar(Long id) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));

        if (ordemServicoRepository.existsByEquipamento_Id(id)) {
            equipamento.setAtivo(false);
            equipamentoRepository.save(equipamento);
            return true;
        }
        equipamentoRepository.delete(equipamento);
        return false;
    }

    public List<EquipamentoDTO> findAll() {
        List<Equipamento> equipamentos = equipamentoRepository.findAllAtivos();
        return ObjectMapper.parseListObjects(equipamentos, EquipamentoDTO.class);
    }

    public PaginaDTO<EquipamentoDTO> buscarPaginado(int page, int size, String q) {
        PageRequest pageable = PageRequest.of(
                PaginaDTO.paginaSegura(page), PaginaDTO.tamanhoSeguro(size),
                Sort.by(Sort.Direction.ASC, "equipamento"));
        Page<Equipamento> resultado = equipamentoRepository.buscar(PaginaDTO.textoBusca(q), pageable);
        return PaginaDTO.de(resultado,
                ObjectMapper.parseListObjects(resultado.getContent(), EquipamentoDTO.class));
    }

    // Todos os equipamentos do cliente (inclusive inativos: aparecem no histórico do cliente).
    public List<EquipamentoDTO> buscarPorCliente(Long clienteId) {
        List<Equipamento> equipamentos = equipamentoRepository.findByCliente_Id(clienteId);
        return ObjectMapper.parseListObjects(equipamentos, EquipamentoDTO.class);
    }
}
