package com.assitenciaTecnica.logos.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assitenciaTecnica.logos.data.dto.GarantiaDTO;
import com.assitenciaTecnica.logos.data.dto.HistoricoStatusDTO;
import com.assitenciaTecnica.logos.data.dto.MudancaStatusDTO;
import com.assitenciaTecnica.logos.data.dto.OrdemServicoDTO;
import com.assitenciaTecnica.logos.data.dto.PaginaDTO;
import com.assitenciaTecnica.logos.data.dto.ValoresOSDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.HistoricoStatusOS;
import com.assitenciaTecnica.logos.model.MaterialEstoque;
import com.assitenciaTecnica.logos.model.OrdemServico;
import com.assitenciaTecnica.logos.model.PecaOrdemServico;
import com.assitenciaTecnica.logos.model.enums.StatusOrdemServico;
import com.assitenciaTecnica.logos.repositories.HistoricoStatusRepository;
import com.assitenciaTecnica.logos.repositories.MaterialEstoqueRepository;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;
import com.assitenciaTecnica.logos.repositories.PecaOrdemServicoRepository;

@Service
public class OrdemServicoService {
    @Autowired
    OrdemServicoRepository repositoryOrdemServico;
    @Autowired
    private HistoricoStatusRepository historicoStatusRepository;
    @Autowired
    private PecaOrdemServicoRepository pecaOrdemServicoRepository;
    @Autowired
    private MaterialEstoqueRepository materialEstoqueRepository;
    @Autowired
    private UsuarioLogadoService usuarioLogadoService;

    // ------------------------------------------------------------------
    // Criação / edição / exclusão
    // ------------------------------------------------------------------

    @Transactional
    public void salvar(OrdemServicoDTO os) {
        OrdemServico osModel = ObjectMapper.parseObject(os, OrdemServico.class);

        StatusOrdemServico status = osModel.getStatus();
        aplicarStatus(osModel, null, status);

        OrdemServico salva = repositoryOrdemServico.save(osModel);
        registrarHistorico(salva.getId(), null, status, "OS criada");
    }

