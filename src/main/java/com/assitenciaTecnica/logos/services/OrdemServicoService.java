package com.assitenciaTecnica.logos.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.assitenciaTecnica.logos.data.dto.OrdemServicoDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.OrdemServico;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;

@Service
public class OrdemServicoService {
    @Autowired
    OrdemServicoRepository repositoryOrdemServico;


    public void salvar(OrdemServicoDTO os) {
        OrdemServico osModel = ObjectMapper.parseObject(os,OrdemServico.class);
        repositoryOrdemServico.save(osModel);

    }

    public void atualizar(OrdemServicoDTO os) {

        OrdemServico osModel = ObjectMapper.parseObject(os,OrdemServico.class);
        repositoryOrdemServico.save(osModel);
    }

    public List<OrdemServicoDTO> findAll() {
        List<OrdemServico> os = repositoryOrdemServico.findAll();
        return ObjectMapper.parseListObjects(os,OrdemServicoDTO.class);
    }

    public OrdemServicoDTO buscarPorId(Long id) {
        OrdemServico osModel = repositoryOrdemServico.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));
        return ObjectMapper.parseObject(osModel,OrdemServicoDTO.class);
    }

    public void deletar(Long id) {
        OrdemServico osModel = repositoryOrdemServico.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));
        repositoryOrdemServico.delete(osModel);
    }

    public List<OrdemServicoDTO> buscarPorCliente(Long clienteId) {
        List<OrdemServico> os = repositoryOrdemServico.findByCliente_Id(clienteId);
        return ObjectMapper.parseListObjects(os, OrdemServicoDTO.class);
    }

    public List<OrdemServicoDTO> buscarPorStatus(Long status) {
        List<OrdemServico> os = repositoryOrdemServico.findByStatus(status);
        return ObjectMapper.parseListObjects(os, OrdemServicoDTO.class);
    }
}
