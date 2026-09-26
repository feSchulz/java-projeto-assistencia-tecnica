package com.assitenciaTecnica.logos.model.enums;

public enum StatusOrdemServico {
    ABERTA(0L),
    EM_ANDAMENTO(1L),
    CONCLUIDA(2L),
    CANCELADA(3L);

    private final Long codigo;

    StatusOrdemServico(Long codigo) {
        this.codigo = codigo;
    }

    public Long getCodigo() {
        return codigo;
    }

    public static StatusOrdemServico fromCodigo(Long codigo) {
        for (StatusOrdemServico status : StatusOrdemServico.values()) {
            if (status.getCodigo() == codigo) {
                return status;
            }
        }
        throw new IllegalArgumentException("Código inválido para StatusOrdemServico: " + codigo);
    }
}
