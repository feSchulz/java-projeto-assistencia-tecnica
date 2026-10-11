package com.assitenciaTecnica.logos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assitenciaTecnica.logos.data.dto.MaterialEstoqueDTO;
import com.assitenciaTecnica.logos.data.dto.PaginaDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.MaterialEstoque;
import com.assitenciaTecnica.logos.repositories.MaterialEstoqueRepository;
import com.assitenciaTecnica.logos.repositories.PecaOrdemServicoRepository;

@Service
public class MaterialEstoqueService {

    @Autowired
    private MaterialEstoqueRepository materialEstoqueRepository;
    @Autowired
    private PecaOrdemServicoRepository pecaOrdemServicoRepository;

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

    /**
     * Exclusão lógica: material já usado em alguma ordem de serviço é só inativado; material
     * nunca usado é apagado de verdade.
     *
     * @return true se foi inativado, false se foi apagado
     */
    @Transactional
    public boolean deletar(Long id) {
        MaterialEstoque material = materialEstoqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        if (pecaOrdemServicoRepository.existsByMaterial_Id(id)) {
            material.setAtivo(false);
            materialEstoqueRepository.save(material);
            return true;
        }
        materialEstoqueRepository.delete(material);
        return false;
    }

    public List<MaterialEstoqueDTO> findAll() {
        List<MaterialEstoque> materiais = materialEstoqueRepository.findAllAtivos();
        return ObjectMapper.parseListObjects(materiais, MaterialEstoqueDTO.class);
    }

    public PaginaDTO<MaterialEstoqueDTO> buscarPaginado(int page, int size, String q, boolean abaixoMinimo) {
        PageRequest pageable = PageRequest.of(
                PaginaDTO.paginaSegura(page), PaginaDTO.tamanhoSeguro(size),
                Sort.by(Sort.Direction.ASC, "nome"));
        Page<MaterialEstoque> resultado = materialEstoqueRepository.buscar(
                PaginaDTO.textoBusca(q), abaixoMinimo, pageable);
        return PaginaDTO.de(resultado,
                ObjectMapper.parseListObjects(resultado.getContent(), MaterialEstoqueDTO.class));
    }

    public List<MaterialEstoqueDTO> buscarPorNome(String nome) {
        List<MaterialEstoque> materiais = materialEstoqueRepository.findByNomeContainingIgnoreCase(nome).stream()
                .filter(m -> !Boolean.FALSE.equals(m.getAtivo()))
                .toList();
        return ObjectMapper.parseListObjects(materiais, MaterialEstoqueDTO.class);
    }
}