    // Edição dos dados da OS. Altera a entidade já gerenciada (em vez de criar uma
    // nova via Dozer) para preservar as peças da OS (cascade/orphanRemoval) e os
    // campos controlados pelo sistema (data de abertura, data de conclusão).
    @Transactional
    public void atualizar(OrdemServicoDTO os) {
        OrdemServico existente = repositoryOrdemServico.findById(os.getId())
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));

        if (os.getDescricaoCliente() != null) existente.setDescricaoCliente(os.getDescricaoCliente());
        if (os.getDescricaoTecnico() != null) existente.setDescricaoTecnico(os.getDescricaoTecnico());
        if (os.getPrazoConclusao() != null) existente.setPrazoConclusao(os.getPrazoConclusao());
        if (os.getValor() != null) existente.setValor(os.getValor());
        if (os.getValorOrcado() != null) existente.setValorOrcado(os.getValorOrcado());
        if (os.getValorMaoDeObra() != null) existente.setValorMaoDeObra(os.getValorMaoDeObra());
        if (os.getGarantiaDias() != null) existente.setGarantiaDias(os.getGarantiaDias());
        if (os.getEquipamento() != null) existente.setEquipamento(os.getEquipamento());
        if (os.getCliente() != null) existente.setCliente(os.getCliente());
        if (os.getFuncionarioResponsavel() != null) existente.setFuncionarioResponsavel(os.getFuncionarioResponsavel());

        StatusOrdemServico antigo = existente.getStatus();
        StatusOrdemServico novo = statusDoDto(os);
        if (novo != null && novo != antigo) {
            validarTransicao(antigo, novo);
            aplicarStatus(existente, antigo, novo);
            registrarHistorico(existente.getId(), antigo, novo, "Status alterado na edição da OS");
        }

        repositoryOrdemServico.save(existente);
    }

    private StatusOrdemServico statusDoDto(OrdemServicoDTO os) {
        try {
            return os.getStatus();
        } catch (RuntimeException e) {
            return null; // status ausente/inválido no corpo: mantém o atual
        }
    }

    // Exclui a OS devolvendo ao estoque as peças que ela tinha consumido e
    // apagando o histórico de status dela.
    @Transactional
    public void deletar(Long id) {
        OrdemServico osModel = repositoryOrdemServico.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));

        for (PecaOrdemServico peca : pecaOrdemServicoRepository.findByOrdemServico_Id(id)) {
            MaterialEstoque material = peca.getMaterial();
            if (material != null && peca.getQuantidade() != null) {
                material.setQuantidadeEstoque(material.getQuantidadeEstoque() + peca.getQuantidade());
                materialEstoqueRepository.save(material);
            }
        }

        historicoStatusRepository.deleteByOrdemServicoId(id);
        repositoryOrdemServico.delete(osModel);
    }

    // ------------------------------------------------------------------
    // Status, histórico, orçamento e garantia
    // ------------------------------------------------------------------

    @Transactional
    public OrdemServicoDTO alterarStatus(Long id, MudancaStatusDTO pedido) {
        OrdemServico os = repositoryOrdemServico.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));

        StatusOrdemServico novo = parseStatus(pedido.getStatus());
        StatusOrdemServico antigo = os.getStatus();
        validarTransicao(antigo, novo);

        if (pedido.getValorOrcado() != null) {
            if (pedido.getValorOrcado() < 0) {
                throw new IllegalArgumentException("O valor orçado não pode ser negativo.");
            }
            os.setValorOrcado(pedido.getValorOrcado());
        }

        // Orçamento aprovado: o valor orçado passa a ser o valor da OS.
        if (novo == StatusOrdemServico.APROVADA && os.getValorOrcado() != null) {
            os.setValor(os.getValorOrcado());
        }

        if (novo == StatusOrdemServico.CONCLUIDA && pedido.getGarantiaDias() != null) {
            if (pedido.getGarantiaDias() < 0) {
                throw new IllegalArgumentException("Os dias de garantia não podem ser negativos.");
            }
            os.setGarantiaDias(pedido.getGarantiaDias() == 0 ? null : pedido.getGarantiaDias());
        }

        aplicarStatus(os, antigo, novo);
        repositoryOrdemServico.save(os);
        registrarHistorico(id, antigo, novo, pedido.getObservacao());

        return ObjectMapper.parseObject(os, OrdemServicoDTO.class);
    }

    @Transactional(readOnly = true)
    public List<HistoricoStatusDTO> historico(Long ordemServicoId) {
        List<HistoricoStatusDTO> resultado = new ArrayList<>();
        for (HistoricoStatusOS h : historicoStatusRepository
                .findByOrdemServicoIdOrderByDataHoraDescIdDesc(ordemServicoId)) {
            HistoricoStatusDTO dto = new HistoricoStatusDTO();
            dto.setId(h.getId());
            dto.setStatusAnterior(h.getStatusAnterior() != null
                    ? StatusOrdemServico.fromCodigo(h.getStatusAnterior()).name() : null);
            dto.setStatusNovo(StatusOrdemServico.fromCodigo(h.getStatusNovo()).name());
            dto.setFuncionarioNome(h.getFuncionarioNome());
            dto.setFuncionarioLogin(h.getFuncionarioLogin());
            dto.setDataHora(h.getDataHora());
            dto.setObservacao(h.getObservacao());
            resultado.add(dto);
        }
        return resultado;
    }

    // Garantia ainda em vigor para o equipamento (OS concluída com dias de garantia
    // cujo fim ainda não passou). Retorna a que vence por último, ou null.
    @Transactional(readOnly = true)
    public GarantiaDTO garantiaVigente(Long equipamentoId) {
        GregorianCalendar agora = new GregorianCalendar();
        OrdemServico melhor = null;
        GregorianCalendar melhorFim = null;

        for (OrdemServico os : repositoryOrdemServico.findByEquipamento_IdAndStatus(
                equipamentoId, StatusOrdemServico.CONCLUIDA.getCodigo())) {
            if (os.getGarantiaDias() == null || os.getGarantiaDias() <= 0 || os.getDataConclusao() == null) {
                continue;
            }
            GregorianCalendar fim = (GregorianCalendar) os.getDataConclusao().clone();
            fim.add(Calendar.DAY_OF_MONTH, os.getGarantiaDias());
            if (fim.before(agora)) continue;
            if (melhorFim == null || fim.after(melhorFim)) {
                melhor = os;
                melhorFim = fim;
            }
        }

        if (melhor == null) return null;

        GarantiaDTO dto = new GarantiaDTO();
        dto.setOrdemServicoId(melhor.getId());
        dto.setDataConclusao(melhor.getDataConclusao());
        dto.setGarantiaDias(melhor.getGarantiaDias());
        dto.setFimGarantia(melhorFim);
        return dto;
    }

    // ------------------------------------------------------------------
    // Valores (mão de obra + peças)
    // ------------------------------------------------------------------

    @Transactional
    public OrdemServicoDTO atualizarValores(Long id, ValoresOSDTO pedido) {
        OrdemServico os = repositoryOrdemServico.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));

        if (pedido.getValorMaoDeObra() != null) {
            if (pedido.getValorMaoDeObra() < 0) {
                throw new IllegalArgumentException("A mão de obra não pode ser negativa.");
            }
            os.setValorMaoDeObra(pedido.getValorMaoDeObra());
        }

        if (pedido.isAplicarTotal()) {
            BigDecimal pecas = BigDecimal.ZERO;
            for (PecaOrdemServico peca : pecaOrdemServicoRepository.findByOrdemServico_Id(id)) {
                if (peca.getValorTotal() != null) pecas = pecas.add(peca.getValorTotal());
            }
            double maoDeObra = os.getValorMaoDeObra() != null ? os.getValorMaoDeObra() : 0d;
            os.setValor(pecas.doubleValue() + maoDeObra);
        }

        repositoryOrdemServico.save(os);
        return ObjectMapper.parseObject(os, OrdemServicoDTO.class);
    }

    // ------------------------------------------------------------------
    // Consultas
    // ------------------------------------------------------------------

    public List<OrdemServicoDTO> findAll() {
        List<OrdemServico> os = repositoryOrdemServico.findAll();
        return ObjectMapper.parseListObjects(os,OrdemServicoDTO.class);
    }

    public PaginaDTO<OrdemServicoDTO> buscarPaginado(int page, int size, String q, Long status, boolean atrasadas) {
        PageRequest pageable = PageRequest.of(
                PaginaDTO.paginaSegura(page),
                PaginaDTO.tamanhoSeguro(size),
                Sort.by(Sort.Direction.DESC, "dataAbertura").and(Sort.by(Sort.Direction.DESC, "id")));

        Page<OrdemServico> resultado = repositoryOrdemServico.buscar(
                status == null ? -1L : status,
                PaginaDTO.textoBusca(q),
                atrasadas,
                new GregorianCalendar(),
                pageable);

        return PaginaDTO.de(resultado,
                ObjectMapper.parseListObjects(resultado.getContent(), OrdemServicoDTO.class));
    }

    public OrdemServicoDTO buscarPorId(Long id) {
        OrdemServico osModel = repositoryOrdemServico.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem de serviço não encontrada"));
        return ObjectMapper.parseObject(osModel,OrdemServicoDTO.class);
    }

    public List<OrdemServicoDTO> buscarPorCliente(Long clienteId) {
        List<OrdemServico> os = repositoryOrdemServico.findByCliente_Id(clienteId);
        return ObjectMapper.parseListObjects(os, OrdemServicoDTO.class);
    }

    public List<OrdemServicoDTO> buscarPorStatus(Long status) {
        List<OrdemServico> os = repositoryOrdemServico.findByStatus(status);
        return ObjectMapper.parseListObjects(os, OrdemServicoDTO.class);
    }

    // ------------------------------------------------------------------
    // Auxiliares
    // ------------------------------------------------------------------

    private StatusOrdemServico parseStatus(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Informe o novo status.");
        }
        try {
            return StatusOrdemServico.valueOf(nome.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status inválido: " + nome);
        }
    }

    private void validarTransicao(StatusOrdemServico antigo, StatusOrdemServico novo) {
        if (!antigo.podeIrPara(novo)) {
            throw new IllegalStateException(
                    "Não é possível mudar a OS de " + antigo.name() + " para " + novo.name() + ".");
        }
    }

    // Grava o novo status e controla a data de conclusão, que é do sistema (não
    // vem do cliente da API):
    //  - CONCLUIDA/CANCELADA: grava a data/hora atual na primeira vez que a OS
    //    entra nesse status (a mesma data é mantida se já estava nele);
    //  - qualquer outro status (ex.: OS reaberta): limpa a data.
    // É essa data que o Dashboard usa para somar o faturamento do mês.
    private void aplicarStatus(OrdemServico os, StatusOrdemServico antigo, StatusOrdemServico novo) {
        os.setStatus(novo);
        if (!novo.isFinalizada()) {
            os.setDataConclusao(null);
        } else if (antigo != novo || os.getDataConclusao() == null) {
            os.setDataConclusao(new GregorianCalendar());
        }
    }

    private void registrarHistorico(Long ordemServicoId, StatusOrdemServico antigo,
                                    StatusOrdemServico novo, String observacao) {
        HistoricoStatusOS h = new HistoricoStatusOS();
        h.setOrdemServicoId(ordemServicoId);
        h.setStatusAnterior(antigo != null ? antigo.getCodigo() : null);
        h.setStatusNovo(novo.getCodigo());
        h.setFuncionarioLogin(usuarioLogadoService.login());
        h.setFuncionarioNome(usuarioLogadoService.nome());
        h.setDataHora(LocalDateTime.now());
        if (observacao != null && !observacao.isBlank()) {
            String texto = observacao.trim();
            h.setObservacao(texto.length() > 500 ? texto.substring(0, 500) : texto);
        }
        historicoStatusRepository.save(h);
    }
}
