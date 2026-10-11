package com.assitenciaTecnica.logos.services;

import java.util.GregorianCalendar;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.assitenciaTecnica.logos.data.dto.OrdemServicoDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.OrdemServico;
import com.assitenciaTecnica.logos.model.enums.StatusOrdemServico;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;

@Service
public class OrdemServicoService {
    @Autowired
    OrdemServicoRepository repositoryOrdemServico;


    public void salvar(OrdemServicoDTO os) {
        OrdemServico osModel = ObjectMapper.parseObject(os,OrdemServico.class);
        aplicarDataConclusao(osModel);
        repositoryOrdemServico.save(osModel);

    }

    public void atualizar(OrdemServicoDTO os) {

        OrdemServico osModel = ObjectMapper.parseObject(os,OrdemServico.class);
        aplicarDataConclusao(osModel);
        repositoryOrdemServico.save(osModel);
    }

    // A data de conclusão é controlada pelo sistema, não pelo cliente da API:
    //  - status CONCLUIDA ou CANCELADA: grava a data/hora atual na primeira vez
    //    que a OS entra nesse status; se ela já estava nesse mesmo status,
    //    mantém a data que já estava gravada (editar a OS não "remarca" a conclusão);
    //  - qualquer outro status (ex.: OS reaberta): limpa a data.
    // É essa data que o Dashboard usa para somar o faturamento do mês.
    private void aplicarDataConclusao(OrdemServico os) {
        StatusOrdemServico status = os.getStatus();
        boolean finalizada = status == StatusOrdemServico.CONCLUIDA
                || status == StatusOrdemServico.CANCELADA;

        if (!finalizada) {
            os.setDataConclusao(null);
            return;
        }

        GregorianCalendar dataExistente = null;
        if (os.getId() != null) {
            OrdemServico existente = repositoryOrdemServico.findById(os.getId()).orElse(null);
            if (existente != null && existente.getStatus() == status) {
                dataExistente = existente.getDataConclusao();
            }
        }
        os.setDataConclusao(dataExistente != null ? dataExistente : new GregorianCalendar());
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
