package com.assitenciaTecnica.logos.initializer;

import org.springframework.stereotype.Component;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.model.Papel;
import com.assitenciaTecnica.logos.model.Usuario;
import com.assitenciaTecnica.logos.repository.FuncionarioRepository;
import com.assitenciaTecnica.logos.repository.PapelRepository;
import com.assitenciaTecnica.logos.repository.UsuarioRepository;

@Component
public class UsuarioSeed {
    private final UsuarioRepository usuarioRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final PapelRepository papelRepository;

    public UsuarioSeed(UsuarioRepository usuarioRepository,
                       FuncionarioRepository funcionarioRepository,
                       PapelRepository papelRepository) {
        this.usuarioRepository = usuarioRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.papelRepository = papelRepository;
    }

    public void seed() {
        if (usuarioRepository.count() == 0) {
            Usuario usuarioAdm = new Usuario();
            usuarioAdm.setNome("Administrador");
            usuarioAdm.setCpf("00000000000");
            usuarioAdm.setEmail("admin@sistema.com");
            usuarioAdm.setTelefone("000000000");
            usuarioRepository.save(usuarioAdm);

            Papel admin = papelRepository.findByCodigo("ADM").orElseThrow();

            Funcionario funcionarioAdm = new Funcionario();
            funcionarioAdm.setUsuario(usuarioAdm);
            funcionarioAdm.setPapel(admin);
            funcionarioAdm.setPapel(admin);
            funcionarioRepository.save(funcionarioAdm);
        }
    }
}
