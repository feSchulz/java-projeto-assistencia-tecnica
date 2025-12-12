package com.assitenciaTecnica.logos.initializer;

import org.springframework.stereotype.Component;
import com.assitenciaTecnica.logos.model.Marca;
import com.assitenciaTecnica.logos.model.Modelo;
import com.assitenciaTecnica.logos.repository.MarcaRepository;
import com.assitenciaTecnica.logos.repository.ModeloRepository;

@Component
public class MarcaModeloSeed {
    private final MarcaRepository marcaRepository;
    private final ModeloRepository modeloRepository;

    public MarcaModeloSeed(MarcaRepository marcaRepository,
                           ModeloRepository modeloRepository) {
        this.marcaRepository = marcaRepository;
        this.modeloRepository = modeloRepository;
    }

    public void seed() {
        if (marcaRepository.count() == 0) {
            Marca samsung = new Marca();
            samsung.setNome("Samsung");
            marcaRepository.save(samsung);

            Modelo galaxy = new Modelo();
            galaxy.setNome("Galaxy S23");
            galaxy.setMarca(samsung);
            modeloRepository.save(galaxy);
        }
    }
}

