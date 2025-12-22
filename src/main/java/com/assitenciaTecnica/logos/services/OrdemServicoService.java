package com.assitenciaTecnica.logos.services;

import java.util.List;
import java.util.Optional;
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


        Optional<OrdemServico> osModel=  repositoryOrdemServico.findById(id);
        return ObjectMapper.parseObject(osModel,OrdemServicoDTO.class);
    }
}
