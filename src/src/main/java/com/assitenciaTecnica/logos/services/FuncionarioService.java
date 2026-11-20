package com.assitenciaTecnica.logos.services;

import com.assitenciaTecnica.logos.data.dto.FuncionarioDTO;
import com.assitenciaTecnica.logos.data.dto.PerfilDTO;
import com.assitenciaTecnica.logos.mapper.ObjectMapper;
import com.assitenciaTecnica.logos.model.Cidade;
import com.assitenciaTecnica.logos.model.Endereco;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.model.Usuario;
import com.assitenciaTecnica.logos.repositories.CidadeRepository;
import com.assitenciaTecnica.logos.repositories.EstadoRepository;
import com.assitenciaTecnica.logos.repositories.FuncionarioRepository;
import com.assitenciaTecnica.logos.repositories.OrdemServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private CidadeRepository cidadeRepository;
    @Autowired
    private EstadoRepository estadoRepository;
    @Autowired
    private OrdemServicoRepository ordemServicoRepository;
    @Autowired
    private UsuarioLogadoService usuarioLogadoService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void salvar(FuncionarioDTO dto) {
        Funcionario funcionario = ObjectMapper.parseObject(dto, Funcionario.class);
        funcionario.setSenha(passwordEncoder.encode(dto.getSenha()));
        funcionarioRepository.save(funcionario);
    }

    public void atualizar(FuncionarioDTO dto) {
        Funcionario existente = funcionarioRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado"));

        Funcionario atualizado = ObjectMapper.parseObject(dto, Funcionario.class);

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            // veio senha nova em texto puro -> gera hash novo
            atualizado.setSenha(passwordEncoder.encode(dto.getSenha()));
        } else {
            // nenhuma senha enviada -> mantém o hash já salvo, sem re-criptografar
            atualizado.setSenha(existente.getSenha());
        }

        funcionarioRepository.save(atualizado);
    }

    public List<FuncionarioDTO> buscarPorNome(String nome) {
        List<Funcionario> funcionarios = funcionarioRepository.findByUsuario_NomeIgnoreCase(nome).stream()
                .filter(f -> !Boolean.FALSE.equals(f.getAtivo()))
                .toList();
        return ObjectMapper.parseListObjects(funcionarios, FuncionarioDTO.class);
    }

    public List<FuncionarioDTO> findAll() {
        // Só funcionários ativos (os inativados ficam só no banco).
        List<Funcionario> funcionarios = funcionarioRepository.findAllAtivos();
        return ObjectMapper.parseListObjects(funcionarios, FuncionarioDTO.class);
    }

    /**
     * Exclusão lógica: funcionário responsável por ordens de serviço é só inativado (não
     * consegue mais entrar no sistema, mas as OS continuam com o nome dele); sem nenhuma OS
     * é apagado de verdade. Ninguém pode excluir o próprio usuário.
     *
     * @return true se foi inativado, false se foi apagado
     */
    @Transactional
    public boolean deletar(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado"));

        String loginAtual = usuarioLogadoService.login();
        if (loginAtual != null && loginAtual.equals(funcionario.getLogin())) {
            throw new IllegalStateException("Você não pode excluir o seu próprio usuário.");
        }

        if (ordemServicoRepository.existsByFuncionarioResponsavel_Id(id)) {
            funcionario.setAtivo(false);
            funcionarioRepository.save(funcionario);
            return true;
        }
        funcionarioRepository.delete(funcionario);
        return false;
    }

    public FuncionarioDTO buscarPorId(Long id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionario não encontrado"));
        return ObjectMapper.parseObject(funcionario, FuncionarioDTO.class);
    }

    // ---- Tela "Meu perfil" -------------------------------------------------
    // Usa um DTO plano (PerfilDTO): só textos/números, sem entidades JPA,
    // sem Dozer e sem proxies do Hibernate na resposta. O login vem do token
    // JWT já validado pelo JwtAuthenticationFilter.
    @Transactional(readOnly = true)
    public PerfilDTO buscarPerfil(String login) {
        Funcionario funcionario = funcionarioRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        PerfilDTO dto = new PerfilDTO();
        dto.setId(funcionario.getId());
        dto.setLogin(funcionario.getLogin());

        if (funcionario.getPapel() != null) {
            dto.setPapelCodigo(funcionario.getPapel().getCodigo());
            dto.setPapelNome(funcionario.getPapel().getNome());
        }

        Usuario usuario = funcionario.getUsuario();
        if (usuario != null) {
            dto.setNome(usuario.getNome());
            dto.setCpf(usuario.getCpf());
            dto.setTelefone(usuario.getTelefone());
            dto.setEmail(usuario.getEmail());

            Endereco endereco = usuario.getEndereco();
            if (endereco != null) {
                dto.setRua(endereco.getRua());
                dto.setNumero(endereco.getNumero());
                dto.setBairro(endereco.getBairro());
                dto.setComplemento(endereco.getComplemento());
                dto.setCep(endereco.getCep());
                if (endereco.getCidade() != null) {
                    dto.setCidadeId(endereco.getCidade().getId());
                    dto.setCidadeNome(endereco.getCidade().getNome());
                    // Cidade não aponta para Estado: busca o estado que contém essa cidade
                    estadoRepository.findByCidades_Id(endereco.getCidade().getId()).ifPresent(estado -> {
                        dto.setEstadoId(estado.getId());
                        dto.setEstadoNome(estado.getNome());
                    });
                }
            }
        }
        return dto;
    }

    // Atualiza o próprio perfil. Nunca altera login nem papel (mesmo que
    // venham no corpo), para que o usuário não troque o próprio nível de acesso.
    // Altera direto a entidade gerenciada, sem Dozer.
    @Transactional
    public void atualizarPerfil(String login, PerfilDTO dto) {
        Funcionario existente = funcionarioRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        Usuario usuario = existente.getUsuario();
        if (usuario == null) {
            throw new RuntimeException("Funcionário sem dados de usuário");
        }
        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());
        usuario.setEmail(dto.getEmail());

        Endereco endereco = usuario.getEndereco();
        if (endereco == null) {
            endereco = new Endereco();
            usuario.setEndereco(endereco);
        }
        endereco.setRua(dto.getRua());
        endereco.setNumero(dto.getNumero());
        endereco.setBairro(dto.getBairro());
        // complemento é NOT NULL no banco
        endereco.setComplemento(dto.getComplemento() == null ? "" : dto.getComplemento());
        endereco.setCep(dto.getCep());

        if (dto.getCidadeId() != null) {
            Cidade cidade = cidadeRepository.findById(dto.getCidadeId())
                    .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));
            endereco.setCidade(cidade);
        }

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        funcionarioRepository.save(existente);
    }
}
