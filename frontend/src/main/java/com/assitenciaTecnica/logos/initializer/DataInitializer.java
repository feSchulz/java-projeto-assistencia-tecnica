package com.assitenciaTecnica.logos.initializer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioSeed usuarioSeed;
    private final PapelSeed papelSeed;

    public DataInitializer(UsuarioSeed usuarioSeed,
                           PapelSeed papelSeed) {
        this.usuarioSeed = usuarioSeed;
        this.papelSeed = papelSeed;
    }

    @Override
    public void run(String... args) throws Exception {
        // ordem de execução dos seeds
        papelSeed.seed();
        usuarioSeed.seed();
    }
}

