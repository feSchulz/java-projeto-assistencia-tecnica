package com.assitenciaTecnica.logos.services;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.assitenciaTecnica.logos.data.dto.CidadeDTO;
import com.assitenciaTecnica.logos.data.dto.EstadoDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Cidade;
import com.assitenciaTecnica.logos.model.Estado;
import com.assitenciaTecnica.logos.repository.CidadeRepository;
import com.assitenciaTecnica.logos.repository.EstadoRepository;

@Service
public class EnderecoService {

    @Autowired
    private EstadoRepository estadoRepository;

    @Autowired
    private CidadeRepository cidadeRepository;

    public List<EstadoDTO> buscarEstados(String termo) {
        List<Estado> modelEstado = estadoRepository.findByNomeContainingIgnoreCase(termo);
        List<EstadoDTO> estadoDTOS = ObjectMapper.parseListObjects(modelEstado, EstadoDTO.class);
        return estadoDTOS;
    }

    public List<CidadeDTO> buscarCidades(Long idEstado) {

        List<Cidade> modelCidades = cidadeRepository.findByEstadoId(idEstado);
        return ObjectMapper.parseListObjects(modelCidades, CidadeDTO.class);
    }

    public EstadoDTO buscarEstadoPorCidade(Long idCidade) {
        Cidade cidade = cidadeRepository.findById(idCidade)
                .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));
        Estado estado = cidade.getEstado();
        return ObjectMapper.parseObject(estado, EstadoDTO.class);
    }
}