package com.assitenciaTecnica.logos.services;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.assitenciaTecnica.logos.data.dto.CidadeDTO;
import com.assitenciaTecnica.logos.data.dto.EstadoDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Cidade;
import com.assitenciaTecnica.logos.model.Estado;
import com.assitenciaTecnica.logos.repositories.CidadeRepository;
import com.assitenciaTecnica.logos.repositories.EstadoRepository;

@Service
public class EnderecoService {

    @Autowired
    private EstadoRepository estadoRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    public List<EstadoDTO> buscarEstados() {
        List<Estado> modelEstado = estadoRepository.findAll();
        List<EstadoDTO> estadoDTOS = ObjectMapper.parseListObjects(modelEstado, EstadoDTO.class);
        return estadoDTOS;
    }

    public List<CidadeDTO> buscarCidades(Long idEstado) {
        Optional<Estado> estdo = estadoRepository.findById(idEstado);
        if(estdo.isPresent()){
            List<Cidade> modelCidades = estdo.get().getCidades();
            return ObjectMapper.parseListObjects(modelCidades, CidadeDTO.class);
        }
        return new ArrayList<CidadeDTO>();
    }

}