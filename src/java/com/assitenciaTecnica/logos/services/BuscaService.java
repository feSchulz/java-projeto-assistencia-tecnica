package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.data.dto.BuscaItemDTO;
import com.assitenciaTecnica.logos.data.dto.BuscaResultadoDTO;
import com.assitenciaTecnica.logos.data.dto.PaginaDTO;
import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.model.Equipamento;
import com.assitenciaTecnica.logos.model.OrdemServico;
import com.assitenciaTecnica.logos.repositories.ClienteRepository;
import com.assitenciaTecnica.logos.repositories.EquipamentoRepository;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;
import java.util.GregorianCalendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Busca global do cabeçalho: procura o mesmo texto em ordens de serviço, clientes e
 * equipamentos e devolve poucos resultados de cada, já resumidos (sem entidades JPA).
 */
@Service
public class BuscaService {

    private static final int LIMITE = 5;

    @Autowired
    private OrdemServicoRepository ordemServicoRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @Transactional(readOnly = true)
    public BuscaResultadoDTO buscar(String texto) {
        BuscaResultadoDTO resultado = new BuscaResultadoDTO();
        String q = PaginaDTO.textoBusca(texto);
        if (q.length() < 2) {
            return resultado;
        }
        String digitos = PaginaDTO.soDigitos(q);

        for (OrdemServico os : ordemServicoRepository.buscar(-1L, q, false, new GregorianCalendar(),
                PageRequest.of(0, LIMITE, Sort.by(Sort.Direction.DESC, "dataAbertura"))).getContent()) {
            String equipamento = os.getEquipamento() != null ? os.getEquipamento().getEquipamento() : "";
            String cliente = nomeDoCliente(os.getCliente());
            resultado.getOrdens().add(new BuscaItemDTO(
                    os.getId(), "OS #" + os.getId(), equipamento + " — " + cliente, os.getStatus().name()));
        }

        for (Cliente c : clienteRepository.buscar(q, digitos,
                PageRequest.of(0, LIMITE, Sort.by(Sort.Direction.ASC, "usuario.nome"))).getContent()) {
            String contato = c.getPessoa() != null && c.getPessoa().getTelefone() != null
                    ? c.getPessoa().getTelefone() : "";
            resultado.getClientes().add(new BuscaItemDTO(c.getId(), nomeDoCliente(c), contato, null));
        }

        for (Equipamento e : equipamentoRepository.buscar(q,
                PageRequest.of(0, LIMITE, Sort.by(Sort.Direction.ASC, "equipamento"))).getContent()) {
            String marca = e.getMarca() != null ? e.getMarca().getNome() : "";
            String modelo = e.getModelo() != null ? e.getModelo().getNome() : "";
            resultado.getEquipamentos().add(new BuscaItemDTO(
                    e.getId(), e.getEquipamento(),
                    (marca + " " + modelo).trim() + " — " + nomeDoCliente(e.getCliente()), null));
        }

        return resultado;
    }

    private String nomeDoCliente(Cliente cliente) {
        if (cliente == null || cliente.getPessoa() == null || cliente.getPessoa().getNome() == null) {
            return "";
        }
        return cliente.getPessoa().getNome();
    }
}
