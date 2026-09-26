package com.assitenciaTecnica.logos.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assitenciaTecnica.logos.data.dto.PecaOrdemServicoDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.MaterialEstoque;
import com.assitenciaTecnica.logos.model.PecaOrdemServico;
import com.assitenciaTecnica.logos.model.enums.StatusMaterial;
import com.assitenciaTecnica.logos.repositories.MaterialEstoqueRepository;
import com.assitenciaTecnica.logos.repositories.PecaOrdemServicoRepository;

@Service
public class PecaOrdemServicoService {

    @Autowired
    private PecaOrdemServicoRepository pecaOrdemServicoRepository;
    @Autowired
    private MaterialEstoqueRepository materialEstoqueRepository;

    // Cadastra uma peça usada em uma ordem de serviço e dá baixa no estoque do material.
    public void salvar(PecaOrdemServicoDTO dto) {
        MaterialEstoque material = materialEstoqueRepository.findById(dto.getMaterial().getId())
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
        if (material.getQuantidadeEstoque() < dto.getQuantidade()) {
            throw new RuntimeException("Quantidade em estoque insuficiente para o material " + material.getNome());
        }

        if (dto.getValorUnitario() == null) {
            dto.setValorUnitario(material.getValorUnitario());
        }
        dto.setValorTotal(dto.getValorUnitario().multiply(BigDecimal.valueOf(dto.getQuantidade())));
        if (dto.getStatus() == null) {
            dto.setStatus(StatusMaterial.NOVA);
        }

        material.setQuantidadeEstoque(material.getQuantidadeEstoque() - dto.getQuantidade());
        materialEstoqueRepository.save(material);

        PecaOrdemServico peca = ObjectMapper.parseObject(dto, PecaOrdemServico.class);
        pecaOrdemServicoRepository.save(peca);
    }

    // Atualiza a peça, devolvendo ao estoque a quantidade antiga e baixando a nova.
    public void atualizar(PecaOrdemServicoDTO dto) {
        PecaOrdemServico existente = pecaOrdemServicoRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Peça de ordem de serviço não encontrada"));

        MaterialEstoque material = materialEstoqueRepository.findById(dto.getMaterial().getId())
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        // devolve ao estoque a quantidade previamente reservada (mesmo material)
        if (existente.getMaterial().getId().equals(material.getId())) {
            material.setQuantidadeEstoque(material.getQuantidadeEstoque() + existente.getQuantidade());
        }

        if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
        if (material.getQuantidadeEstoque() < dto.getQuantidade()) {
            throw new RuntimeException("Quantidade em estoque insuficiente para o material " + material.getNome());
        }

        if (dto.getValorUnitario() == null) {
            dto.setValorUnitario(material.getValorUnitario());
        }
        dto.setValorTotal(dto.getValorUnitario().multiply(BigDecimal.valueOf(dto.getQuantidade())));
        if (dto.getStatus() == null) {
            dto.setStatus(existente.getStatus());
        }

        material.setQuantidadeEstoque(material.getQuantidadeEstoque() - dto.getQuantidade());
        materialEstoqueRepository.save(material);

        PecaOrdemServico peca = ObjectMapper.parseObject(dto, PecaOrdemServico.class);
        pecaOrdemServicoRepository.save(peca);
    }

    public PecaOrdemServicoDTO buscarPorId(Long id) {
        PecaOrdemServico peca = pecaOrdemServicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Peça de ordem de serviço não encontrada"));
        return ObjectMapper.parseObject(peca, PecaOrdemServicoDTO.class);
    }

    public List<PecaOrdemServicoDTO> findAll() {
        List<PecaOrdemServico> pecas = pecaOrdemServicoRepository.findAll();
        return ObjectMapper.parseListObjects(pecas, PecaOrdemServicoDTO.class);
    }

    public List<PecaOrdemServicoDTO> buscarPorOrdemServico(Long ordemServicoId) {
        List<PecaOrdemServico> pecas = pecaOrdemServicoRepository.findByOrdemServico_Id(ordemServicoId);
        return ObjectMapper.parseListObjects(pecas, PecaOrdemServicoDTO.class);
    }

    // Exclui a peça e devolve a quantidade usada de volta ao estoque do material.
    public void deletar(Long id) {
        PecaOrdemServico peca = pecaOrdemServicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Peça de ordem de serviço não encontrada"));

        MaterialEstoque material = materialEstoqueRepository.findById(peca.getMaterial().getId())
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));
        material.setQuantidadeEstoque(material.getQuantidadeEstoque() + peca.getQuantidade());
        materialEstoqueRepository.save(material);

        pecaOrdemServicoRepository.delete(peca);
    }
}
