package com.assitenciaTecnica.logos.initializer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioSeed usuarioSeed;
    private final PapelSeed papelSeed;
    private final LocalizacaoSeed localizacaoSeed;
    private final MarcaModeloSeed marcaModeloSeed;

    public DataInitializer(UsuarioSeed usuarioSeed,
                           PapelSeed papelSeed,
                           LocalizacaoSeed localizacaoSeed,
                           MarcaModeloSeed marcaModeloSeed) {
        this.usuarioSeed = usuarioSeed;
        this.papelSeed = papelSeed;
        this.localizacaoSeed = localizacaoSeed;
        this.marcaModeloSeed = marcaModeloSeed;
    }

    @Override
    public void run(String... args) throws Exception {
        // ordem de execução dos seeds
        papelSeed.seed();
        usuarioSeed.seed();
        localizacaoSeed.seed();
        marcaModeloSeed.seed();
    }
}

