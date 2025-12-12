package com.assitenciaTecnica.logos.initializer;

import org.springframework.stereotype.Component;
import com.assitenciaTecnica.logos.model.Papel;
import com.assitenciaTecnica.logos.repository.PapelRepository;


@Component
public class PapelSeed {
    private final PapelRepository papelRepository;

    public PapelSeed(PapelRepository papelRepository) {
        this.papelRepository = papelRepository;
    }

    public void seed() {
        if (papelRepository.count() == 0) {
            Papel admin = new Papel();
            admin.setCodigo("ADM");
            admin.setNome("Administrador do sistema");
            papelRepository.save(admin);
        }
    }
}
