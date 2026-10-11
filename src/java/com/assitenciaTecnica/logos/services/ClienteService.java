package com.assitenciaTecnica.logos.services;


import com.assitenciaTecnica.logos.data.dto.ClienteDTO;
import com.assitenciaTecnica.logos.data.dto.PaginaDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.repositories.ClienteRepository;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private OrdemServicoRepository ordemServicoRepository;

    public void salvar(ClienteDTO dto) {
        Cliente cliente = ObjectMapper.parseObject(dto,Cliente.class);
        clienteRepository.save(cliente);
    }

    public List<ClienteDTO> buscar(String termo) {
        List<Cliente> modelCliente = clienteRepository.findByUsuario_NomeIgnoreCase(termo).stream()
                .filter(c -> !Boolean.FALSE.equals(c.getAtivo()))
                .toList();
        return ObjectMapper.parseListObjects(modelCliente, ClienteDTO.class);
    }

    public ClienteDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return ObjectMapper.parseObject(cliente, ClienteDTO.class);
    }

    public void atualizar(ClienteDTO dto) {

        Cliente cliente = ObjectMapper.parseObject(dto, Cliente.class);
        clienteRepository.save(cliente);
    }

    // Só clientes ativos (os inativados ficam só no banco, preservando o histórico das OS).
    public List<ClienteDTO> findAll() {
        List<Cliente> modelCliente = clienteRepository.findAllAtivos();
        return ObjectMapper.parseListObjects(modelCliente, ClienteDTO.class);
    }

    public PaginaDTO<ClienteDTO> buscarPaginado(int page, int size, String q) {
        PageRequest pageable = PageRequest.of(
                PaginaDTO.paginaSegura(page), PaginaDTO.tamanhoSeguro(size),
                Sort.by(Sort.Direction.ASC, "usuario.nome"));
        Page<Cliente> resultado = clienteRepository.buscar(
                PaginaDTO.textoBusca(q), PaginaDTO.soDigitos(q), pageable);
        return PaginaDTO.de(resultado,
                ObjectMapper.parseListObjects(resultado.getContent(), ClienteDTO.class));
    }

    /**
     * Exclusão lógica: cliente com ordens de serviço é só inativado (some das listas, mas as
     * OS dele continuam com o histórico); cliente sem nenhuma OS é apagado de verdade.
     *
     * @return true se foi inativado, false se foi apagado
     */
    @Transactional
    public boolean deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        if (ordemServicoRepository.existsByCliente_Id(id)) {
            cliente.setAtivo(false);
            clienteRepository.save(cliente);
            return true;
        }
        clienteRepository.delete(cliente);
        return false;
    }
}
