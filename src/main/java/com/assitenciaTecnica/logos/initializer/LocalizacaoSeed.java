package com.assitenciaTecnica.logos.initializer;

import org.springframework.stereotype.Component;
import com.assitenciaTecnica.logos.model.Cidade;
import com.assitenciaTecnica.logos.model.Estado;
import com.assitenciaTecnica.logos.repository.CidadeRepository;
import com.assitenciaTecnica.logos.repository.EstadoRepository;


@Component
public class LocalizacaoSeed {
    private final EstadoRepository estadoRepository;
    private final CidadeRepository cidadeRepository;

    public LocalizacaoSeed(EstadoRepository estadoRepository,
                           CidadeRepository cidadeRepository) {
        this.estadoRepository = estadoRepository;
        this.cidadeRepository = cidadeRepository;
    }

    public void seed() {
        if (estadoRepository.count() == 0) {
            Estado sc = new Estado();
            sc.setNome("Santa Catarina");
            estadoRepository.save(sc);

            Cidade joinville = new Cidade();
            joinville.setNome("Joinville");
            joinville.setEstado(sc);
            cidadeRepository.save(joinville);
        }
    }
}
