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
    public CidadeDTO buscarCidadesById(Long idCidade) {
        Cidade cidade = cidadeRepository.findById(idCidade)
                .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));
        return ObjectMapper.parseObject(cidade, CidadeDTO.class);
    }

    // Retorna a entidade Cidade de verdade (via repositório), não uma cópia
    // gerada pelo Dozer. Usar isso (em vez de buscarCidadesById + Dozer) antes
    // de um mapeamento DTO -> Entidade evita o erro "Illegal object type for
    // the method 'setCidade'": quando um Cidade "sintetizado" pelo Dozer é
    // colocado dentro do DTO e depois o mapeamento externo (ex.: FuncionarioDTO
    // -> Funcionario) tenta remapear essa Cidade de novo, o Dozer cria outra
    // instância que não bate com o tipo esperado pelo setter, mesmo os dois
    // se chamando "Cidade". Mesmo cuidado já aplicado à resolução de Papel em
    // FuncionarioController (busca direto no repositório, nunca via Dozer).
    public Cidade buscarCidadeEntidadeById(Long idCidade) {
        return cidadeRepository.findById(idCidade)
                .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));
    }

}