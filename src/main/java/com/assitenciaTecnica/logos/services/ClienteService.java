package com.assitenciaTecnica.logos.services;


import com.assitenciaTecnica.logos.data.dto.ClienteDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public void salvar(ClienteDTO dto) {
        Cliente cliente = ObjectMapper.parseObject(dto,Cliente.class);
        clienteRepository.save(cliente);
    }

    public List<ClienteDTO> buscar(String termo) {
        List<Cliente> modelCliente = clienteRepository.findByPessoaNomeContainingIgnoreCase(termo);
        return ObjectMapper.parseListObjects(modelCliente, ClienteDTO.class);
    }

    public ClienteDTO buscarPorId(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        return ObjectMapper.parseObject(cliente, ClienteDTO.class);
    }

    public void atualizar(ClienteDTO dto) {

        Cliente cliente = ObjectMapper.parseObject(dto, Cliente.class);
        clienteRepository.save(cliente);
    }
}